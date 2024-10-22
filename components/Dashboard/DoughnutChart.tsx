'use client'

import React from 'react'
import {Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)


const DoughnutChart = ({accounts, label, labels, displayLegend}: DoughnutChartProps) => {

    // split labels
    const labelsArray = labels.split(',')

    const data = {
        datasets: [
            {
                label: label,
                data: [1250, 2500, 3750],
                backgroundColor: ['#0747b6', '#2265d8', '#2f91fa']
            }
        ],
        labels: labelsArray
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