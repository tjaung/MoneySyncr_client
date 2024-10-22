'use client'
import SummaryCard from '@/components/SummaryCard'
import HeaderBox from '@/components/HeaderBox'
import RightSidebar from '@/components/RightSidebar'
import React from 'react'
import ConnectPlaidButton from '@/components/PlaidConnectButton'
import { useRouter } from 'next/navigation'
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice'
import {Cookies} from 'typescript-cookie'
const Home = () => {

  const {data: user, isError} = useRetrieveUserQuery(Cookies.get('access'));
  const loggedInUser = user
  // console.log('home user', user)
  // console.log('home loggedinuser', loggedInUser)

  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type="greeting"
            title="Welcome"
            subtext=""
            user={loggedInUser?.first_name|| 'Guest'}
            />

            <SummaryCard
              accounts={[]}
              totalBanks={100}
              totalCurrentBalance={1250.50}
              />
            <ConnectPlaidButton />
        </header>

        RECENT TRANSACTIONS

      </div>
      <RightSidebar 
        first_name={'XXX'}
        last_name={'YYY'}
        transactions={[250, 1500]}
        banks={[{currentBalance: 123.5}, {currentBalance: 1500}]}
      />
    </section>
  )
}

export default Home