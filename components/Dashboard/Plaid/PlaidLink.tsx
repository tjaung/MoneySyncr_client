import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '../../ui/button'
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link'
import { useRouter } from 'next/navigation';
import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.actions';
import Image from 'next/image';

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter();
    console.log(user)
  const [token, setToken] = useState('');

  useEffect(() => {
    const getLinkToken = async () => {
        console.log(user)
      const data = await createLinkToken(user);

      setToken(data?.linkToken);
    }

    getLinkToken();
  }, [user]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
    console.log('exchange token callback')
    await exchangePublicToken({
      publicToken: public_token,
      user,
    })

    router.push('/dashboard');
  }, [user])

  const onExit = useCallback((err, metadata) => {
    // Handle the exit logic here
    if (err) {
      console.error('Plaid Link exited with error:', err);
    } else {
      console.log('Plaid Link exited without errors:', metadata);
      // You can add additional logic here if needed
    }
    // Do not redirect or perform any action
  }, []);
  
  const config: PlaidLinkOptions = {
    token,
    onSuccess,
    onExit
  }

  const { open, ready } = usePlaidLink(config);
  
  return (
    <>
      {variant === 'primary' ? (
        <Button
          onClick={() => open()}
          disabled={!ready}
          className="plaidlink-primary"
        >
          Connect bank
        </Button>
      ): variant === 'ghost' ? (
        <Button onClick={() => open()} variant="ghost" className="plaidlink-ghost">
          <Image 
            src="/icons/connect-bank.svg"
            alt="connect bank"
            width={24}
            height={24}
          />
          <p className='hiddenl text-[16px] font-semibold text-black-2 xl:block'>Connect bank</p>
        </Button>
      ): (
        <Button onClick={() => open()} className="plaidlink-default">
          <Image 
            src="/icons/connect-bank.svg"
            alt="connect bank"
            width={24}
            height={24}
          />
          <p className='text-[16px] font-semibold text-black-2'>Connect bank</p>
        </Button>
      )}
    </>
  )
}

export default PlaidLink