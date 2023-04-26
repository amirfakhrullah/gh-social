import { Skeleton } from "../ui/skeleton";

const AvatarSkeleton = () => {
  return (
    <div className="flex flex-row items-center gap-2 mb-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-5 w-1/3" />
    </div>
  );
};

export default AvatarSkeleton;
