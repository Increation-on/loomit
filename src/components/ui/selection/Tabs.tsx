// src/components/ui/core/Tabs.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type TabsContextType = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | null>(null);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within Tabs');
  }
  return context;
};

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn('glitch-border rounded-xl bg-(--loom-black) p-4', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      className={cn('flex gap-2 border-b border-(--loom-white)/10 pb-3', className)}
      role="tablist"
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const { value: selectedValue, onValueChange } = useTabs();
  const isSelected = selectedValue === value;

  return (
    <button
      role="tab"
      aria-selected={isSelected}
      onClick={() => onValueChange(value)}
      className={cn(
        'px-4 py-2 text-sm font-medium transition-all rounded-lg',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--loom-cyan)',
        isSelected
          ? 'bg-(--loom-white)/10 text-(--loom-cyan) glitch-border'
          : 'text-(--loom-white)/50 hover:text-(--loom-white) hover:bg-(--loom-white)/5',
        className
      )}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { value: selectedValue } = useTabs();
  
  if (selectedValue !== value) return null;
  
  return (
    <div
      role="tabpanel"
      className={cn('mt-4', className)}
    >
      {children}
    </div>
  );
}
