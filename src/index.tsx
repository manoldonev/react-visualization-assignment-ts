import type { ReactElement } from 'react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/react/utils';
import { queryClientAtom } from 'jotai-tanstack-query';
import { App } from './App';
import { reportWebVitals } from './reportWebVitals';
import { queryClient } from './queryClient';
import { initializeImmer } from './utils';

const initializeMockServiceWorker = async (): Promise<void> => {
  if (import.meta.env.VITE_API_MOCKING === 'enabled') {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      },
      onUnhandledRequest: ({ url }, print) => {
        if (!url.startsWith('https://mdonev-mock.com/')) {
          return;
        }

        print.error();
      },
    });
  }
};

const HydrateAtoms = ({ children }: { children: ReactElement }): ReactElement => {
  useHydrateAtoms([[queryClientAtom, queryClient]]);
  return children;
};

const main = async (): Promise<void> => {
  await initializeMockServiceWorker();
  initializeImmer();

  const container = document.getElementById('root');
  if (container == null) {
    return;
  }

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Provider>
          <HydrateAtoms>
            <App />
          </HydrateAtoms>
        </Provider>
        <Toaster position="top-center" />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </React.StrictMode>,
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
