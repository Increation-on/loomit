'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './Input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchWithDropdownProps {
  items: any[];
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function SearchWithDropdown({ 
  items, 
  isLoading, 
  placeholder = 'Поиск...',
  className 
}: SearchWithDropdownProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    if (!items || searchQuery.length < 1) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }
    const filtered = items
      .filter((item: any) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);
    setSuggestions(filtered);
    setIsDropdownOpen(true);
  }, [searchQuery, items]);

  return (
    <div className={cn('relative', className)}>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        leftIcon={<Search size={20} />}
        rightIcon={
          searchQuery.length > 0 && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsDropdownOpen(false);
                setSuggestions([]);
              }}
              className="text-(--loom-white)/40 hover:text-(--loom-white) transition-colors"
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
        <div className="absolute top-full left-0 right-0 mt-2 z-30 glitch-border rounded-xl bg-(--loom-black) p-2 max-h-60 overflow-y-auto shadow-xl">
          {suggestions.map((quiz: any) => (
            <button
              key={quiz.id}
              onClick={() => {
                router.push(`/quiz/${quiz.id}`);
                setIsDropdownOpen(false);
                setSearchQuery('');
              }}
              className="w-full text-left px-3 py-2 text-sm text-(--loom-white) hover:bg-(--loom-white)/10 rounded-lg transition-colors flex justify-between items-center"
            >
              <span className="truncate">{quiz.title}</span>
              <span className="text-(--loom-cyan) text-xs">Перейти</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
