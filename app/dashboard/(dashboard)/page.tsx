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

const Page = ({searchParams: {id, page}}: SearchParamProps) => {
	const [loggedUser, setLoggedUser] = useState(null)
	const [accountsInfo, setAccountsInfo] = useState({
		accounts:null, 
		accountsData:[], 
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
				const appwriteItemId = accountsData[0]?.appwriteItemId //(id as string) || accountsData[0]?.appwriteItemId
				const responseSingle = await getAccount({appwriteItemId})
				console.log('account appwriteid', appwriteItemId)
				const account = await responseSingle
				return {accounts:accounts, 
					accountsData:accountsData, 
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
          <HeaderBox 
            type="greeting"
            title="Welcome"
            user={config[0].value || 'Guest'}
            subtext="Access and manage your account and transactions efficiently."
          />

		{loggedUser && (
		<>
			<SummaryCard
				accounts={accountsInfo?.accountsData}
				totalBanks={accountsInfo.accounts?.totalBanks}
				totalCurrentBalance={accountsInfo.accounts?.totalCurrentBalance}
          	/>
			<div className='block xl:hidden'>
			 <RightSidebar 
			  user={loggedUser}
			  transactions={accountsInfo.accounts?.transactions || 0}
			  banks={accountsInfo.accountsData?.slice(0,2) || 0}
		  />
		  </div> 
		  <div className='md:block hidden'>
			<RecentTransactions 
          accounts={accountsInfo.accountsData}
          transactions={accountsInfo.account?.transactions}
          appwriteItemId={accountsInfo.appwriteItemId}
          page={currentPage}
        />
		</div>
		</>
		)}
        </header>

      </div>
	  <div className='xl:block hidden'>
	  {loggedUser && (
		<>
		 <RightSidebar 
			  user={loggedUser}
			  transactions={accountsInfo.accounts?.transactions || 0}
			  banks={accountsInfo.accountsData?.slice(0,2) || 0}
		  />
		  {/* <RecentTransactions 
          accounts={accountsInfo.accountsData}
          transactions={accountsInfo.account?.transactions}
          appwriteItemId={accountsInfo.appwriteItemId}
          page={currentPage}
        /> */}
		</>
		)}
		</div>

			{loggedUser && (
				<div className='md:hidden'>
				<RecentTransactions 
				accounts={accountsInfo.accountsData}
				transactions={accountsInfo.account?.transactions}
				appwriteItemId={accountsInfo.appwriteItemId}
				page={currentPage}
			  /> 
			  </div>)
			}
    
    </section>
			{/* <header className='bg-white shadow'>
				<div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
					<h1 className='text-3xl font-bold tracking-tight text-gray-900'>
						Dashboard
					</h1>
				</div>
			</header>
			<main className='mx-auto max-w-7xl py-6 my-8 sm:px-6 lg:px-8'>
				<List config={config} />
			</main> */}
		</>
	);
}

export default Page