import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { JobsProvider } from './contexts/JobsContext';
import { PromotionsProvider } from './contexts/PromotionsContext';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  useEffect(() => {
    // Comprehensive error suppression for Figma iframe errors
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    console.error = (...args: any[]) => {
      const errorString = args.join(' ');
      if (
        errorString.includes('IframeMessageAbortError') ||
        errorString.includes('message port was destroyed') ||
        errorString.includes('message port') ||
        errorString.includes('webpack-artifacts') ||
        errorString.includes('figma_app')
      ) {
        return; // Suppress the error
      }
      originalConsoleError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      const warnString = args.join(' ');
      if (
        warnString.includes('IframeMessageAbortError') ||
        warnString.includes('message port was destroyed') ||
        warnString.includes('message port')
      ) {
        return; // Suppress the warning
      }
      originalConsoleWarn.apply(console, args);
    };

    const handleError = (event: ErrorEvent) => {
      if (
        event.message?.includes('message port') || 
        event.message?.includes('IframeMessageAbortError') ||
        event.message?.includes('webpack-artifacts') ||
        event.filename?.includes('figma.com')
      ) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason?.message?.includes('message port') ||
        event.reason?.name === 'IframeMessageAbortError' ||
        event.reason?.stack?.includes('figma.com')
      ) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
      }
    };
    
    window.addEventListener('error', handleError, true);
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);
    
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      window.removeEventListener('error', handleError, true);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
    };
  }, []);

  return (
    <ErrorBoundary>
      <JobsProvider>
        <PromotionsProvider>
          <RouterProvider router={router} />
        </PromotionsProvider>
      </JobsProvider>
    </ErrorBoundary>
  );
}