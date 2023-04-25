import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";

const RepoCardSkeleton = () => {
  return (
    <div className="border border-slate-700 m-2 rounded-md">
      <div className="md:p-5 p-2">
        <Skeleton className="h-5 w-1/3 mb-2" />
        <Skeleton className="h-3 w-full" />
      </div>
      <Separator orientation="horizontal" />
      <div className="w-full flex h-8 items-center justify-between space-x-4 text-sm">
        <div className="h-1 w-2"/>
        <Separator orientation="vertical" />
        <Separator orientation="vertical" />
        <div className="h-1 w-2"/>
      </div>
    </div>
  );
};

export default RepoCardSkeleton;
