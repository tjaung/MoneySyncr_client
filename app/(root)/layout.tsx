import { RequireAuth } from '@/components/utils';
import Sidebar from '@/components/Dashboard/Sidebar';
import MobileNavBar from '@/components/Common/MobileNavBar';
import Image from 'next/image';

interface Props {
	children: React.ReactNode;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	return <RequireAuth>
    <main className="flex h-screen w-full font-poppins-regular">
      <Sidebar />

      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" width={30} height={30} alt="logo" />
          <div>
            <MobileNavBar />
          </div>
        </div>
        {children}
      </div>
    </main>
  </RequireAuth>;
}