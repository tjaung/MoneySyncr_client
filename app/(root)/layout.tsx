'use client'

import MobileNavBar from "@/components/MobileNavBar";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import RequireAuth from "../../components/RequireAuth";
import { useRouter } from "next/navigation";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import {Cookies} from 'typescript-cookie'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = {
    firstName: 'Tim',
    lastName: 'Jaung'
  }
  const router = useRouter();
  const {data: user, isError} = useRetrieveUserQuery(Cookies.get('access'));
  console.log(user)

  return (
    <RequireAuth>
    <main className="flex h-screen w-full font-poppins-regular">
        <Sidebar userData={user} />

        <div className="flex size-full flex-col">
          <div className="root-layout">
            <Image
              src="/icons/logo.svg"
              width={30}
              height={30}
              alt="menu icon"
            />
            <div>
              <MobileNavBar user={loggedIn} />
            </div>
          </div>
          {children}
        </div>
    </main>
    </RequireAuth>
  );
}
