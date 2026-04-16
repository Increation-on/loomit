// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';

export default function Logo() {

    return (
        <>
            <Link href="/" className="text-xl font-bold text-blue-600">
                LoomIt
            </Link>
        </>
    );
}