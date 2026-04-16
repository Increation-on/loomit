// src/components/features/QuizCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardTitle } from '@/components/ui/core/Card';
import { cn } from '@/lib/utils';

interface QuizCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  questionsCount: number;
  className?: string;
}

export function QuizCard({
  id,
  title,
  description,
  imageUrl,
  questionsCount,
  className,
}: QuizCardProps) {
  return (
    <Link href={`/quiz/${id}`}>
      <Card className={cn(
        'overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer',
        className
      )}>
        {imageUrl && (
          <div className="relative h-40 w-full">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardContent className="p-4">
          <CardTitle className="mb-2 line-clamp-1">{title}</CardTitle>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {questionsCount} вопросов
            </span>
            <span className="text-blue-600 text-sm font-medium">
              Начать →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}