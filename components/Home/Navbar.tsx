import React from 'react'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
import Link from 'next/link'
  
const Navbar = () => {
  return (
    <nav className='flex justify-between w-full p-2 sticky'>
        <div className='flex flex-row justify-center'>
            <img
                className='mx-auto h-12 w-auto'
                src='/icons/logo.svg'
                alt='MoneySyncr'
                />
            <h2 className='text-center text-xl font-bold leading-9 tracking-tight text-gray-900'>
                Money Syncr
            </h2>
        </div>
        <div>
            <Link href={'/sign-in'}
                className='w-10 leading-6 text-xl rounded bg-blue-500 text-white-600 hover:text-slate-500'>
                Login
            </Link>
            <Link href={'/sign-up'}
                className='w-10 leading-6 text-xl rounded bg-blue-500 text-white-600 hover:text-slate-500'>
                Sign-up
            </Link>
        </div>
    </nav>

  )
}

export default Navbar