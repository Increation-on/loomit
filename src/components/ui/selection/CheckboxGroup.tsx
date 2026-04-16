// src/components/ui/CheckboxGroup.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';
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
      <div role="group" className={cn('space-y-2', className)}>
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  );
}

interface CheckboxGroupItemProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
}

function CheckboxGroupItem({ value, children, disabled }: CheckboxGroupItemProps) {
  const { value: selectedValues, name } = useCheckboxGroup();
  const isChecked = selectedValues.includes(value);

  return (
    <label className={cn(
      'flex items-center gap-3 cursor-pointer',
      disabled && 'opacity-50 cursor-not-allowed'
    )}>
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={isChecked}
        onChange={(e) => {
          if (disabled) return;
          const { checked } = e.target;
          const { value: itemValue } = e.target;
          
          if (checked) {
            // Используем контекстный onChange
            const { onChange, value: currentValue } = useCheckboxGroup();
            onChange([...currentValue, itemValue]);
          } else {
            const { onChange, value: currentValue } = useCheckboxGroup();
            onChange(currentValue.filter((v) => v !== itemValue));
          }
        }}
        disabled={disabled}
        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        aria-checked={isChecked}
        role="checkbox"
      />
      <span className="text-gray-700">{children}</span>
    </label>
  );
}

CheckboxGroup.Item = CheckboxGroupItem;