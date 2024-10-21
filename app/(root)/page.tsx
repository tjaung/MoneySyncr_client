import SummaryCard from '@/components/SummaryCard'
import HeaderBox from '@/components/HeaderBox'
import RightSidebar from '@/components/RightSidebar'
import React from 'react'

const Home = () => {
  const loggedInUser = {firstName: "New", lastName: 'User'}

  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type="greeting"
            title="Welcome"
            subtext=""
            user={loggedInUser?.firstName + ' ' + loggedInUser.lastName || 'Guest'}
            />

            <SummaryCard
              accounts={[]}
              totalBanks={100}
              totalCurrentBalance={1250.50}
              />
        </header>

        RECENT TRANSACTIONS

      </div>
      <RightSidebar 
        user={loggedInUser}
        transactions={[250, 1500]}
        banks={[{currentBalance: 123.5}, {currentBalance: 1500}]}
      />
    </section>
  )
}

export default Home