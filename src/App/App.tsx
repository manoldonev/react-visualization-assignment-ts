import { ErrorBoundary } from 'react-error-boundary';
import { Dashboard } from '../routes/dashboard';
import { ErrorFallback } from './ErrorFallback';

const App = (): JSX.Element => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Dashboard />
    </ErrorBoundary>
  );
};

export { App };
