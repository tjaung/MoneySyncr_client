import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import BankCard from '../Dashboard/BankCard'

interface RightSidebarProps {
    first_name: string;
    last_name: string
    transactions: Transaction[];
    banks: Bank[] & Account[];
  }

const RightSidebar = ({first_name, last_name, transactions, banks}: RightSidebarProps) => {
    console.log('right sidebar user:', first_name, last_name)
  return (
    <aside className='right-sidebar'>
        <section className='flex flex-col pb8'>
            <div className='profile-banner'>
            <div className='profile'>
                <div className='profile-img'>
                    <span className='text-5xl font-bold text-blue-500'>{first_name[0]}</span>
                </div>

                <div className='profile-details'>
                    <h1 className='profile-name'>
                        {first_name} {last_name}
                    </h1>
                    {/* <p className='profile-email'>{email}</p> */}
                </div>
            </div>
            </div>
        </section>

        <section className='banks'>
            <div className='flex w-full justify-between'>
                <h2 className='header-2'>Accounts</h2>
                <Link href="/" className='flex gap-2'>
                    <Image 
                        src="/icons/plus.svg"
                        width={20}
                        height={20}
                        alt='plus'
                    />
                    <h2 className='text-14 font-semibold text-gray-600'>Add Account</h2>
                </Link>
            </div>
            {banks?.length > 0 && (
                <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
                    <div className='relative z-10'>
                        <BankCard
                            key={banks[0].$id}
                            account={banks[0]}
                            userName={`${first_name} ${last_name}`}
                            showBalance={false}
                        />
                    </div>
                    {banks[1] && (
                        <div className='absolute right-0 top-8 z-0 w-[90%]'>
                            <BankCard
                                key={banks[1].$id}
                                account={banks[1]}
                                userName={`${first_name} ${last_name}`}
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