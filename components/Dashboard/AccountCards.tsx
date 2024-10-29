import React from 'react'
import BankCard from './BankCard'
import PlaidLink from './Plaid/PlaidLink';

interface RightSidebarProps {
    user: {
        first_name: string;
        last_name: string;
    };
    banks: (Bank & Account)[];
}

const AccountCards = ({ user, banks }: RightSidebarProps) => {
    console.log(banks)
    return (    
    <section className='banks'>
                <div className='flex w-full justify-between'>
                    <h2 className='header-2'>Accounts</h2>
                    {user && <PlaidLink user={user} variant='' />}
                </div>
                
                <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
                    {banks?.length > 0 && banks.map((bank, index) => (
                        <div
                            key={bank.data.$id}
                            className={
                                index > 0
                                    ? 'absolute -right-30 top-8 z-0 w-[90%]'
                                    : 'relative z-10'
                            }
                        >
                            <BankCard
                                account={bank.data}
                                userName={`${user.first_name} ${user.last_name}`}
                                showBalance={false}
                            />
                        </div>
                    ))}
                </div> 
            </section>
    )
}
export default AccountCards