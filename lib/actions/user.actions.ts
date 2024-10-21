import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { useLoginMutation } from '@/redux/features/authApiSlice';
import { useRegisterMutation } from '@/redux/features/authApiSlice';
import { setAuth } from '@/redux/features/authSlice';
import { toast } from 'react-toastify';


export async function signUp(data: { first_name: string | undefined; last_name: string | undefined; address: string | undefined; city: string | undefined; state: string | undefined; postalCode: string | undefined; email: string | undefined; phone: string | undefined; password: string | undefined; re_password: string | undefined; username: string | undefined; }) {
	const router = useRouter();
	const [register] = useRegisterMutation();

    register(data)
        .unwrap()
        .then(() => {
            toast.success('A verification email was sent to you');
            router.push('sign-in');
        })
        .catch((error) => {
            toast.error(JSON.stringify(error.data));
        });
	};

export async function signIn(email: string | undefined, password: string | undefined) {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [login] = useLoginMutation();

    login({ email, password })
        .unwrap()
        .then(() => {
            dispatch(setAuth());
            toast.success('Logged in');
            router.push('/');
        })
        .catch(() => {
            toast.error('Failed to log in');
        });
	};