import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { JobsProvider } from './contexts/JobsContext';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  useEffect(() => {
    // Suppress iframe message port errors in development
    const handleError = (event: ErrorEvent) => {
      if (event.message && event.message.includes('message port')) {
        event.preventDefault();
        return;
      }
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <ErrorBoundary>
      <JobsProvider>
        <RouterProvider router={router} />
      </JobsProvider>
    </ErrorBoundary>
  );
}
