import { Skeleton } from "@/shared/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";

export function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[60px] mb-1" />
        <Skeleton className="h-3 w-[80px]" />
      </CardContent>
    </Card>
  );
}

export function SpotCardSkeleton() {
  return (
    <div className="flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-muted p-4">
      <Skeleton className="h-8 w-12 mb-2" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <SpotCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function MovimentacoesListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Skeleton className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      ))}
    </div>
  );
}

export function SpotGridSkeleton({ count = 12, className }: { count?: number; className?: string }) {
  return (
    <div className={className || "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col items-center justify-center rounded-lg border-2 border-muted p-3 h-[88px]">
          <Skeleton className="h-6 w-10 mb-1" />
          <Skeleton className="h-3 w-14" />
        </div>
      ))}
    </div>
  );
}
