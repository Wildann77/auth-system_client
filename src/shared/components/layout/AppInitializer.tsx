import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.store';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    // Perform background auth verification without blocking UI
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}
