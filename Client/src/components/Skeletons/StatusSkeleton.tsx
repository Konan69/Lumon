import { Skeleton } from "@/components/ui/skeleton";
import { CardSkeleton } from "./CardSkeleton";

export const StatusSkeleton = () => {
  return (
    <div className="flex flex-col w-full md:min-w-[280px] md:w-1/3 bg-baseform/50 p-4 rounded-lg border border-baseborder min-h-[200px]">
      <div className="flex justify-between mb-4">
        <Skeleton className="h-6 w-1/2 rounded" />
        <Skeleton className="h-6 w-8 rounded" />
      </div>
      <div className="flex flex-col gap-3 flex-1">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
};
