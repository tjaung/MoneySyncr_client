'use client';

import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { Spinner } from '@/components/Common';
import HeaderBox from '@/components/HeaderBox'
import RecentTransactions from '@/components/Dashboard/RecentTransactions';
import RightSidebar from '@/components/Dashboard/RightSidebar';
import SummaryCard from '@/components/Dashboard/SummaryCard';
import { pushUserToAppwriteAndMakeSession } from '@/lib/actions/user.actions';
import { useEffect, useState } from 'react';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import Link from 'next/link';

const Page = ({searchParams: {id, page}}: SearchParamProps) => {
	const [loggedUser, setLoggedUser] = useState(null)
	const [accountsInfo, setAccountsInfo] = useState({
		accounts:null, 
		accountsData:[], 
		allTransactions: [],
		appwriteItemId:'', 
		account:null
	})
	console.log('initial accountsInfo', accountsInfo)
	const currentPage = Number(page as string) || 1
	console.log(currentPage)
	// console.log('dashboard search params', id, page)
	const { data: user, isLoading, isFetching } = useRetrieveUserQuery();
	console.log(user)

	// push user to appwrite if possible and get user data
	useEffect(() => {
		console.log('trigger useEffect')
		async function fetchUserSession(user: object) {
			console.log('Fetching logged user');
			const getUser = await pushUserToAppwriteAndMakeSession(user);
			setLoggedUser(getUser);
		  }
		fetchUserSession(user);
		},[user]);
	console.log('loggeduser:', loggedUser);

	// bank accounts
	useEffect(() => {
		const fetchAccounts = async (loggedUser) => {
			try{
				const responseAll = await getAccounts({ userId: loggedUser.$id });
        		const accounts = await responseAll; // Convert response to JSON
				console.log('fetchacc accounts all',accounts)
				if (accounts == null) {
					console.log('no accounts')
					return
				}
				const accountsData = accounts?.data
				const allTransactions = accounts.data.flatMap(account => account.transactions);
				console.log('allTransactions', allTransactions)
				const allAccounts = {data:{
					appwriteItemId: "000",
					availableBalance: 0,
					currentBalance: 0,
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
				console.log('account appwriteid', appwriteItemId)
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
			  console.log('accountsinfo', accountsInfo)
		}
	}, [loggedUser])
	console.log(accountsInfo)
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

	return (
		<>
    <section className="home">
      <div className="home-content flex-col">
        <header className="home-header">
		{loggedUser ? (
          <HeaderBox 
            type="greeting"
            title="Welcome"
            user={config[0].value}
            subtext="Access and manage your account and transactions efficiently."
          />
		) : (
			<>
			<HeaderBox 
            type="greeting"
            title="Money Syncr"
            user={''}
            subtext=""
          />
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
			<SummaryCard
				accounts={accountsInfo?.accountsData}
				totalBanks={accountsInfo.accounts?.totalBanks}
				totalCurrentBalance={accountsInfo.accounts?.totalCurrentBalance}
          	/>
			<div className='block xl:hidden'>
			 <RightSidebar 
			  user={loggedUser}
			  transactions={accountsInfo.accounts?.data.map((a) => a.transactions) || 0}
			  banks={accountsInfo.accountsData?.flatMap(account => account.data) || 0}
			/>
			</div> 
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
	  <div className='xl:block hidden'>
	  {accountsInfo.accountsData.length !== 0 ? (
		<>
		 <RightSidebar 
			  user={loggedUser}
			  transactions={accountsInfo.accounts?.transactions || 0}
			  banks={accountsInfo.accountsData?.slice(0,2) || 0}
		  />
		</>
		): (
			<Spinner/>
		)}
		</div>

			{accountsInfo.accountsData.length !== 0 ? (
				<div className='md:hidden'>
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