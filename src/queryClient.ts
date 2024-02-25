import { QueryCache, QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
  queryCache: new QueryCache({
    onError: (error) =>
      toast.error(`Something went wrong: ${error.message}`, {
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      }),
  }),
});

export { queryClient };
