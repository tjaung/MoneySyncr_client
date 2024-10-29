'use client'

import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

export default function Home() {
	return (
		<div className="bg-gray-50 text-gray-800 z-50">
			{/* Header */}
			<header className="flex items-center justify-between px-6 py-4 bg-white shadow sticky top-0 z-50">
				<div className="text-2xl font-bold">
					<Link href="/">
            <img className='h-12'
            src={'/icons/logo.svg'}
            alt='MoneySyncr'
            />
          </Link>
				</div>
				<nav className="hidden space-x-8 md:flex z-50">
					<Link href="#features" className="hover:text-indigo-600">
						Features
					</Link>
					<Link href="#testimonials" className="hover:text-indigo-600">
						Testimonials
					</Link>
					<Link href="#contact" className="hover:text-indigo-600">
						Contact
					</Link>
				</nav>

				<div className="block">
        <Link href="/sign-in" className="px-4 py-2 mr-4 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500">
						Login
					</Link>
					<Link href="/sign-up" className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500">
						Get Started
					</Link>
				</div>
			</header>

			<section className="flex flex-col items-center px-6 py-20 text-center md:flex-row md:justify-between md:text-left bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
  <div className="max-w-xl space-y-6 md:basis-1/2">
    <h1 className="text-4xl font-bold md:text-5xl">
      Pay All Your Credit Card Bills <span className="text-yellow-300">in One Place</span>
    </h1>
    <p className="text-lg leading-relaxed">
      No more juggling between apps! With MoneySyncr, you can pay all your credit card bills from one streamlined platform.
    </p>
    <Link href="/sign-up" className="inline-block px-8 py-3 font-semibold text-indigo-600 bg-white rounded-lg">
      Get Started Now!
    </Link>
  </div>
  
  {/* Carousel Section */}
  <div className="mt-10 md:mt-0 md:basis-1/2 overflow-hidden">
    <Carousel className="w-full" plugins={[
      Autoplay({
        delay: 5000,
      }),
    ]}>
      <CarouselContent className='z-0'>
        <CarouselItem><img className='h-auto w-[700px] z-0' src='/icons/home.png'/></CarouselItem>
        <CarouselItem><img className='h-auto w-[700px] z-0' src='/icons/linkaccounts.png'/></CarouselItem>
        <CarouselItem><img className='h-auto w-[700px] z-0' src='/icons/budget.png'/></CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
</section>


			{/* Features Section */}
			<section id="features" className="px-6 py-20 bg-gray-100">
				<h2 className="text-3xl font-bold text-center">Features</h2>
				<div className="grid gap-10 mt-10 md:grid-cols-3">
					{[
						{ title: 'Link your credit cards and pay from any account', desc: 'Link any bank account and pay your bills with them' },
						{ title: 'All your spending from all sources in one place', desc: 'Consolidate all of your spending records in one dashboard' },
						{ title: 'Analyze your habits', desc: 'Understand your spending across different months and different accounts' },
					].map((feature, index) => (
						<div key={index} className="p-6 text-center bg-white rounded-lg shadow">
							<h3 className="text-xl font-semibold">{feature.title}</h3>
							<p className="mt-4 text-gray-600">{feature.desc}</p>
						</div>
					))}
				</div>
			</section>

			
			<section id="testimonials" className="px-6 py-20 bg-white">
				<h2 className="text-3xl font-bold text-center">Your banking safe and secure</h2>
				<div className="mb-6">
				
          <div className="mt-4 px-24 py-12 text-center bg-gray-100 rounded-lg shadow">
          <h4 className="mt-4 text-lg font-semibold">The last thing you need on your mind while budgeting is theft</h4>
            <p className="text-gray-600">We understand the importance of keeping your assets secure from online threats. That's why we've partnered with Plaid to safely link your accounts and keep out unwanted threats.</p>
          </div>
				</div>
			</section>

			{/* Call-to-Action Section */}
			<section id="contact" className="px-6 py-20 text-center bg-indigo-600 text-white">
				<h2 className="text-3xl font-bold">Get Started with MoneySyncr</h2>
				<p className="mt-4 text-lg">
					Ready to start? Join us today and experience MoneySyncr!
				</p>
				<Link href="/sign-up" className="inline-block px-8 py-3 mt-6 font-semibold text-indigo-600 bg-white rounded-lg">
					Sign Up
				</Link>
        <p className='mt-5'>Have a question?</p>
        <p>Email us at: </p>
        <p>moneysyncr@gmail.com</p>
			</section>

		</div>
	);
}
