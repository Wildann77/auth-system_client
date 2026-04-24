import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { AppRoutes } from '@/shared/routes';
import { AppInitializer } from '@/shared/components/layout/AppInitializer';
import { queryClient } from '@/shared/api/query-client';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <AppInitializer>
            <AppRoutes />
          </AppInitializer>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;