'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";

export function HeaderNavbar() {
    const { data: session } = useSession();

    return (
        <nav className="hidden md:flex gap-6">
            <Link href="/" className="hover:text-loom-cyan text-loom-white">
                Главная
            </Link>
            <Link href="/profile" className="hover:text-loom-cyan text-loom-white">
                Профиль
            </Link>
            {(session?.user as any)?.role === 'admin' && (
                <Link href="/admin" className="hover:text-loom-yellow text-loom-white">
                    Админка
                </Link>
            )}
        </nav>
    );
}
