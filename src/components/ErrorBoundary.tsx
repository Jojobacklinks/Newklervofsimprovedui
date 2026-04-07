import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Suppress Figma iframe errors
    if (
      error.message?.includes('message port') ||
      error.message?.includes('IframeMessageAbortError') ||
      error.name === 'IframeMessageAbortError'
    ) {
      return;
    }
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] shadow-[rgba(226,232,240,0.5)_0px_2px_16px_2px] p-8 max-w-md w-full">
            <h2 className="text-xl font-semibold text-[#051046] mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              An error occurred while rendering this component. Please refresh the page to try again.
            </p>
            {this.state.error && (
              <details className="mb-4">
                <summary className="text-sm text-gray-500 cursor-pointer mb-2">
                  Error details
                </summary>
                <pre className="text-xs bg-gray-100 p-3 rounded-lg overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2.5 bg-[#9473ff] hover:bg-[#7f5fd9] text-white rounded-[15px] transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}