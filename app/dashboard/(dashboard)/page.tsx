'use client';

import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { Spinner } from '@/components/Common';
import HeaderBox from '@/components/Common/HeaderBox'
import RecentTransactions from '@/components/Dashboard/RecentTransactions';
import RightSidebar from '@/components/Dashboard/RightSidebar';
import SummaryCard from '@/components/Dashboard/SummaryCard';
import { pushUserToAppwriteAndMakeSession } from '@/lib/actions/user.actions';
import { useEffect, useState } from 'react';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import Link from 'next/link';
import MonthlyTotals from '@/components/Dashboard/MonthlyTotals';
import AccountCards from '@/components/Dashboard/AccountCards';

const Page = ({id, page}: SearchParamProps) => {
	const [loggedUser, setLoggedUser] = useState(null)
	const [accountsInfo, setAccountsInfo] = useState({
		accounts:null, 
		accountsData:[], 
		allTransactions: [],
		appwriteItemId:'', 
		account:null
	})
	const { data: user, isLoading, isFetching } = useRetrieveUserQuery();
	const currentPage = Number(page as string) || 1
	// push user to appwrite if possible and get user data
	useEffect(() => {
		console.log('trigger useEffect')
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
				const totalCurrentBalance = accounts.totalCurrentBalance
				const totalAvailableBalance = accounts.data.reduce((sum, account) => {
					return sum + account.data.availableBalance;
				  }, 0);
				console.log(totalAvailableBalance)
				const allTransactions = accounts.data.flatMap(account => account.transactions);
				const allAccounts = {data:{
					appwriteItemId: "000",
					availableBalance: totalAvailableBalance,
					currentBalance: totalCurrentBalance,
					id: "allAcc",
					institutionId: "ins_0",
					mask: "0000",
					name: "All Accounts",
					officialName: "All Accounts",
					shareableId: "",
					subtype: "",
					type: ""
				},
			transactions: allTransactions}
				accountsData.unshift(allAccounts)
				const appwriteItemId = accountsData[0]?.appwriteItemId //(id as string) || accountsData[0]?.appwriteItemId
				const responseSingle = await getAccount({appwriteItemId})
				const account = await responseSingle
				return {accounts:accounts, 
					accountsData:accountsData, 
					allTransactions: allTransactions,
					appwriteItemId:appwriteItemId, 
					account:account}
			} catch (error){
				console.log(error)
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

	// page configs for personalization
	const config = [
		{
			label: 'First Name',
			value: loggedUser?.first_name,
		},
		{
			label: 'Last Name',
			value: loggedUser?.last_name,
		},
		{
			label: 'Email',
			value: loggedUser?.email,
		},
	];

	// render loading
	if (isLoading || isFetching) {
		return (
			<div className='flex justify-center my-8'>
				<Spinner lg />
			</div>
		);
	}
	console.log('user data', accountsInfo)

	return (
		<>
    <section className="home">
      <div className="home-content flex-col shrink">
        <header className="home-header">
		{loggedUser ? (
           <RightSidebar 
		   user={loggedUser}
		   transactions={accountsInfo.accounts?.data.map((a) => a.transactions) || 0}
		   banks={accountsInfo.accountsData?.flatMap(account => account.data) || 0}
		 />
		) : (
			<>
			 
		  <p className='mt-10 text-center text-sm text-gray-500'>
			If you are signed in and the page isn't loading try reloading the page or 
			<Link 
			className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
			href={'sign-in'}> re-signing in here
			</Link>
			</p>
		  </>
		)}

		{accountsInfo.accountsData.length !== 0 ? (
		<>
			<div className='flex flex-row flex-wrap justify-center gap-6'>
			<SummaryCard
				accounts={accountsInfo?.accountsData}
				totalBanks={accountsInfo.accounts?.totalBanks}
				totalCurrentBalance={accountsInfo.accounts?.totalCurrentBalance}
          	/>
			<AccountCards
			user={loggedUser}
			banks={accountsInfo.accounts?.data}
			/>
			
			</div>
			<MonthlyTotals
			accounts={accountsInfo?.accountsData}
			totalBanks={accountsInfo.accounts?.totalBanks}
			totalCurrentBalance={accountsInfo.accounts}
			/>
			

			<div className='md:block hidden'>
				<RecentTransactions 
			accounts={accountsInfo.accountsData}
			transactions={accountsInfo.allTransactions}//account?.transactions}
			appwriteItemId={accountsInfo.appwriteItemId}
			page={currentPage}
			/>
			</div>
		</>
		) : (
			<Spinner />
		)}
        </header>

      </div>
			{accountsInfo.accountsData.length !== 0 ? (
				<div className='md:hidden py-7 px-5'>
				<RecentTransactions 
				accounts={accountsInfo.accountsData}
				transactions={accountsInfo.account?.transactions}
				appwriteItemId={accountsInfo.appwriteItemId}
				page={currentPage}
			  /> 
			  </div>
			  ): (
				<Spinner/>
			  )
			}
    
    </section>
		</>
	);
}

export default Page