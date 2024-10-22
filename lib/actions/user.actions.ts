import { plaidClient } from '../plaid';
import { parseStringify } from '../utils';
import { ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum } from 'plaid';
// import { addFundingSource } from './dwolla.actions';

const {
    APPWRITE_DATABASE_ID: DATABASE_ID,
    APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
    APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID
} = process.env

// export const createLinkToken = async (user: User) => {
//     try {
//         const token_params = {
//             user: {
//                 client_user_id: user.$id
//             },
//             client_name: `${user.firstName} ${user.lastName}`,
//             products: ['auth'] as Products[],
//             language:'en',
//             country_codes: ['US'] as CountryCode[],
//         }
//         const response = await plaidClient.linkTokenCreate(token_params)

//         return parseStringify({linkToken: response.data.link_token})
//     } catch (error) {
//         console.error(error)
//     }
// }

// export const exchangePublicToken = async ( {publicToken, user} ): exchangePublicTokenProps => {
//     try {
//         // Exchange public token for access token and item ID
//         const response = await plaidClient.itemPublicTokenExchange({
//             public_token: public_token
//         })

//         const accessToken = response.data.access_token
//         const itemId = response.data.item_id

//         // Get account information from Plaid using the access token
//         const accountsResponse = await plaidClient.accountsBalanceGet.length({
//             access_token: accessToken
//         })

//         const accountData = accounts.Response.data.accounts[0]

//         // create processor token for Swolla using access token and account id
//         const request: ProcessorTokenCreateRequest = {
//             access_token: accessToken,
//             account_id: accountData.account_id,
//             processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
//         }

//         const processorTokenResponse = await plaidClient.processorTokenCreate(request)
//         const processorToken = processorTokenResponse.data.processor_token

//         // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
//         const fundingSourceUrl = await addFundingSource({
//             dwollaCustomerId: user.dwollaCustomerId,
//             processorToken,
//             bankName: accountData.name,
//         })

//         if (!fundingSourceUrl) throw Error

//         // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareableId ID
//         await createBankAccount({
//             userId: user.$id,
//             bankId: itemId,
//             accountId: accountData.account_id,
//             accessToken,
//             fundingSourceUrl,
//             sharableId: encryptId(accountData.account_id)
//         })

//         // Revalidate the path to reflect the changes
//         revalidatePath("/")

//         return parseStringify({
//             publicTokenExchange: "complete"
//         })

//     } catch(error){
//         console.error('An error occured while creating an exchange token:', error)
//     }

// }

// export const createBankAccount = async ({
//     userId,
//     bankId,
//     accountId,
//     accessToken,
//     fundingSourceUrl,
//     sharableId
// }: createBankAccountProps) => {
//     try {
//         const {database } =await createAdminClient();
//         const bankAccount = await database.createDocument(
//             DATABASE_ID!,
//             BANK_COLLECTION_ID!,
//             ID.unique(),
//             {
//                 userId,
//                 bankId,
//                 accountId,
//                 accessToken,
//                 fundingSourceUrl,
//                 sharableId
//             }
//         )

//         return parseStringify(bankAccount);

//     } catch (error) {
//         console.error(error)
//     }
// }