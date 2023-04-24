import { Skeleton } from "../ui/skeleton";

const UserCardSkeleton = () => {
  return (
    <div className="flex flex-row items-center justify-between gap-4 my-2">
      <div className="flex flex-1 flex-row items-center gap-4">
        <Skeleton className="w-[45px] h-[40px] rounded-full" />
      <Skeleton className="w-full h-[30px]" />
      </div>
      <Skeleton className="w-[60px] h-[30px]" />
    </div>
  );
};

export default UserCardSkeleton;
