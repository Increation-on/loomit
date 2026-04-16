// src/components/ui/RadioGroup.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';
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
      <div role="radiogroup" className={className}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

interface RadioGroupItemProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
}

function RadioGroupItem({ value, children, disabled }: RadioGroupItemProps) {
  const { value: selectedValue, onChange, name } = useRadioGroup();
  const isChecked = selectedValue === value;

  return (
    <label className={cn(
      'flex items-center gap-3 cursor-pointer',
      disabled && 'opacity-50 cursor-not-allowed'
    )}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={isChecked}
        onChange={() => onChange(value)}
        disabled={disabled}
        className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
        aria-checked={isChecked}
        role="radio"
      />
      <span className="text-gray-700">{children}</span>
    </label>
  );
}

RadioGroup.Item = RadioGroupItem;