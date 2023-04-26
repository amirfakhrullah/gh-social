import { Skeleton } from "../ui/skeleton";

const StarSkeleton = () => {
  return (
    <div className="w-full flex flex-row items-center justify-center">
      <Skeleton className="h-4 md:w-12 w-8" />
    </div>
  );
};

export default StarSkeleton;
