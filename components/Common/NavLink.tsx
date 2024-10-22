import Link from 'next/link';
import cn from 'classnames';

interface Props {
	isSelected?: boolean;
	isMobile?: boolean;
	isBanner?: boolean;
	href?: string;
	children: React.ReactNode;
	[rest: string]: any;
}

export default function NavLink({
	isSelected,
	isMobile,
	isBanner,
	href,
	children,
	...rest
}: Props) {
	const className = 'sidebar-link sidebar-label h-16 '

	if (!href) {
		return (
			<span className={className} role='button' onClick={rest.onClick}>
				{children}
			</span>
		);
	}

	return (
		<Link className={className} href={href}>
			{children}
		</Link>
	);
}