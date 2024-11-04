import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '@/redux/features/authApiSlice';
import { toast } from 'react-toastify';

export default function useRegister() {
	const router = useRouter();
	const [register, { isLoading }] = useRegisterMutation();

	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		address1: '',
		city: '',
		state: '',
		postalCode: '',
		dateOfBirth: '',
		ssn: '',
		email: '',
		password: '',
		re_password: '',
	});

	const [submitting, setSubmitting] = useState(false); // Add submitting flag

	const { first_name, last_name, address1, city, state, postalCode, dateOfBirth, ssn, email, password, re_password } = formData;

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		// Prevent duplicate submission if already submitting
		if (submitting) return;
		setSubmitting(true);

		try {
			await register({ first_name, last_name, address1, city, state, postalCode, dateOfBirth, ssn, email, password, re_password }).unwrap();
			toast.success('Please check email to verify account');
			router.push('/sign-in');
		} catch (error) {
			toast.error('Failed to register account');
		} finally {
			setSubmitting(false);
		}
	};

	return {
		first_name,
		last_name,
		address1, 
		city, 
		state, 
		postalCode, 
		dateOfBirth, 
		ssn,
		email,
		password,
		re_password,
		isLoading,
		onChange,
		onSubmit,
	};
}
