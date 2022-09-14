import { ErrorBoundary } from 'react-error-boundary';
import { BoxList, SmallTargetStatistic } from '../components';

import { ErrorFallback } from './ErrorFallback';

const App = (): JSX.Element => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <main className="min-h-screen">
        <h1 className="m-4">Visualization Assignment</h1>

        <div className="mx-auto flex w-fit flex-col p-4">
          <SmallTargetStatistic target={0.6} className="mx-auto" />
          <BoxList />
        </div>
      </main>
    </ErrorBoundary>
  );
};

export { App };
