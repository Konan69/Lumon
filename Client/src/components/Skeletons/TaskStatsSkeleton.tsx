import { Skeleton } from "@/components/ui/skeleton";

export const TaskStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="bg-baseform p-4 rounded-lg border border-baseborder space-y-2"
        >
          <Skeleton className="h-4 w-2/3 rounded" />
          <Skeleton className="h-6 w-1/2 rounded" />
        </div>
      ))}
    </div>
  );
};
