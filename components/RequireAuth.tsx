'use client';

import { redirect } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { Loader2 } from 'lucide-react';

interface Props {
	children: React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
	const { isLoading, isAuthenticated } = useAppSelector(state => state.auth);

	if (isLoading) {
		return (
			<div className='flex justify-center my-8'>
				<Loader2 size={20} className="animate-spin" />
			</div>
		);
	}

	if (!isAuthenticated) {
		redirect('sign-in');
	}

	return <>{children}</>;
}