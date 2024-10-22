import React from 'react'
import { Button } from './ui/button'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link'
import { createLinkToken } from '@/lib/actions/user.actions'



const PlaidLink = ({user, variant}):PlaidLinkProps => {
    const router = useRouter()

    const [token, setToken] = useState('')

    useEffect(() => {
        const getLinkToken = async () => {
            const data = await createLinkToken(user)
            setToken(data?.linkToken)
        }

        getLinkToken()
    }, [])

    const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
        // await exchangePublicToken({
        //     publicToken: public_token,
        //     user,
        // })
        router.push('/')
    }, [user])
    
    const config: PlaidLinkOptions = {
        token,
        onSuccess
    }

    const { open, ready } = usePlaidLink(config)
  return (
    <>
        {variant === 'primary' ? (
            <Button className='plaidlink-primary'
            onClick={() => open()}>
                Connect Bank
            </Button>
        ) : variant === 'ghost' ? (
            <Button className='plaidlink-primary'>
                Connect Bank
            </Button>
        ) : (
            <Button className='plaidlink-primary'>
                Connect Bank
            </Button>
        )}
    </>
    )

}

export default PlaidLink