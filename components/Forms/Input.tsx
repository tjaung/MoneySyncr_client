import { ChangeEvent } from 'react';
import Link from 'next/link';

interface Props {
	labelId: string;
	type: string;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	value: string;
	children: React.ReactNode;
	link?: {
		linkText: string;
		linkUrl: string;
	};
	required?: boolean;
}

export default function Input({
	labelId,
	type,
	onChange,
	value,
	children,
	link,
	required = false,
}: Props) {
	return (
		<div>
			<div className='flex justify-between align-center'>
				<label
					htmlFor={labelId}
					className='block text-sm font-medium leading-6 text-neutral-800'
				>
					{children}
				</label>
				{link && (
					<div className='text-sm'>
						<Link
							className='font-semibold text-purple-700 hover:text-purple-700'
							href={link.linkUrl}
						>
							{link.linkText}
						</Link>
					</div>
				)}
			</div>
			<div className='mt-2'>
				<input
					id={labelId}
					className='block w-full rounded-md border-0 py-1.5 text-neutral-800 shadow-sm ring-1 ring-inset ring-neutral-800 placeholder:text-neutral-300 focus:ring-2 focus:ring-inset focus:ring-purple-700 sm:text-sm sm:leading-6'
					name={labelId}
					type={type}
					onChange={onChange}
					value={value}
					required={required}
				/>
			</div>
		</div>
	);
}