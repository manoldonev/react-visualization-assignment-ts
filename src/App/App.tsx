import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Dashboard } from '../routes/dashboard';
import { ErrorFallback } from './ErrorFallback';

const App = (): JSX.Element => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<span className="p-4">Loading...</span>}>
        <Dashboard />
      </Suspense>
    </ErrorBoundary>
  );
};

export { App };
