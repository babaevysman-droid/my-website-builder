'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("❌ Ошибка в компоненте:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 m-4 border border-red-500/30 bg-red-500/10 text-red-400 rounded-xl text-sm font-mono">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">⚠️</span>
            <span className="font-semibold">Ошибка рендеринга блока</span>
          </div>
          <p className="text-xs opacity-75">Данные от AI повреждены или структура не соответствует ожидаемой.</p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="mt-2 text-xs overflow-auto max-h-32 p-2 bg-black/30 rounded">
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}