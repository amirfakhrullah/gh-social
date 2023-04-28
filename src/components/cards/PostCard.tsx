"use client";

import { RouterOutputs, api } from "@/lib/api/client";
import { TrimmedGitHubProfile, TrimmedGitHubRepo } from "@/types/github";
import RepoCard from "./RepoCard";
import CardSkeleton from "../skeletons/CardSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AiOutlineHeart, AiFillHeart, AiOutlineRead } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
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
import { useUser } from "@clerk/nextjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useState } from "react";

interface Props {
  data: Omit<RouterOutputs["post"]["myPosts"][number], "comments">;
  onlyShowLikes?: boolean;
  owner?: TrimmedGitHubProfile;
  isInRepoPage?: boolean;
  showFullRepo?: boolean;
  disableNavigateToPostPage?: boolean;
  border?: boolean;
}
const PostCard = ({
  data,
  owner,
  isInRepoPage = false,
  onlyShowLikes = false,
  showFullRepo = false,
  disableNavigateToPostPage = false,
  border = true,
}: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const utils = api.useContext();

  const { post, likesCount, commentsCount } = data;
  const [likesCountState, setLikesCountState] = useState(Number(likesCount));

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
      enabled: !!post.repoShared && !isInRepoPage,
    }
  );

  const { isLoading: isLoadingLike, data: hasLiked } =
    api.like.hasLikedThePost.useQuery({
      postId: post.id,
    });

  const { mutate: likeMutate, isLoading: isLiking } =
    api.like.likeActionByPostId.useMutation({
      onSuccess: () => {
        if (hasLiked) {
          setLikesCountState(likesCountState - 1);
        } else {
          setLikesCountState(likesCountState + 1);
        }
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
          variant: "destructive",
        }),
    });

  const { mutate: deleteMutate, isLoading: isDeleting } =
    api.post.deleteById.useMutation({
      onSuccess: () => {
        utils.like.invalidate();
        utils.comment.invalidate();
        utils.post.invalidate();
        toast({
          title: "Success!",
          description: "Delete successful",
        });
      },
      onError: (err) =>
        toast({
          title: "Oh uh..",
          description: err.message,
          variant: "destructive",
        }),
    });

  const handleLike = () => {
    if (isLoadingLike || isLiking) return;
    likeMutate({
      postId: post.id,
      action: hasLiked ? "unlike" : "like",
    });
  };

  const displayRepo = !!post.repoShared && !isInRepoPage;
  const displayLoaderRepo = displayRepo ? isLoadingRepo : false;

  const displayLoaderProfile = !owner ? isLoadingProfile : false;
  const postOwner = owner ?? profile;

  const handleDelete = () =>
    user?.username === post.ownerId && deleteMutate({ id: post.id });
  const readPost = () =>
    !disableNavigateToPostPage && router.push(`/posts/${post.id}`);
  const readComments = () =>
    !disableNavigateToPostPage && router.push(`/posts/${post.id}#comments`);
  const readProfile = () =>
    postOwner && router.push(`/users/${postOwner.login}`);

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
        {postOwner && (
          <div className="flex flex-row items-center gap-2 mb-3">
            <Avatar className="h-8 w-8 cursor-pointer" onClick={readProfile}>
              <AvatarImage src={postOwner.avatar_url} alt={postOwner.login} />
              <AvatarFallback>
                {postOwner.login.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div
              className="cursor-pointer hover:underline"
              onClick={readProfile}
            >
              <p className="text-sm text-slate-200 font-bold">
                {postOwner.name}
              </p>
              <p className="text-sm text-gray-500">@{postOwner.login}</p>
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

      {user?.username === post.ownerId && (
        <AlertDialog>
          <AlertDialogTrigger className="w-full flex justify-end px-2 pb-1">
            <div className="cursor-pointer text-sm flex flex-row items-center gap-1">
              <MdOutlineDelete />
              <p>Delete</p>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this post?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Deleting this will also delete all
                the comments and likes belongs to this post.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

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
                    {displayNumbers(likesCountState)} likes
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
                      {displayNumbers(likesCountState)}
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
