'use client'
import { Spinner } from '@/components/Common'
import BankCard from '@/components/Dashboard/BankCard'
import HeaderBox from '@/components/Common/HeaderBox'
import React from 'react'
import { useState, useEffect } from 'react'
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice'
import { pushUserToAppwriteAndMakeSession } from '@/lib/actions/user.actions'
import { getAccount, getAccounts } from '@/lib/actions/bank.actions'

const Accounts = () => {
  const [loggedUser, setLoggedUser] = useState(null)
	const [accountsInfo, setAccountsInfo] = useState({
		accounts:null, 
		accountsData:[], 
		appwriteItemId:'', 
		account:null
	})

	const { data: user, isLoading, isFetching } = useRetrieveUserQuery();

	// push user to appwrite if possible and get user data
	useEffect(() => {
		async function fetchUserSession(user: object) {
			const getUser = await pushUserToAppwriteAndMakeSession(user);
			setLoggedUser(getUser);
		  }
		fetchUserSession(user);
		},[user]);

	// bank accounts
	useEffect(() => {
		const fetchAccounts = async (loggedUser) => {
			try{
				const responseAll = await getAccounts({ userId: loggedUser.$id });
        		const accounts = await responseAll; // Convert response to JSON
				if (accounts == null) {
					return
				}
				const accountsData = accounts?.data
				const appwriteItemId = accountsData[0]?.appwriteItemId //(id as string) || accountsData[0]?.appwriteItemId
				const responseSingle = await getAccount({appwriteItemId})
				const account = await responseSingle
				return {accounts:accounts, 
					accountsData:accountsData, 
					appwriteItemId:appwriteItemId, 
					account:account}
			} catch (error){
				console.log(error)
			}
			
		}
		let accountsInfo = null
		if(loggedUser){
			const fetchAndSetAccounts = async () => {
				const accountsInfoReturn = await fetchAccounts(loggedUser);
				if (accountsInfoReturn == undefined) return
				setAccountsInfo(accountsInfoReturn); // Update state after the Promise resolves
			  };
			  
			  fetchAndSetAccounts();
		}
	}, [loggedUser])

  return (
    <section className='flex'>
      <div className='my-banks'>
        <HeaderBox
        title='My Accounts'
        subtext='Manage your account activities'
        />

      <div className='space-y-4'>
        <h2 className='header-2'>
          My Accounts
        </h2>

        {loggedUser ? (
          <div className='flex flex-wrap gap-6'>
          {accountsInfo.accounts?.data.map((acc: Account) => (
            <BankCard
              key={acc.data.id}
              account={acc.data}
              userName={loggedUser.first_name}
              />
          ))}
        </div>
        ) : (
        <div className='flex flex-wrap gap-6'>
          <Spinner />
        </div>
         )}
      </div>
      </div>
    </section>
  )
}

export default Accounts