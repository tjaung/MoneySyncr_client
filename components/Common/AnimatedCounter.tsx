'use client'

import React from 'react'
import CountUp from 'react-countup'

const AnimatedCounter = ({isCurrency, countVariable }: {isCurrency: boolean, countVariable: number}) => {
    let decimalPlaces = 0
    let prefix = ""
    if (isCurrency) {
        decimalPlaces = 2
        prefix = '$'
    }
  return (
    <div>
        <CountUp 
            start={0}
            end={countVariable}
            decimals={decimalPlaces}
            duration={1}
            prefix={prefix}
        />
    </div>
  )
}

export default AnimatedCounter