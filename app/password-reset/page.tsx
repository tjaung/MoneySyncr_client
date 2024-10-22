import { PasswordResetForm } from '@/components/Forms';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Full Auth | Password Reset',
	description: 'Full Auth password reset page',
};

export default function Page() {
	return (
		<div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-sm'>
				<img
					className='mx-auto h-10 w-auto'
					src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
					alt='Full Auth'
				/>
				<h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
					Reset your password
				</h2>
			</div>

			<div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
				<PasswordResetForm />
			</div>
			<div className='mt-10 text-center text-sm font-bold leading-9 tracking-tight text-gray-900'>
				<Link className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500' href={'sign-in'}>
					Back to Sign-in
				</Link>
			</div>
		</div>
	);
}