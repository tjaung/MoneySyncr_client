'use client'

import React, { useContext, useState, createContext } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { logout as setLogout } from '@/redux/features/authSlice'
import { useLogoutMutation } from '@/redux/features/authApiSlice'
import { NavLink } from '../Common'
import { ChevronFirst, ChevronLast } from 'lucide-react'


// export default Sidebar
const SidebarContext = createContext()

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true)
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
    <aside className="sidebar h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="https://img.logoipsum.com/243.svg"
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
            alt=""
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 text-black hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst className='text-black'/> : <ChevronLast className='text-black' />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
            <ul>
                {sidebarLinks.map((item:any) => {
                    const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)

                    return (
                        <SidebarItem
                         icon={item.imgURL}
                         text={item.label}
                         route={item.route}
                         active={isActive}
                          />
                    )
                })}
            </ul>
                
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <NavLink clasName='relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group' isMobile={false} onClick={handleLogout}>
				Logout
			</NavLink>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  )
}

export function SidebarItem({ icon, text, route, active }) {
  const { expanded } = useContext(SidebarContext)
  
  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }
    `}
    >
      <Link 
        href={`/dashboard/${route}`}
        key={text}
        className={`
            relative flex items-center py-2 px-3 my-1
            font-medium rounded-md cursor-pointer
            transition-colors group
            ${
                active
                ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
                : "hover:bg-indigo-50 text-gray-600"
            }`}
        >
        <div className='relative size-6 overflow-hidden transition-all'>
            <Image 
                src={icon}
                alt={text}
                fill
                className={cn({'brightness-[3] invert-0 overflow-hidden transition-all': active, 'w-0': !expanded})}
            />
        </div>
        <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
    </Link>
     
      {/* {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )} */}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-indigo-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  )
}