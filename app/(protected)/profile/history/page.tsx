'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGetAllAttemptsQuery } from '@/store/api/profileApi';

export default function HistoryPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useGetAllAttemptsQuery(page);

    return (
        <div className="p-6 max-w-2xl mx-auto">
            {data?.attempts?.length === 0 ? (
                <h1 className="text-2xl font-bold text-loom-white mb-6">Вы пока не прошли ни одного квиза</h1>
            ) : (
                <h1 className="text-2xl font-bold text-loom-white mb-6">Вся история</h1>
            )}


            {isLoading && <p className="text-loom-white">Загрузка...</p>}

            <div className="space-y-3">
                {data?.attempts?.map((a: any) => (
                    <div key={a.id} className="p-4 bg-loom-dark-secondary rounded-lg flex justify-between items-center">
                        <div>
                            <p className="text-loom-white font-semibold">{a.quizTitle}</p>
                            <p className="text-loom-white/60 text-sm">
                                {a.score}/{a.totalQuestions} · {new Date(a.createdAt).toLocaleDateString('ru')}
                            </p>
                        </div>
                        <Link href={`/profile/attempts/${a.id}`} className="text-loom-cyan text-sm">
                            Подробнее
                        </Link>
                    </div>
                ))}
            </div>

            {data?.totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="text-loom-cyan disabled:opacity-30"
                    >
                        ← Назад
                    </button>
                    <span className="text-loom-white">{page} / {data.totalPages}</span>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={page === data.totalPages}
                        className="text-loom-cyan disabled:opacity-30"
                    >
                        Вперёд →
                    </button>
                </div>
            )}
        </div>
    );
}