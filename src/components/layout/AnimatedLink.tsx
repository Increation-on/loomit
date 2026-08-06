'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MouseEvent } from 'react';
import { useNavigationTransition } from './NavigationProvider';

type AnimatedLinkProps = Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'href'
> & {
    href: string;
    children: React.ReactNode;
    delay?: number;
};

export default function AnimatedLink({
    href,
    children,
    delay = 80,
    onClick,
    ...props
}: AnimatedLinkProps) {
    const { startNavigation } = useNavigationTransition();
    const router = useRouter();

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        if (
            e.defaultPrevented ||
            e.metaKey ||
            e.ctrlKey ||
            e.shiftKey ||
            e.altKey ||
            e.button !== 0
        ) {
            return;
        }

        onClick?.(e);

        if (e.defaultPrevented) return;

        e.preventDefault();

        startNavigation();

        setTimeout(() => {
            router.push(href);
        }, delay);
    };

    return (
        <Link
            href={href}
            onClick={handleClick}
            {...props}
        >
            {children}
        </Link>
    );
}