import { Skeleton } from "@/shared/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-4">
      <Skeleton className="h-12 w-[250px]" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  );
}

export function LoginSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-4">
        <Skeleton className="h-8 w-[150px] mx-auto" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full mt-6" />
      </div>
    </div>
  );
}

export function PremiumSkeleton() {
  return (
    <div className="p-8 space-y-4">
      <Skeleton className="h-12 w-[250px]" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export function AdminSkeleton() {
  return (
    <div className="p-8 space-y-4">
      <Skeleton className="h-12 w-[250px]" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
