'use client';

import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { List, Spinner } from '@/components/Common';
import HeaderBox from '@/components/HeaderBox'
import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/Common/RightSidebar';

import TotalBalanceBox from '@/components/TotalBalanceBox';
import SummaryCard from '@/components/SummaryCard';
import PlaidLink from '@/components/PlaidLink';
import { pushUserToAppwriteAndMakeSession } from '@/lib/actions/user.actions';

export default function Page() {

	const { data: user, isLoading, isFetching } = useRetrieveUserQuery();
	console.log(user, isLoading, isFetching)
	
	// push user to appwrite if possible
	const madeUser = pushUserToAppwriteAndMakeSession(user)

	const config = [
		{
			label: 'First Name',
			value: user?.first_name,
		},
		{
			label: 'Last Name',
			value: user?.last_name,
		},
		{
			label: 'Email',
			value: user?.email,
		},
	];

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
      <div className="home-content">
        <header className="home-header">
          <HeaderBox 
            type="greeting"
            title="Welcome"
            user={config[0].value || 'Guest'}
            subtext="Access and manage your account and transactions efficiently."
          />

          <SummaryCard
            accounts={[]}
            totalBanks={100}
            totalCurrentBalance={1250.50}
          />

		<PlaidLink user={user} variant={'primary'} />

        </header>

        {/* <RecentTransactions 
          accounts={accountsData}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        /> */}
      </div>

      <RightSidebar 
        first_name={config[0].value}
        last_name={config[1].value }
        transactions={[1250, 1500]}
        banks={[{currentBalance: 123.5}, {currentBalance: 1500}]}
      />
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