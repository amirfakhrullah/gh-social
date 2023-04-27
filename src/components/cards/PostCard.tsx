"use client";

import { RouterOutputs, api } from "@/lib/api/client";
import { TrimmedGitHubProfile } from "@/types/github";
import RepoCard from "./RepoCard";
import CardSkeleton from "../skeletons/CardSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AiOutlineHeart, AiFillHeart, AiOutlineRead } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { Separator } from "../ui/separator";
import AvatarSkeleton from "../skeletons/AvatarSkeleton";
import { displayNumbers } from "@/helpers/displayNumbers";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import StarSkeleton from "../skeletons/StarSkeleton";
import { useToast } from "../ui/use-toast";
import { formatTimeAgo } from "@/helpers/formatTimeAgo";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface Props {
  data: Omit<RouterOutputs["post"]["myPosts"][number], "comments">;
  onlyShowLikes?: boolean;
  owner?: TrimmedGitHubProfile;
  showFullRepo?: boolean;
  disableNavigateToPostPage?: boolean;
  border?: boolean;
}
const PostCard = ({
  data,
  owner,
  onlyShowLikes = false,
  showFullRepo = false,
  disableNavigateToPostPage = false,
  border = true,
}: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const utils = api.useContext();

  const { post, likesCount, commentsCount } = data;

  const { isLoading: isLoadingProfile, data: profile } =
    api.github.otherProfile.useQuery(
      {
        username: post.ownerId,
      },
      {
        enabled: !owner,
      }
    );

  const { isLoading: isLoadingRepo, data: repo } = api.github.getARepo.useQuery(
    {
      repoName: post.repoShared!,
    },
    {
      enabled: !!post.repoShared,
    }
  );

  const { isLoading: isLoadingLike, data: hasLiked } =
    api.like.hasLikedThePost.useQuery({
      postId: post.id,
    });

  const { mutate, isLoading: isLiking } =
    api.like.likeActionByPostId.useMutation({
      onSuccess: () => {
        utils.like.hasLikedThePost.invalidate({ postId: post.id });
        utils.like.myLikedPosts.invalidate();
        utils.post.invalidate();
        toast({
          title: "Success!",
          description: `Successfully ${
            hasLiked ? "unliked" : "liked"
          } the post`,
        });
      },
      onError: (err) =>
        toast({
          title: "Oh uh..",
          description: err.message,
        }),
    });

  const handleLike = () => {
    if (isLoadingLike || isLiking) return;
    mutate({
      postId: post.id,
      action: hasLiked ? "unlike" : "like",
    });
  };

  const readPost = () =>
    !disableNavigateToPostPage && router.push(`/posts/${post.id}`);
  const readComments = () =>
    !disableNavigateToPostPage && router.push(`/posts/${post.id}#comments`);
  const readProfile = () =>
    (owner || profile) && router.push(`/users/${(owner ?? profile)!.login}`);

  const displayRepo = !!post.repoShared;
  const displayLoaderRepo = displayRepo ? isLoadingRepo : false;
  const displayLoaderProfile = !owner ? isLoadingProfile : false;

  return (
    <div
      className={cn(
        "shadow-md",
        border
          ? "rounded-md border border-slate-700 m-2"
          : "border-b border-slate-700 mb-2"
      )}
    >
      <div className="md:p-5 md:pb-1 p-2 pb-1">
        {displayLoaderProfile && <AvatarSkeleton />}
        {(owner || profile) && (
          <div className="flex flex-row items-center gap-2 mb-3">
            <Avatar className="h-8 w-8 cursor-pointer" onClick={readProfile}>
              <AvatarImage
                src={(owner ?? profile)!.avatar_url}
                alt={(owner ?? profile)!.login}
              />
              <AvatarFallback>
                {(owner ?? profile)!.login.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div
              className="cursor-pointer hover:underline"
              onClick={readProfile}
            >
              <p className="text-sm text-slate-200 font-bold">
                {(owner ?? profile)!.name}
              </p>
              <p className="text-sm text-gray-500">
                @{(owner ?? profile)!.login}
              </p>
            </div>
            <div className="md:block hidden text-sm text-gray-500">
              {" "}
              | Posted {formatTimeAgo(post.createdAt)}
            </div>
          </div>
        )}
        <p
          className={cn(
            "mb-2 text-slate-200",
            !disableNavigateToPostPage && "cursor-pointer"
          )}
          onClick={readPost}
        >
          {post.content}
        </p>
      </div>
      {displayLoaderRepo && <CardSkeleton hideCounts={!showFullRepo} />}
      {displayRepo && repo && (
        <RepoCard repo={repo} hideCounts={!showFullRepo} />
      )}
      {displayRepo && !displayLoaderRepo && !repo && (
        <div className="border border-slate-700 m-2 rounded-md shadow-lg md:p-5 p-2 text-center">
          Repo doesn&apos;t exist
        </div>
      )}
      <div className="md:hidden block text-sm ml-2 mb-1 text-gray-500 italic">
        Posted {formatTimeAgo(post.createdAt)}
      </div>

      {onlyShowLikes ? (
        <div className="m-3">
          {isLoadingLike ? (
            <Skeleton className="h-4 md:w-12 w-8" />
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="cursor-pointer text-sm flex flex-row items-center gap-1"
                    onClick={handleLike}
                  >
                    {hasLiked ? (
                      <AiFillHeart className="text-red-600" />
                    ) : (
                      <AiOutlineHeart />
                    )}
                    {displayNumbers(Number(likesCount))} likes
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Like/Unlike the post</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      ) : (
        <>
          <Separator orientation="horizontal" />
          <div className="w-full flex h-8 items-center justify-between space-x-4 text-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="w-full flex flex-row items-center justify-center gap-1 cursor-pointer"
                    onClick={readComments}
                  >
                    <BiComment />
                    {displayNumbers(Number(commentsCount))}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go to the comments</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Separator orientation="vertical" />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="w-full flex flex-row items-center justify-center gap-1 cursor-pointer"
                    onClick={readPost}
                  >
                    <AiOutlineRead />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go to the post</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Separator orientation="vertical" />

            {isLoadingLike ? (
              <StarSkeleton />
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="w-full flex flex-row items-center justify-center gap-1 cursor-pointer"
                      onClick={handleLike}
                    >
                      {hasLiked ? (
                        <AiFillHeart className="text-red-600" />
                      ) : (
                        <AiOutlineHeart />
                      )}
                      {displayNumbers(Number(likesCount))}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Like/Unlike the post</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PostCard;
