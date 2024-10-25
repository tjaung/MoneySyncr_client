import '@/styles/globals.css';
import "./globals.css";
import localFont from "next/font/local";
import type { Metadata } from 'next';
import Provider from '@/redux/provider';
import { Footer, Navbar } from '@/components/Common';
import { Setup } from '@/components/utils';

const poppinsRegular = localFont({
  src: "./fonts/Poppins-Regular.ttf",
  variable: "--font-poppins-regular",
  weight: "100 900",
});
const poppinsLight = localFont({
  src: "./fonts/Poppins-Light.ttf",
  variable: "--font-poppins-light",
  weight: "100 900",
});
export const metadata: Metadata = {
	title: 'Money Syncr',
	description: 'Full stack application that syncs all of your assets into one page',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={`${poppinsRegular.variable} ${poppinsLight.variable} antialiased`}>
				<Provider>
					<Setup /> 
					 {/* <Navbar /> */}
						{children}
					<Footer />
				</Provider>
			</body>
		</html>
	);
}