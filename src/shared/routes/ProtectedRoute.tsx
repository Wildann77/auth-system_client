import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { Skeleton } from '@/shared/components/ui/skeleton';


interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const location = useLocation();

  if (isLoading) {
    return <div className="p-8 space-y-4">
      <Skeleton className="h-12 w-[250px]" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[200px]" />
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}


export function GuestRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-4">
        <Skeleton className="h-8 w-[150px] mx-auto" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full mt-6" />
      </div>
    </div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}


export function PremiumRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);

  if (isLoading) {
    return <div className="p-8 space-y-4">
      <Skeleton className="h-12 w-[250px]" />
      <Skeleton className="h-64 w-full" />
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isPremium) {
    return <Navigate to="/premium" replace />;
  }

  return <>{children}</>;
}


export function AdminRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);

  if (isLoading) {
    return <div className="p-8 space-y-4">
      <Skeleton className="h-12 w-[250px]" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}