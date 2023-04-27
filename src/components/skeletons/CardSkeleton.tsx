import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";
import StarSkeleton from "./StarSkeleton";
import AvatarSkeleton from "./AvatarSkeleton";

interface Props {
  hideCounts?: boolean;
  withAvatar?: boolean;
  onlyShowLike?: boolean;
}
const CardSkeleton = ({
  hideCounts = false,
  withAvatar = false,
  onlyShowLike = false,
}: Props) => {
  return (
    <div className="border border-slate-700 m-2 rounded-md shadow-md">
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
            {!onlyShowLike && (
              <>
                <StarSkeleton />
                <Separator orientation="vertical" />
                <StarSkeleton />
                <Separator orientation="vertical" />
              </>
            )}
            <StarSkeleton />
          </div>
        </>
      )}
    </div>
  );
};

export default CardSkeleton;
