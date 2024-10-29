'use client'

import React from 'react'
import {Chart as ChartJS, ArcElement, Tooltip, Legend, registerables } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { CategoryScale, LinearScale, TimeScale, PointElement } from 'chart.js'
import { format, toDate, parseISO } from 'date-fns'
import { abs, round } from 'mathjs'
import { formatAmount } from '@/lib/utils'

ChartJS.register(ArcElement, CategoryScale, LinearScale, TimeScale, PointElement, 
    Tooltip, Legend, ...registerables)

const LineChart = ({accounts, label, isAll}: LineChartProps) => {

    const aggregateDataMonthlyForChart = (transactions) => {
        aggregatedData = Object.fromEntries(transactions.map(t => [t.date, 0]));
        
            // aggregate transaction sums by month
            for (let [key, value] of Object.entries(aggregatedData)) {
                // console.log(key, value)
                for (const transaction in transactions){
                    if (transactions[transaction].date == key){
                        // console.log(value)
                        value += transactions[transaction].amount
                        // console.log('time', key, value)
                        // console.log(`add ${transactions[transaction].amount} to ${value}`)
                    }
                aggregatedData[key] = value
                }
                if (aggregatedData[key] < 0){
                    aggregatedData[key] = round(abs(aggregatedData[key]), 2)
                } else {
                    aggregatedData[key] = round(0 - aggregatedData[key], 2)
                }
            }
            return aggregatedData
        } 

    console.log('line chart props', accounts)
    let accountNames
    let transactions
    let timeStamps
    let aggregatedData = {}
    let data = {datasets: [],
        labels: []
    }


    // if user has no accounts
    if (accounts.length == 0){
        accountNames = []
        transactions = []
        timeStamps = ''
    } else{
        if (isAll){
             // categorize by summing transactions by month
            accountNames = accounts.filter((a) => a.data.name == 'All Accounts').map((a) => a.data.name);
            transactions = accounts.filter((a) => a.data.name == 'All Accounts')[0].transactions
                .map((transaction) =>({
                    amount: Number(transaction.amount), 
                    date:format(parseISO(transaction.date), 'MM/yyyy')
                }))

            // aggregate transaction sums by month
            const aggregatedData = aggregateDataMonthlyForChart(transactions)
            const newDataSet = {
                label: accountNames[0],
                data: Object.values(aggregatedData).reverse(),
                fill: false,
                backgroundColor: ['#0747b6', '#2265d8', '#2f91fa'],
                borderColor: '#b2c8ed'
            }
            data['datasets'].push(newDataSet)
            data['labels'] = Object.keys(aggregatedData).reverse()
        } 
        else {
            accountNames = accounts.filter((a) => a.data.name !== 'All Accounts').map((a) => a.data.name);
            let accountDict = {}
            for (let accName in accountNames){
                // console.log(accountNames[accName])
                transactions = accounts.filter((a) => a.data.name == accountNames[accName])[0].transactions
                    .map((transaction) =>(
                        {
                            acc: accountNames[accName],
                            amount: Number(transaction.amount), 
                            date:format(parseISO(transaction.date), 'MM/yyyy')
                        }))
                accountDict[accountNames[accName]] = transactions
            }
            // transactions = accounts.filter((a) => a.data.name !== 'All Accounts').map((a) =>({acc: a.data.name, amount: Number(a.transactions.amount), date:format(parseISO(a.transactions.date), 'MM/yyyy')}))
            // aggregatedData = Object.fromEntries(transactions.map(t => [t.date, 0]));
            // console.log('transactions', accountDict)
            let aggregatedData = []
            for (let acc in accountDict) {
                const bgColor = ['#0747b6', '#2265d8', '#2f91fa']
                let aggData = aggregateDataMonthlyForChart(accountDict[acc])
                const newDataSet = {
                    label: accountNames[0],
                    data: Object.values(aggData).reverse(),
                    fill: false,
                    backgroundColor: bgColor[acc],
                    borderColor: bgColor[acc],
                }
                data['datasets'].push(newDataSet)
                data['labels'] = Object.keys(aggData).reverse()
            }
            // console.log(JSON.stringify(data))
        }
    }
    

  return (
        <Line 
            data={data}

        />
  )
}

export default LineChart