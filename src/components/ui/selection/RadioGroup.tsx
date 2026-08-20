// src/components/ui/selection/RadioGroup.tsx
'use client';

import { createContext, useContext, ReactNode, useId } from 'react';
import { cn } from '@/lib/utils';

type RadioGroupContextType = {
  value: string;
  onChange: (value: string) => void;
  name: string;
};

const RadioGroupContext = createContext<RadioGroupContextType | null>(null);

const useRadioGroup = () => {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('RadioGroup.Item must be used within RadioGroup');
  }
  return context;
};

interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  name: string;
  children: ReactNode;
  className?: string;
}

export function RadioGroup({ value, onChange, name, children, className }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onChange, name }}>
      <div role="radiogroup" className={cn('space-y-3', className)}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

interface RadioGroupItemProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

function RadioGroupItem({ value, children, disabled, className }: RadioGroupItemProps) {
  const { value: selectedValue, onChange, name } = useRadioGroup();
  const isChecked = selectedValue === value;
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
        type="radio"
        name={name}
        value={value}
        checked={isChecked}
        onChange={() => onChange(value)}
        disabled={disabled}
        className="sr-only"
        aria-checked={isChecked}
        role="radio"
      />
      
      {/* Кастомный круг */}
      <div
        className={cn(
          'w-5 h-5 rounded-full border-2 shrink-0 transition-colors',
          isChecked ? 'border-(--loom-cyan) bg-(--loom-cyan)/20' : 'border-(--loom-white)/30'
        )}
      >
        {isChecked && (
          <div className="w-2.5 h-2.5 rounded-full bg-(--loom-cyan) m-auto translate-y-[1.5px]" />
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

RadioGroup.Item = RadioGroupItem;
