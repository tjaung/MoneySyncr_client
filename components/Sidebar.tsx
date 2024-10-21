'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { logout as setLogout } from '@/redux/features/authSlice'
import { useLogoutMutation } from '@/redux/features/authApiSlice'
import { setAuth } from '@/redux/features/authSlice'
import { toast } from 'react-toastify'
import { Button } from './ui/button'

const Sidebar = ({user}): SiderbarProps => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const {isAuthenticated} = useAppSelector(state => state.auth)
    const [logout] = useLogoutMutation()

    const handleLogout = () => {
        logout(undefined)
            .unwrap()
            .then(() => {
                console.log('loggingout')
                dispatch(setLogout())
                console.log(dispatch)
                toast.success('Logged out')
            })
            .finally(() => {
                router.push('sign-in')
            })
    }
    // console.log(user)
    const pathname = usePathname()
    console.log(user)
  return (
    <section className='sidebar'>
        <nav className='flex flex-col gap-4'>

            <Link href='/' className='mb-12 cursor-pointer flex items-center gap-2'>
                <Image 
                    src="/icons/logo.svg"
                    width={34}
                    height={34}
                    alt='logo'
                    className='size-[24px] max-xl:size-14'
                    />
                <h1 className='sidebar-logo'>Budget Tracker</h1>
            </Link>
            <button className='text-gray-600 h-20px w-50px' onClick={handleLogout} title='Logout'>Logout</button>
            {sidebarLinks.map((item: any) => {
                const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)

                return (
                    <Link 
                        href={item.route}
                        key={item.label}
                        className={cn('sidebar-link h-16', {'bg-bank-gradient': isActive})}
                        >
                        <div className='relative size-6'>
                            <Image 
                                src={item.imgURL}
                                alt={item.label}
                                fill
                                className={cn({'brightness-[3] invert-0': isActive})}
                            />
                        </div>
                        <p className={cn('sidebar-label', {'!text-white': isActive})}>
                                {item.label}
                            </p>
                    </Link>
                )
            })}

            USER
            

        </nav>

        FOOTER 
    </section>
  )
}

export default Sidebar