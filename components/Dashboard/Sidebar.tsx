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
import { NavLink } from '../Common'
import PlaidLink from './Plaid/PlaidLink'

const Sidebar = () => {
    const pathname = usePathname();
	const dispatch = useAppDispatch();

	const [logout] = useLogoutMutation();

	const { isAuthenticated } = useAppSelector(state => state.auth);

	const handleLogout = () => {
		logout(undefined)
			.unwrap()
			.then(() => {
				dispatch(setLogout());
			});
	};

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
            
            {sidebarLinks.map((item: any) => {
                const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)

                return (
                    <Link 
                        href={`/dashboard/${item.route}`}
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
             <NavLink clasName='sidebar-link h-1 bg-bank-gradient cursor-pointer' isMobile={false} onClick={handleLogout}>
				Logout
			</NavLink>
            
            

        </nav>

        FOOTER 
    </section>
  )
}

export default Sidebar