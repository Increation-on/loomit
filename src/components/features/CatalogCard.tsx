'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/core/Card';
import { StarButton } from '@/components/ui/core/StarButton';
import { Button } from '@/components/ui/core/Button';
import { cn, pluralize } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface CatalogCardProps {
    quiz: {
        id: string;
        title: string;
        description?: string | null;
        level: string;
        category: {
            id: string;
            name: string;
            iconUrl?: string | null;
        } | null;
        questions?: { id: string }[];
        _count?: {
            questions: number;
            attempts: number;
        };
    };
    lastAttempt?: {
        score: number;
        totalQuestions: number;
    } | null;
    className?: string;

    isFavorited?: boolean;
    isFavoriteLoading?: boolean;
    showFavorite?: boolean;
    onFavoriteToggle?: () => void;
}

export function CatalogCard({
    quiz,
    lastAttempt,
    className,
    isFavorited = false,
    isFavoriteLoading = false,
    showFavorite = true,
    onFavoriteToggle,
}: CatalogCardProps) {


    const router = useRouter();

    const levelLabel = quiz.level
        ? quiz.level.charAt(0) + quiz.level.slice(1).toLowerCase()
        : 'Любой';

    const levelDotColor = cn(
        quiz.level === 'JUNIOR' && 'bg-(--loom-cyan)',
        quiz.level === 'MIDDLE' && 'bg-(--loom-yellow)',
        quiz.level === 'SENIOR' && 'bg-(--glitch-pink)'
    );

    return (
        <Card className={cn('overflow-hidden flex flex-row p-4 gap-4', className)}>
            {/* Левая часть */}
            <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-start gap-3">
                    {/* Иконка категории */}
                    <div className="w-12 h-12 rounded-full shrink-0 overflow-hidden bg-(--loom-black) border border-(--loom-white)/10 flex items-center justify-center">
                        {quiz.category?.iconUrl ? (
                            <img
                                src={quiz.category.iconUrl}
                                alt={quiz.category.name}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <span className="text-(--loom-cyan) font-bold text-lg">
                                {quiz.category?.name?.[0] || '?'}
                            </span>
                        )}
                    </div>

                    {/* Заголовок */}
                    <div className="flex flex-col min-w-0">
                        <h3 className="text-lg font-semibold text-(--loom-white) truncate">
                            {quiz.title}
                        </h3>

                        {quiz.description && (
                            <p className="text-sm text-(--loom-white)/60 line-clamp-2">
                                {quiz.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Метаданные */}
                <div className="flex flex-wrap items-center gap-3 text-xs mt-1">
                    <span className="text-(--loom-white)/50">
                        {quiz.questions?.length || quiz._count?.questions || 0}{' '}
                        {pluralize(
                            quiz.questions?.length || quiz._count?.questions || 0,
                            'вопрос',
                            'вопроса',
                            'вопросов'
                        )}
                    </span>

                    <div className="flex items-center gap-1.5">
                        <span className={cn('w-1.5 h-1.5 rounded-full', levelDotColor)} />
                        <span className="text-(--loom-white)/50">{levelLabel}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span className="text-(--loom-white)/20">●</span>
                        <span className="text-(--loom-magenta)">
                            {quiz.category?.name || 'Без категории'}
                        </span>
                    </div>

                    {lastAttempt && (
                        <>
                            <span className="text-(--loom-white)/20">●</span>
                            <span
                                className={cn(
                                    'font-semibold',
                                    lastAttempt.score === lastAttempt.totalQuestions
                                        ? 'text-(--loom-cyan)'
                                        : 'text-(--loom-yellow)'
                                )}
                            >
                                {lastAttempt.score}/{lastAttempt.totalQuestions}
                            </span>
                        </>
                    )}
                </div>

                {/* Кнопка открытия */}
                <div className="mt-auto pt-2">
                    <Button
                        variant="outline"
                        className="w-full glitch-border text-(--loom-cyan) hover:text-(--loom-white) hover:bg-(--loom-cyan)/10 transition-all flex items-center justify-center relative"
                        onClick={() => router.push(`/quiz/${quiz.id}/preview`)}
                    >
                        <span>Открыть квиз</span>
                        <ChevronRight size={22} className="absolute right-2" />
                    </Button>
                </div>
            </div>

            {/* Правая зона */}
            {showFavorite && (
                <div className="flex flex-col items-center justify-center shrink-0 pl-4 border-l border-(--loom-white)/10">
                    <StarButton
                        active={isFavorited}
                        loading={isFavoriteLoading}
                        size={28}
                        className="hover:scale-110 transition-transform"
                        onClick={onFavoriteToggle ?? (() => {})}
                    />
                </div>
            )}
        </Card>
    );
}