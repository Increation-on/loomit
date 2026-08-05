// src/components/features/QuestionCard.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/core/Card';
import { RadioGroup } from '@/components/ui/selection/RadioGroup';
import { CheckboxGroup } from '@/components/ui/selection/CheckboxGroup';
import { cn } from '@/lib/utils';

type QuestionType = 'single' | 'multiple';

interface QuestionCardProps {
  questionNumber: number;
  title: string;
  type: QuestionType;
  options: string[];
  selectedValue?: string; // для single
  selectedValues?: string[]; // для multiple
  onAnswer: (value: string | string[]) => void;
  className?: string;
}

export function QuestionCard({
  questionNumber,
  title,
  type,
  options,
  selectedValue,
  selectedValues,
  onAnswer,
  className,
}: QuestionCardProps) {
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Вопрос {questionNumber}</span>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {type === 'single' ? (
          <RadioGroup
            name={`question-${questionNumber}`}
            value={selectedValue || ''}
            onChange={(value) => onAnswer(value)}
          >
            <div className="space-y-3">
              {options.map((option, index) => (
                <RadioGroup.Item key={index} value={option}>
                  {option}
                </RadioGroup.Item>
              ))}
            </div>
          </RadioGroup>
        ) : (
          <CheckboxGroup
            name={`question-${questionNumber}`}
            value={selectedValues || []}
            onChange={(values) => onAnswer(values)}
          >
            <div className="space-y-3">
              {options.map((option, index) => (
                <CheckboxGroup.Item key={index} value={option}>
                  {option}
                </CheckboxGroup.Item>
              ))}
            </div>
          </CheckboxGroup>
        )}
      </CardContent>
    </Card>
  );
}