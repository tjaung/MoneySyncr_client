import classNames from 'classnames'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link'
import { BankTabItem } from './BankTabItem'
import BankInfo from './BankInfo'
import TransactionsTable from './TransactionsTable'
import { Pagination } from './Pagination'
import TopCategories from './TopCategories'
import { parseStringify } from '@/lib/utils'

const RecentTransactions = ({
    accounts, 
    transactions=[], 
    appwriteItemId, 
    page=1}: RecentTransactionsProps) => {

  const rowsPerPage = 10
  const totalPages = Math.ceil(transactions.length/rowsPerPage)
      console.log('recent transactions accounts', accounts)

      console.log('recent transactions transactions', transactions)
    
  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = transactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  )
  const allTransactions = parseStringify(accounts[0].transactions)
  console.log(allTransactions)
  return (
    <>
     <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent transactions</h2>
        <Link
          href={`/dashboard/transaction-history/?id=${appwriteItemId}`}
          className="view-all-btn"
        >
          View all
        </Link>
      </header>
      <div>
        <TopCategories
          transactions={allTransactions}
        />
      </div>

      <Tabs defaultValue={appwriteItemId} className="w-full">
      <TabsList className="recent-transactions-tablist">
          {accounts.map((account: any) => {
            console.log(account)
            console.log(account.data.id)
            return (
            <TabsTrigger key={account.data.id} value={account.data.appwriteItemId}>
              <BankTabItem
                key={account.data.id}
                account={account.data}
                appwriteItemId={account.data.appwriteItemId}
              />
            </TabsTrigger>
          )})}
        </TabsList>
 
        {accounts.map((account: any) => {
          console.log(parseStringify(account))
          console.log(account.transactions)
            return (
          <TabsContent
            value={account.data.appwriteItemId}
            key={account.data.id}
            className="space-y-4"
          >
            <BankInfo 
              account={account.data}
              appwriteItemId={account.data.appwriteItemId}
              type="full"
            />
            {/* { console.log(this.props.account.transactions) } */}
            <TransactionsTable transactions={account.transactions} />
            

            {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPages} page={page} />
              </div> 
            )}
          </TabsContent>
        )})}
      </Tabs>
    </section>
    </>
  )
}

export default RecentTransactions