/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './Input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigationTransition } from '@/components/layout/NavigationProvider';

interface SearchWithDropdownProps {
  items: any[];
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  origin?: string;

  // 👇 новые пропсы
  value?: string;                          // controlled-режим
  onChange?: (value: string) => void;
  onSelect?: (item: any) => void;          // клик по подсказке
}

export function SearchWithDropdown({
  items,
  isLoading,
  placeholder = 'Поиск...',
  className,
  origin = '/',
  value,
  onChange,
  onSelect,
}: SearchWithDropdownProps) {
  const router = useRouter();
  const { setQuizOrigin } = useNavigationTransition();

  const isControlled = value !== undefined;
  const [internalQuery, setInternalQuery] = useState('');
  const searchQuery = isControlled ? value : internalQuery;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const setQuery = (v: string) => {
    if (isControlled) onChange?.(v);
    else setInternalQuery(v);
  };

  useEffect(() => {
    if (!items || searchQuery.length < 1) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }
    const filtered = items
      .filter((item: any) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
    setSuggestions(filtered);
    setIsDropdownOpen(true);
  }, [searchQuery, items]);

  const handleSuggestionClick = (quiz: any) => {
  setIsDropdownOpen(false); // закрываем в любом случае
  setSuggestions([]);       // и очищаем, чтобы не мигали старые

  if (onSelect) {
    onSelect(quiz);
    return;
  }

  // Старое поведение для каталога
  setQuizOrigin(origin);
  router.push(`/quiz/${quiz.id}/preview`);
  setQuery('');
};

  return (
    <div className={cn('relative', className)}>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setQuery(e.target.value)}
        leftIcon={<Search size={20} />}
        rightIcon={
          searchQuery.length > 0 && (
            <button
              onClick={() => {
                setQuery('');
                setIsDropdownOpen(false);
                setSuggestions([]);
              }}
              className="text-(--loom-white)/40 transition-colors hover:text-(--loom-white)"
              aria-label="Очистить поиск"
            >
              ✕
            </button>
          )
        }
        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 150)}
        onFocus={() => searchQuery.length > 0 && setIsDropdownOpen(true)}
      />

      {isDropdownOpen && suggestions.length > 0 && (
        <div className="glitch-border absolute top-full right-0 left-0 z-30 mt-2 max-h-60 overflow-y-auto rounded-xl bg-(--loom-black) p-2 shadow-xl">
          {suggestions.map((quiz: any) => (
            <button
              key={quiz.id}
              onClick={() => handleSuggestionClick(quiz)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-(--loom-white) transition-colors hover:bg-(--loom-white)/10"
            >
              <span className="truncate">{quiz.title}</span>
              <span className="text-xs text-(--loom-cyan)">
                {onSelect ? 'Выбрать' : 'Перейти'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
