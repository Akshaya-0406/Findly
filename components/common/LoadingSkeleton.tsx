import React from "react";
import Skeleton from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  count?: number;
  columns?: number;
}

export const ItemCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-neutral-100 rounded-2xl p-4 flex flex-col gap-3 shadow-xs">
      <Skeleton className="h-44 w-full rounded-xl" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2 mt-2">
        <Skeleton className="h-9 flex-1 rounded-lg" />
      </div>
    </div>
  );
};

export const LoadingGrid: React.FC<LoadingSkeletonProps> = ({
  count = 4,
  columns = 4,
}) => {
  const cols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[columns] || "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <div className={`grid gap-6 ${cols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <ItemCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const ItemDetailsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white border border-neutral-100 rounded-3xl">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-96 w-full rounded-2xl" />
        <div className="flex gap-2">
          <Skeleton className="h-20 w-20 rounded-xl" />
          <Skeleton className="h-20 w-20 rounded-xl" />
          <Skeleton className="h-20 w-20 rounded-xl" />
        </div>
      </div>
      <div className="flex flex-col gap-5 justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <div className="flex flex-col gap-4 border-t border-neutral-50 pt-4">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};
export default LoadingGrid;
