import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";
import StarSkeleton from "./StarSkeleton";
import AvatarSkeleton from "./AvatarSkeleton";
import { cn } from "@/lib/utils";

interface Props {
  hideCounts?: boolean;
  withAvatar?: boolean;
  border?: boolean;
}
const CardSkeleton = ({
  hideCounts = false,
  withAvatar = false,
  border = true,
}: Props) => {
  return (
    <div
      className={cn(
        "shadow-md",
        border
          ? "rounded-md border border-slate-700 m-2"
          : "border-b border-slate-700 mb-2"
      )}
    >
      <div className="md:p-5 p-2">
        {withAvatar ? (
          <AvatarSkeleton />
        ) : (
          <Skeleton className="h-5 w-1/3 mb-2" />
        )}
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-full" />
      </div>
      {!hideCounts && (
        <>
          <Separator orientation="horizontal" />
          <div className="w-full flex h-8 items-center justify-between space-x-4 text-sm">
            <StarSkeleton />
            <Separator orientation="vertical" />
            <StarSkeleton />
            <Separator orientation="vertical" />
            <StarSkeleton />
          </div>
        </>
      )}
    </div>
  );
};

export default CardSkeleton;
