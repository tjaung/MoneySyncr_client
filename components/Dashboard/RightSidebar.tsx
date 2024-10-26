import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import BankCard from './BankCard'
import PlaidLink from './Plaid/PlaidLink';

interface RightSidebarProps {
    user: {
        first_name: string;
        last_name: string;
    };
    transactions: Transaction[];
    banks: (Bank & Account)[];
}

const RightSidebar = ({ user, transactions, banks }: RightSidebarProps) => {
    console.log('right sidebar', banks)
  
    return (
        <aside className='right-sidebar'>
            <section className='flex flex-col pb8'>
                <div className='profile-banner'>
                    <div className='profile'>
                        <div className='profile-img'>
                            <span className='text-5xl font-bold text-blue-500'>{user.first_name}</span>
                        </div>
                        <div className='profile-details'>
                            <h1 className='profile-name'>
                                {user.first_name} {user.last_name}
                            </h1>
                        </div>
                    </div>
                </div>
            </section>

            <section className='banks'>
                <div className='flex w-full justify-between'>
                    <h2 className='header-2'>Accounts</h2>
                    {user && <PlaidLink user={user} variant='' />}
                </div>
                
                <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
                    {banks?.length > 0 && banks.map((bank, index) => (
                        <div
                            key={bank.$id}
                            className={
                                index > 0
                                    ? 'absolute -right-30 top-8 z-0 w-[90%]'
                                    : 'relative z-10'
                            }
                        >
                            <BankCard
                                account={bank}
                                userName={`${user.first_name} ${user.last_name}`}
                                showBalance={false}
                            />
                        </div>
                    ))}
                </div> 
            </section>
        </aside>
    )
}

export default RightSidebar;
