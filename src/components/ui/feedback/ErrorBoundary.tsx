// src/components/ui/feedback/ErrorBoundary.tsx
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../core/Button';
import { cn } from '@/lib/utils';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className={cn(
            'flex flex-col items-center justify-center min-h-80 p-8 text-center',
            'bg-(--loom-black) glitch-border rounded-xl',
            this.props.className
          )}
        >
          <div className="text-5xl mb-4 text-(--loom-cyan) font-bold">
            ⚡
          </div>
          <h2 className="text-xl font-bold text-(--loom-white) mb-2">
            Что-то пошло не так
          </h2>
          <p className="text-(--loom-white)/60 mb-6 max-w-md">
            {this.state.error?.message || 'Произошла непредвиденная ошибка. Попробуйте перезагрузить страницу.'}
          </p>
          <Button variant="glitch" onClick={this.handleReset}>
            Попробовать снова
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
