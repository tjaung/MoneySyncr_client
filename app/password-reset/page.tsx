
import type { Metadata } from 'next';
import { PasswordResetForm } from '@/components/PasswordResetForm';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Password Reset',
	description: 'Password reset page',
};

export default function Page() {
	return (
		<div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-sm'>
				<img
					className='mx-auto h-10 w-auto'
					src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
					alt=''
				/>
				<h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
					Get a link to reset your password
				</h2>
				<p>It may take a few minutes to receive your reset email</p>
			</div>

			<div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
				<PasswordResetForm />
			</div>
			<footer className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm flex flex-col justify-center align-center gap-1">
				<p className="text-14 font-normal text-gray-600">
					<Link className="form-link" href='/sign-in'>Back to Sign-in</Link>
				</p>
				
			</footer>
		</div>
	);
}