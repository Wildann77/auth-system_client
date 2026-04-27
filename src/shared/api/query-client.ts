import { QueryClient, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
  mutationCache: new MutationCache({
    onError: (error: any, _variables, _context, mutation) => {
      // Skip if mutation is marked as silent
      if (mutation.meta?.silent) return;

      const message = error.response?.data?.message || error.message || 'Terjadi kesalahan pada server';
      
      // Skip specific cases that are handled locally (e.g., 2FA required)
      const errorData = error.response?.data;
      if (errorData?.message === '2FA code required' || errorData?.data?.requires2FA) {
        return;
      }

      toast.error(message);
    },
  }),
});
