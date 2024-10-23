'use client';

import { useRegister } from '@/hooks';
import { Form } from '@/components/Forms';

export default function RegisterForm() {
	const {
		first_name,
		last_name,
		address1,
		state,
		city,
		postalCode,
		dateOfBirth,
		ssn,
		email,
		password,
		re_password,
		isLoading,
		onChange,
		onSubmit,
	} = useRegister();

	const config = [
		{
			labelText: 'First name',
			labelId: 'first_name',
			type: 'text',
			value: first_name,
			required: true,
		},
		{
			labelText: 'Last name',
			labelId: 'last_name',
			type: 'text',
			value: last_name,
			required: true,
		},
		{
			labelText: 'Address',
			labelId: 'address1',
			type: 'text',
			value: address1,
			required: true,
		},
		{
			labelText: 'City',
			labelId: 'city',
			type: 'text',
			value: city,
			required: true,
		},
		{
			labelText: 'State',
			labelId: 'state',
			type: 'text',
			value: state,
			required: true,
		},
		{
			labelText: 'Postal Code',
			labelId: 'postalCode',
			type: 'text',
			value: postalCode,
			required: true,
		},
		{
			labelText: 'Date of birth (YYYY-MM-DD)',
			labelId: 'dateOfBirth',
			type: 'text',
			value: dateOfBirth,
			required: true,
		},
		{
			labelText: 'Social Security (Last 4 digits)',
			labelId: 'ssn',
			type: 'text',
			value: ssn,
			required: true,
		},
		{
			labelText: 'Email address',
			labelId: 'email',
			type: 'email',
			value: email,
			required: true,
		},
		{
			labelText: 'Password',
			labelId: 'password',
			type: 'password',
			value: password,
			required: true,
		},
		{
			labelText: 'Confirm password',
			labelId: 're_password',
			type: 'password',
			value: re_password,
			required: true,
		},
	];

	return (
		<Form
			config={config}
			isLoading={isLoading}
			btnText='Sign up'
			onChange={onChange}
			onSubmit={onSubmit}
		/>
	);
}