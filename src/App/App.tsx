import { ErrorBoundary } from 'react-error-boundary';
import { Analytics } from '../routes/analytics';
import { ErrorFallback } from './ErrorFallback';

const App = (): JSX.Element => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Analytics />
    </ErrorBoundary>
  );
};

export { App };
