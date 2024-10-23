'use server'

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { plaidClient } from '@/lib/plaid';
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";
import { parse } from "path";

const {
    APPWRITE_DATABASE_ID: DATABASE_ID,
    APPWRITE_USER_COLLECTION_ID: USERS_COLLECTION_ID,
    APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID
} = process.env



export const createSession = async (account:any, email: string, password: string) => {
    // create appwrite session

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
    });
}


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
        if (!userExists){
            
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
                  email: userData.email,
                  password: userData.email,
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
        
      const session = await account.createEmailPasswordSession(email, password);
  
      cookies().set("appwrite-session", session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });
  
        const newUserData = {
            userId: userData.users_id,
                    email: userData.email,
                    password: userData.email,
                    address1: userData.address1,
                    city: userData.city,
                    state: userData.state,
                    postalCode: userData.postalCode,
                    dateOfBirth: userData.dateOfBirth,
                    ssn: userData.ssn,
                    dwollaCustomerId,
                    dwollaCustomerUrl
        }
        return parseStringify(newUserData);
        }
        return 0
    } catch (error) {
      console.error('Error', error);
    }
  }
  
export const createLinkToken = async (user: User) => {
    console.log('link token', user)
    try {
        const token_params = {
            user: {
                client_user_id: user.users_id
            },
            client_name: `${user.first_name} ${user.last_name}`,
            products: ['auth'] as Products[],
            language:'en',
            country_codes: ['US'] as CountryCode[],
        }
        const response = await plaidClient.linkTokenCreate(token_params)
        console.log('linktoken response', parseStringify({linkToken: response.data.link_token}))
        return parseStringify({linkToken: response.data.link_token})
    } catch (error) {
        console.error(error)
    }
}

export const exchangePublicToken = async ( {
    publicToken, 
    user} ): exchangePublicTokenProps => {
        console.log('exchange token', publicToken, user)
    try {
        // Exchange public token for access token and item ID
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken
        })

        const accessToken = response.data.access_token
        const itemId = response.data.item_id

        // Get account information from Plaid using the access token
        const accountsResponse = await plaidClient.accountsBalanceGet.length({
            access_token: accessToken
        })

        const accountData = accountsResponse.data.accounts[0]

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
            sharableId: encryptId(accountData.account_id)
        })

        // Revalidate the path to reflect the changes
        revalidatePath("/dashboard")

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
    sharableId
}: createBankAccountProps) => {
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
                sharableId
            }
        )

        return parseStringify(bankAccount);

    } catch (error) {
        console.error(error)
    }
}