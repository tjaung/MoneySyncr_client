import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const LogoLink = () => {
  return (
    <Link href='/dashboard' className='mb-12 cursor-pointer flex items-center gap-2'>
        <Image 
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt='logo'
            className='size-[24px] max-xl:size-14'
            />
        <h1 className='font-poppins-regular text-black-1'>Money Syncr</h1>
    </Link>
  )
}

export default LogoLink