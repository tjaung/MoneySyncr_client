import MobileNavBar from "@/components/MobileNavBar";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import RequireAuth from "../../components/RequireAuth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = {
    firstName: 'Tim',
    lastName: 'Jaung'
  }

  return (
    // <RequireAuth>
    <main className="flex h-screen w-full font-poppins-regular">
        <Sidebar user={loggedIn} />

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
    // </RequireAuth>
  );
}
