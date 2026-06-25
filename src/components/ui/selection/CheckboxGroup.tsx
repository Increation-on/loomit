// src/components/ui/selection/CheckboxGroup.tsx
'use client';

import { createContext, useContext, ReactNode, useId } from 'react';
import { cn } from '@/lib/utils';

type CheckboxGroupContextType = {
  value: string[];
  onChange: (value: string[]) => void;
  name: string;
};

const CheckboxGroupContext = createContext<CheckboxGroupContextType | null>(null);

const useCheckboxGroup = () => {
  const context = useContext(CheckboxGroupContext);
  if (!context) {
    throw new Error('CheckboxGroup.Item must be used within CheckboxGroup');
  }
  return context;
};

interface CheckboxGroupProps {
  value: string[];
  onChange: (value: string[]) => void;
  name: string;
  children: ReactNode;
  className?: string;
}

export function CheckboxGroup({ value, onChange, name, children, className }: CheckboxGroupProps) {
  const handleChange = (itemValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, itemValue]);
    } else {
      onChange(value.filter((v) => v !== itemValue));
    }
  };

  return (
    <CheckboxGroupContext.Provider value={{ value, onChange, name }}>
      <div role="group" className={cn('space-y-3', className)}>
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  );
}

interface CheckboxGroupItemProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

function CheckboxGroupItem({ value, children, disabled, className }: CheckboxGroupItemProps) {
  const { value: selectedValues, onChange, name } = useCheckboxGroup();
  const isChecked = selectedValues.includes(value);
  const id = useId();

  return (
    <label
      htmlFor={id}
      className={cn(
        'relative flex items-center gap-3 p-4 cursor-pointer rounded-xl transition-all duration-200',
        'bg-(--loom-white)/5 hover:bg-(--loom-white)/10',
        isChecked ? 'glitch-border' : 'border border-(--loom-white)/10',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <input
        id={id}
        type="checkbox"
        name={name}
        value={value}
        checked={isChecked}
        onChange={(e) => {
          if (disabled) return;
          const checked = e.target.checked;
          if (checked) {
            onChange([...selectedValues, value]);
          } else {
            onChange(selectedValues.filter((v) => v !== value));
          }
        }}
        disabled={disabled}
        className="sr-only"
        aria-checked={isChecked}
        role="checkbox"
      />

      {/* Кастомный квадрат */}
      <div
        className={cn(
          'w-5 h-5 rounded shrink-0 transition-colors flex items-center justify-center',
          isChecked ? 'border-(--loom-cyan) bg-(--loom-cyan)/20' : 'border-(--loom-white)/30 border'
        )}
      >
        {isChecked && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5 text-(--loom-cyan)"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      <span
        className={cn(
          'text-sm font-medium transition-colors',
          isChecked ? 'text-(--loom-cyan)' : 'text-(--loom-white)'
        )}
      >
        {children}
      </span>
    </label>
  );
}

CheckboxGroup.Item = CheckboxGroupItem;