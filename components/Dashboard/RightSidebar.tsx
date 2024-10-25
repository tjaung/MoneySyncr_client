import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import BankCard from './BankCard'
import PlaidLink from './Plaid/PlaidLink';

interface RightSidebarProps {
    user:object
    transactions: Transaction[];
    banks: Bank[] & Account[];
  }

const RightSidebar = ({user, transactions, banks}: RightSidebarProps) => {
  return (
    <aside className='right-sidebar'>
        <section className='flex flex-col pb8 hidden lg:block'>
            <div className='profile-banner'>
            <div className='profile'>
                <div className='profile-img'>
                    <span className='text-5xl font-bold text-blue-500'>{user.first_name}</span>
                </div>

                <div className='profile-details'>
                    <h1 className='profile-name'>
                        {user.first_name} {user.last_name}
                    </h1>
                    {/* <p className='profile-email'>{email}</p> */}
                </div>
            </div>
            </div>
        </section>

        <section className='banks'>
            <div className='flex w-full justify-between'>
                <h2 className='header-2'>Accounts</h2>
                {user && <PlaidLink user={user} variant='' />}
            </div>
            {banks?.length > 0 && (
                <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
                    <div className='relative z-10'>
                        <BankCard
                            key={banks[0].$id}
                            account={banks[0]}
                            userName={`${user.first_name} ${user.last_name}`}
                            showBalance={false}
                        />
                    </div>
                    {banks[1] && (
                        <div className='absolute right-0 top-8 z-0 w-[90%]'>
                            <BankCard
                                key={banks[1].$id}
                                account={banks[1]}
                                userName={`${user.first_name} ${user.last_name}`}
                                showBalance={false}
                            /> 
                        </div>
                    )}
                </div>
            )}
        </section>
    </aside>
  )
}

export default RightSidebar