// src/components/ui/ErrorBoundary.tsx
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../core/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
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
        <div className="flex flex-col items-center justify-center min-h-100 p-8 text-center">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Что-то пошло не так
          </h2>
          <p className="text-gray-600 mb-6 max-w-md">
            {this.state.error?.message || 'Произошла непредвиденная ошибка'}
          </p>
          <Button onClick={this.handleReset}>
            Попробовать снова
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}