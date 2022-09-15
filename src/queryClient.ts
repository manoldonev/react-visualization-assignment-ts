import { QueryCache, QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) =>
      toast.error(`Something went wrong: ${(error as Error).message}`, {
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      }),
  }),
});

export { queryClient };
