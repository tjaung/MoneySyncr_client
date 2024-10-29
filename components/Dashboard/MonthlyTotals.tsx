import React from 'react'
import LineChart from './LineChart';
import HeaderBox from '../Common/HeaderBox';

const MonthlyTotals = ( {
    accounts = [],
}: MonthlyProps) => {
    if (accounts.length == 0) {
        accounts = []
    }

  return (
    <section className='monthly-balance'>
        <HeaderBox
            type= {"title"}
            title={"Monthly Summary"} 
            subtext={"Breakdown of your monthly spending"}
            user
        />
        <div className='flex flex-row flex-wrap justify-center'>
            <div className='monthly-balance-chart'>
                <LineChart
                accounts={accounts}
                label={'Accounts'}
                isAll={true}
                />
            </div>
            <div className='monthly-balance-chart'>
                <LineChart
                accounts={accounts}
                label={'Accounts'}
                isAll={false}
                />
            </div>
        </div>
    </section>
  )
}

export default MonthlyTotals