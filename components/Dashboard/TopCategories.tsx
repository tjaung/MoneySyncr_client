import React from 'react'
import { countTransactionCategories } from '@/lib/utils'
import Category from './Category'

const TopCategories = (transactions:Transaction) => {
    const categories: CategoryCount[] = countTransactionCategories(transactions);

  return (
    <div className="mt-10 flex flex-1 flex-col gap-6">
          <h2 className="header-2">Top categories</h2>

          <div className='space-y-5'>
            {categories.map((category, index) => (
              <Category key={category.name} category={category} />
            ))}
          </div>
        </div>
  )
}

export default TopCategories