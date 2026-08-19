'use client';

import { usePathname } from 'next/navigation';
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
    const { startGlitchTransition } = useNavigationTransition();
    const router = useRouter();
    const pathname = usePathname(); // ✅ добавили

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

        // ✅ проверка на текущий путь
        if (pathname === href) {
            e.preventDefault();
            return;
        }

        onClick?.(e);

        if (e.defaultPrevented) return;

        e.preventDefault();

        startGlitchTransition();

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