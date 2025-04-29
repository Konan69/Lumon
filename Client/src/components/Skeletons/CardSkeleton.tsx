import { Skeleton } from "@/components/ui/skeleton";

export const CardSkeleton = () => {
  return (
    <div className="p-3 rounded-md border border-baseborder bg-baseform/80">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
        <Skeleton className="h-6 w-6 rounded" />
      </div>
    </div>
  );
};
