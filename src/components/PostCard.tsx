"use client";

import { RouterOutputs, api } from "@/lib/api/client";
import { TrimmedGitHubProfile } from "@/types/github";
import RepoCard from "./RepoCard";
import CardSkeleton from "./skeletons/CardSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { AiOutlineHeart, AiFillHeart, AiOutlineRead } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { Separator } from "./ui/separator";
import AvatarSkeleton from "./skeletons/AvatarSkeleton";
import { displayNumbers } from "@/helpers/displayNumbers";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import StarSkeleton from "./skeletons/StarSkeleton";
import { useToast } from "./ui/use-toast";
import { formatTimeAgo } from "@/helpers/formatTimeAgo";
import { useState } from "react";

interface Props {
  data: RouterOutputs["post"]["myPosts"][number];
  hideCommentsCount?: boolean;
  owner?: TrimmedGitHubProfile;
}
const PostCard = ({ data, owner, hideCommentsCount = false }: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const utils = api.useContext();

  const { post, likesCount, commentsCount } = data;
  const [totalLikes, setTotalLikes] = useState(Number(likesCount));

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

  const { mutate } = api.like.likeActionByPostId.useMutation({
    onSuccess: () => {
      if (hasLiked) {
        setTotalLikes(totalLikes - 1);
      } else {
        setTotalLikes(totalLikes + 1);
      }
      utils.like.hasLikedThePost.invalidate({ postId: post.id });
      toast({
        title: "Success!",
        description: `Successfully ${hasLiked ? "unliked" : "liked"} the post`,
      });
    },
    onError: (err) =>
      toast({
        title: "Oh uh..",
        description: err.message,
      }),
  });

  const handleLike = () => {
    if (isLoadingLike) return;
    mutate({
      postId: post.id,
      action: hasLiked ? "unlike" : "like",
    });
  };

  const readPost = () => router.push(`/posts/${post.id}`);
  const readComments = () => router.push(`/posts/${post.id}#comments`);
  const readProfile = () =>
    (owner || profile) && router.push(`/users/${(owner ?? profile)!.login}`);

  const displayRepo = !!post.repoShared;
  const displayLoaderRepo = displayRepo ? isLoadingRepo : false;
  const displayLoaderProfile = !owner ? isLoadingProfile : false;

  return (
    <div className="border border-slate-700 m-2 rounded-md shadow-md">
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
        <p className="mb-2 text-slate-200 cursor-pointer" onClick={readPost}>
          {post.content}
        </p>
      </div>
      {displayLoaderRepo && <CardSkeleton hideCounts />}
      {displayRepo && repo && <RepoCard repo={repo} hideCounts />}
      {displayRepo && !displayLoaderRepo && !repo && (
        <div className="border border-slate-700 m-2 rounded-md shadow-lg md:p-5 p-2 text-center">
          Repo doesn&apos;t exist
        </div>
      )}
      <div className="md:hidden block text-sm ml-2 mb-1 text-gray-500 italic">
        Posted {formatTimeAgo(post.createdAt)}
      </div>
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
                {!hideCommentsCount && displayNumbers(Number(commentsCount))}
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
                  {displayNumbers(totalLikes)}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Like/Unlike the post</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default PostCard;
