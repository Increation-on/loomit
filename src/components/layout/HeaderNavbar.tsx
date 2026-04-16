'use client'

import Link from "next/link"

export function HeaderNavbar() {
    return (
        <nav className="hidden md:flex gap-6">
            <Link href="/" className="hover:text-blue-600">Главная</Link>
            <Link href="/profile/results" className="hover:text-blue-600">Мои результаты</Link>
            <Link href="/leaderboard" className="hover:text-blue-600">Рейтинг</Link>
            <Link href="/admin" className="hover:text-blue-600">Админ-панель</Link>
            <Link href="/faq" className="hover:text-blue-600">FAQ</Link>
        </nav>
    )
}
