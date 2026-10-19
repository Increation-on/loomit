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
            'flex min-h-80 flex-col items-center justify-center p-8 text-center',
            'glitch-border rounded-xl bg-(--loom-black)',
            this.props.className
          )}
        >
          <div className="mb-4 text-5xl font-bold text-(--loom-cyan)">⚡</div>
          <h2 className="mb-2 text-xl font-bold text-(--loom-white)">Что-то пошло не так</h2>
          <p className="mb-6 max-w-md text-(--loom-white)/60">
            {this.state.error?.message ||
              'Произошла непредвиденная ошибка. Попробуйте перезагрузить страницу.'}
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
