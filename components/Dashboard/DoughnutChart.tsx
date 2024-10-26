'use client'

import React from 'react'
import {Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)


const DoughnutChart = ({accounts, label, labels, displayLegend}: DoughnutChartProps) => {

    let accountNames
    let balances

    // if user has no accounts
    if (accounts.length == 0){
        accountNames = []
        balances = []
    } else{
        // labelsArray= accounts.map((a) => )
        accountNames = accounts.filter((a) => a.data.name !== 'All Accounts').map((a) => a.data.name);
        balances = accounts.filter((a) => a.data.name !== 'All Accounts').map((a) => a.data.currentBalance)
    }
   
    const data = {
        datasets: [
            {
                // label: 'My Accounts',
                data: balances,
                backgroundColor: ['#0747b6', '#2265d8', '#2f91fa']
            }
        ],
        labels: accountNames
    }

  return (
        <Doughnut 
            data={data}
            options={{
                cutout: '60%',
                plugins: {
                    legend: {
                        display: displayLegend
                    }
                }
            }}/>
  )
}

export default DoughnutChart