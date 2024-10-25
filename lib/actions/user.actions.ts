'use server'

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { plaidClient } from '@/lib/plaid';
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";



export const getUserInfo = async ( userId:string ) => {
    try {
      const { database } = await createAdminClient();
        console.log(userId)
      const user = await database.listDocuments(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_USERS_COLLECTION_ID!,
        [Query.equal('userId', [userId])]
      )
      console.log('getuserinfoquery res', user)
      if (user.documents.length == 0) {
        return 0
      }

      return parseStringify(user.documents[0]);
    } catch (error) {
      console.log(error)
    }
  }
//   9765e1c0333c48acb48a5b411e98f0a8
export const pushUserToAppwriteAndMakeSession = async ( userData: UserObjectParams ) => {
    try {
        const { account, database } = await createAdminClient();
        console.log('pushtoappwrite', userData)
        const userQuery = await getUserInfo(userData.users_id)
        console.log('pushtoappwrite query res', userQuery)
        const userExists = userQuery != 0

        let newUserAccount
        if (!userExists){

            newUserAccount = await account.create(
                ID.unique(), 
                userData.email, 
                `${userData.users_id}${userData.email}`, 
                `${userData.first_name} ${userData.last_name}`
              );
          
              if(!newUserAccount) throw new Error('Error creating user')
          
            
            const dwollaData = {
                firstName: userData.first_name,
                lastName: userData.last_name,
                email: userData.email,
                type: 'personal',
                address1: userData.address1,
                city: userData.city,
                state: userData.state,
                postalCode: userData.postalCode,
                dateOfBirth: userData.dateOfBirth,
                ssn: userData.ssn
            }
            
            console.log('dwolla data', dwollaData)
            const dwollaCustomerUrl = await createDwollaCustomer(dwollaData)
            console.log('response', dwollaCustomerUrl)//.body._embedded.errors)

          
            if(!dwollaCustomerUrl) throw new Error('Error creating Dwolla customer')
          
            const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

            const newUser = await database.createDocument(
                process.env.APPWRITE_DATABASE_ID!,
                process.env.APPWRITE_USERS_COLLECTION_ID!,
                ID.unique(),
                {
                userId: userData.users_id,
                first_name: userData.first_name,
                last_name: userData.last_name,
                  email: userData.email,
                  password: `${userData.users_id}${userData.email}`,
                  address1: userData.address1,
                    city: userData.city,
                    state: userData.state,
                    postalCode: userData.postalCode,
                    dateOfBirth: userData.dateOfBirth,
                    ssn: userData.ssn,
                  dwollaCustomerId,
                  dwollaCustomerUrl
                }
              )
        
      const session = await account.createEmailPasswordSession(
        userData.email,
        `${userData.users_id}${userData.email}`);
  
      cookies().set("appwrite-session", session.secret, {
        path: "/dashboard",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });
  
        return parseStringify(newUser);
    }
        // user already exists
        console.log('for the session', userData.email, userQuery.email)
        const session = await account.createEmailPasswordSession(
            userData.email, 
            `${userData.users_id}${userData.email}`);
  
        cookies().set("appwrite-session", session.secret, {
          path: "/dashboard",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });

        return parseStringify(userQuery)
    } catch (error) {
      console.error('Error', error);
    }
  }

  export async function getLoggedInUser() {
    try {
      const { account } = await createSessionClient();
      const result = await account.get();
  
      const user = await getUserInfo({ userId: result.$id})
  
      return parseStringify(user);
    } catch (error) {
      console.log(error)
      return null;
    }
  }
  
export const createLinkToken = async (user: User) => {
    // console.log('link token', user)
    try {
        const token_params = {
            user: {
                client_user_id: user.$id
            },
            client_name: `${user.first_name} ${user.last_name}`,
            products: process.env.PLAID_PRODUCTS?.split(',') as Products[],
            language:'en',
            country_codes: ['US'] as CountryCode[],
        }
        const response = await plaidClient.linkTokenCreate(token_params)
        console.log('linktoken response', parseStringify({linkToken: response.data.link_token}))
        
        cookies().set('linkToken', response.data.link_token, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });
        return parseStringify({linkToken: response.data.link_token})
    } catch (error) {
        console.error(error)
    }
}

export const exchangePublicToken = async ( {
    publicToken, user} ): exchangePublicTokenProps => {
        console.log('exchange token', publicToken, user)
    try {
        // Exchange public token for access token and item ID
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken
        })

        const accessToken = response.data.access_token
        const itemId = response.data.item_id

        // Get account information from Plaid using the access token
        const accountsResponse = await plaidClient.accountsBalanceGet({
            access_token: accessToken
        })

        const accountData = accountsResponse.data.accounts[0]
        console.log(accountData)

        // create processor token for Swolla using access token and account id
        const request: ProcessorTokenCreateRequest = {
            access_token: accessToken,
            account_id: accountData.account_id,
            processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
        }

        const processorTokenResponse = await plaidClient.processorTokenCreate(request)
        const processorToken = processorTokenResponse.data.processor_token

        // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
        const fundingSourceUrl = await addFundingSource({
            dwollaCustomerId: user.dwollaCustomerId,
            processorToken,
            bankName: accountData.name,
        })

        if (!fundingSourceUrl) throw Error

        // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareableId ID
        await createBankAccount({
            userId: user.$id,
            bankId: itemId,
            accountId: accountData.account_id,
            accessToken,
            fundingSourceUrl,
            shareableId: encryptId(accountData.account_id)
        })

        // Revalidate the path to reflect the changes
        revalidatePath("/")

        return parseStringify({
            publicTokenExchange: "complete"
        })

    } catch(error){
        console.error('An error occured while creating an exchange token:', error)
    }

}

export const createBankAccount = async ({
    userId,
    bankId,
    accountId,
    accessToken,
    fundingSourceUrl,
    shareableId
}: createBankAccountProps) => {
    const data = {'userId':userId,
        'bankId':bankId,
        'accountId':accountId,
       'accessToken': accessToken,
        'fundingSourceUrl':fundingSourceUrl,
        'shareableId': shareableId}
    console.log('create bank account', data
        )
    try {
        const {database } =await createAdminClient();
        const bankAccount = await database.createDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_BANK_COLLECTION_ID!,
            ID.unique(),
            {
                userId,
                bankId,
                accountId,
                accessToken,
                fundingSourceUrl,
                shareableId
            }
        )

        return parseStringify(bankAccount);

    } catch (error) {
        console.error(error)
    }
}

export const getBanks = async ({ userId }: getBanksProps) => {
    try {
      const { database } = await createAdminClient();
        console.log('getBanks userId', userId)
      const banks = await database.listDocuments(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_BANK_COLLECTION_ID!,
        [Query.equal('userId', [userId])]
      )
      console.log(banks)
  
      return parseStringify(banks.documents);
    } catch (error) {
      console.log(error)
    }
  }

  export const getBank = async ({ documentId }: getBankProps) => {
    try {
      const { database } = await createAdminClient();
  
      const bank = await database.listDocuments(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_BANK_COLLECTION_ID!,
        [Query.equal('$id', [documentId])]
      )
  
      return parseStringify(bank.documents[0]);
    } catch (error) {
      console.log(error)
    }
  }
  
  export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
    try {
      const { database } = await createAdminClient();
  
      const bank = await database.listDocuments(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_BANK_COLLECTION_ID!,
        [Query.equal('accountId', [accountId])]
      )
  
      if(bank.total !== 1) return null;
  
      return parseStringify(bank.documents[0]);
    } catch (error) {
      console.log(error)
    }
  }