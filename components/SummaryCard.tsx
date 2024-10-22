import React from 'react'
import AnimatedCounter from './Common/AnimatedCounter'
import DoughnutChart from './Dashboard/DoughnutChart'

const SummaryCard = ({
    accounts = [],
    totalBanks,
    totalCurrentBalance
}: SummaryCardProps) => {

    // balance to formatted currency
    // let formatBalance = totalCurrentBalance.toFixed(2)
  return (
    <section className='total-balance'>
        <div className='total-balance-chart'>
            <DoughnutChart 
                accounts={accounts}
                label='Banks'
                labels={'Bank 1,Bank 2,Bank 3'}
                // cutoutPerc='60%'
                displayLegend={false} />
        </div>
        <div className='flex flex-col gap-6'>
            <h2 className='header-2'>
                Accounts: <AnimatedCounter 
                    isCurrency={false}
                    countVariable={totalBanks} />
            </h2>
            <div className='flex flex-col gap-2'>
                <p className='total-balance-label'>
                    Total Balance:
                </p>
                <div className='total-balance-amount flex-center gap-2'>
                    <AnimatedCounter 
                        isCurrency={true} 
                        countVariable={totalCurrentBalance} />
                </div>
            </div>
        </div>
    </section>
  )
}

export default SummaryCard