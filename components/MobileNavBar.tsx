'use client'

import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetClose,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { sidebarLinks } from '@/constants'

import Image from 'next/image'
import Link from 'next/link'
import LogoLink from './LogoLink'

  
const MobileNavBar = ({user}: MobileNavProps) => {
    const pathname = usePathname()

  return (
    <section className='w-fulll max-w-[260px]'>
        <Sheet>
            <SheetTrigger>
                <Image
                    src="/icons/hamburger.svg"
                    width={30}
                    height={30}
                    alt='menu'
                    className='cursor-pointer'
                />
            </SheetTrigger>
            <SheetContent className='border-none bg-white'>
                <nav className='flex flex-col gap-4'>
                    <LogoLink/>
                    <div className='mobilenav-sheet'>
                        <SheetClose asChild>
                            <nav className='flex h-full gap-6 flex-col pt-16 text-white'>
                                {sidebarLinks.map((item: any) => {
                                const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)
                                
                                return (
                                    <SheetClose asChild key={item.route}>
                                        {/* <nav className='flex h-full gap-6 flex-col pt-16 text-white'> */}
                                            <Link 
                                                href={item.route}
                                                key={item.label}
                                                className={cn('mobilenav-sheet_close w-full', {'bg-bank-gradient': isActive})}
                                            >
                                                    <Image 
                                                        src={item.imgURL}
                                                        alt={item.label}
                                                        width={20}
                                                        height={20}
                                                        className={cn({'brightness-[3] invert-0': isActive})}
                                                    />
                                                <p className={cn('text-16 font-semibold text-black-2', {'!text-white': isActive})}>
                                                    {item.label}
                                                </p>
                                            </Link>
                                        {/* </nav> */}
                                    </SheetClose>
                                    )
                                })}
                                USER
                            </nav>       

                        </SheetClose>
                        FOOTER
                    </div>
                </nav>
            </SheetContent>
        </Sheet>

    </section>
  )
}

export default MobileNavBar