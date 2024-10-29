import Link from 'next/link';
import { RegisterForm } from '@/components/Forms';

import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Money Syncr | SignUp',
	description: 'signup page',
};

export default function Page() {
	return (
		<div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-sm'>
				<img
					className='mx-auto h-10 w-auto'
					src='/icons/logo.svg'
					alt='MoneySyncr'
				/>
				<h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
					Sign up for an account
				</h2>
			</div>

			<div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
				<RegisterForm />

				<p className='mt-10 text-center text-sm text-gray-500'>
					Already have an account?{' '}
					<Link
						href='sign-in'
						className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
					>
						Login here
					</Link>
				</p>
			</div>
		</div>
	);
}