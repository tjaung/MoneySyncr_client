'use client'
import HeaderBox from '@/components/Common/HeaderBox'
import React from 'react'
import { useState, useEffect } from 'react'
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice'
import { pushUserToAppwriteAndMakeSession } from '@/lib/actions/user.actions'
import { getAccount, getAccounts } from '@/lib/actions/bank.actions'
import TransactionsTable from '@/components/Dashboard/TransactionsTable'
import { Spinner } from '@/components/Common'
import TopCategories from '@/components/Dashboard/TopCategories'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
  } from "@/components/ui/accordion"
import { TabsTrigger, TabsList, Tabs } from '@/components/ui/tabs'
import { BankTabItem } from '@/components/Dashboard/BankTabItem'
import RecentTransactions from '@/components/Dashboard/RecentTransactions'

interface AccountsInfo {
	accounts: { data: Account; transactions: Transaction[] }[] | null;
	accountsData: Account[]; // Adjust these types to match your actual data structure
	appwriteItemId: string;
	account: Account | null;
  }
  
const TransactionHistory = ({searchParams: {id, page}}) => {
  const [loggedUser, setLoggedUser] = useState(null)
	const [accountsInfo, setAccountsInfo] = useState<AccountsInfo>({
		accounts:null, 
		accountsData:[], 
		appwriteItemId:'', 
		account:null
	})
	const currentPage = Number(page as string) || 1
	const { data: user, isLoading, isFetching } = useRetrieveUserQuery();

	// push user to appwrite if possible and get user data
	useEffect(() => {
		async function fetchUserSession(user: object) {
			const getUser = await pushUserToAppwriteAndMakeSession(user);
			setLoggedUser(getUser);
		  }
		fetchUserSession(user);
		},[user]);

	// bank accounts
	useEffect(() => {
		const fetchAccounts = async (loggedUser) => {
			try{
				const responseAll = await getAccounts({ userId: loggedUser.$id });
        		const accounts = await responseAll; // Convert response to JSON
				if (accounts == null) {
					return
				}
				const accountsData = accounts?.data
				const appwriteItemId = accountsData[0]?.appwriteItemId //(id as string) || accountsData[0]?.appwriteItemId
				const responseSingle = await getAccount({appwriteItemId})
				const account = await responseSingle
				return {accounts:accounts, 
					accountsData:accountsData, 
					appwriteItemId:appwriteItemId, 
					account:account}
			} catch (error){
			}
			
		}
		let accountsInfo = null
		if(loggedUser){
			const fetchAndSetAccounts = async () => {
				const accountsInfoReturn = await fetchAccounts(loggedUser);
				if (accountsInfoReturn == undefined) return
				setAccountsInfo(accountsInfoReturn); // Update state after the Promise resolves
			  };
			  
			  fetchAndSetAccounts();
		}
	}, [loggedUser])

	return (
		<section className='transactions'>
		  <div className='transactions-header'>
			<HeaderBox
			  title='Transaction History'
			  subtext='See your bank details and transactions'
			/>
		  </div>
		  
		  {accountsInfo?.accounts !== null ? (
			<div className='flex flex-col justify-center'>
			  {accountsInfo?.accounts.data.map((account: any) => {
				
				
				return(
				<Accordion type="single" collapsible>
				<AccordionItem value="item-1">
				  <AccordionTrigger><div key={account.data.id} className='space-y-6'>
				  <Tabs defaultValue={account.appwriteItemId} className="w-full">
				  <TabsList className="recent-transactions-tablist">
				  <TabsTrigger key={account.id} value={account.appwriteItemId}>
					<BankTabItem
						key={account.data.officialName}
						account={account}
						appwriteItemId={account.appwriteItemId}
					/>
					</TabsTrigger>
					</TabsList>
					</Tabs>
				  <div className='transactions-account'>
					<div className='flex flex--col gap-2'>
					  <h2 className='text-18 font-bold text-white'>{account.data.name}</h2>
					  <p className='text-14 text-blue-25'>
						{account.data.officialName}
					  </p>
					  <p className='text-14 font-semibold tracking-[1.1px] text-white'>
						<span className='text-20'>**** **** **** </span>
						<span className='text-16'>{account.data.mask}</span>
					  </p>
					</div>
					<div className='transactions-accounts-balance'>
					  <p className='text-14'>Account Balance</p>
					  <p className='text-24 font-bold'>{account.data.currentBalance}</p>
					</div>
				  </div>
				</div>
				</AccordionTrigger>
				  <AccordionContent>
				
	  
				  <section className='flex w-full flex-col gap-6'>
					<RecentTransactions
						accounts={accountsInfo.accountsData}
						transactions={account.transactions}//account?.transactions}
						appwriteItemId={account.data.appwriteItemId}
						page={currentPage}
					/>
				  </section>
				  </AccordionContent>
				</AccordionItem>
				</Accordion>
			  )})}
			</div>
		  ) : (
			<Spinner />
		  )}
		</section>
	  );
	  
}


export default TransactionHistory