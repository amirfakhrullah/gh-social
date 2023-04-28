"use client";

import { TrimmedGitHubRepo } from "@/types/github";
import Link from "next/link";
import { Separator } from "../ui/separator";
import {
  AiOutlineRetweet,
  AiFillStar,
  AiOutlineStar,
  AiOutlineFork,
} from "react-icons/ai";
import { api } from "@/lib/api/client";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { displayNumbers } from "@/helpers/displayNumbers";
import StarSkeleton from "../skeletons/StarSkeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { usePostModalContext } from "@/providers/PostModalProvider";
import { cn } from "@/lib/utils";
import { convertToRepoId } from "@/helpers/repoId";

interface Props {
  repo: TrimmedGitHubRepo;
  hideCounts?: boolean;
  border?: boolean;
  navigateToGitHub?: boolean;
}
const RepoCard = ({
  repo,
  hideCounts = false,
  border = true,
  navigateToGitHub = false,
}: Props) => {
  const { handleOpen: handleOpenPostModal } = usePostModalContext();

  const { isLoading: isLoadingHasStarred, data: hasStarred } =
    api.github.hasStarredTheRepo.useQuery(
      {
        repoName: repo.full_name,
      },
      {
        enabled: !hideCounts,
      }
    );
  const { isLoading: isLoadingRepoSharedCounts, data: totalShared } =
    api.post.repoSharedCounts.useQuery(
      {
        repoName: repo.full_name,
      },
      {
        enabled: !hideCounts,
      }
    );
  const [starCount, setStarCount] = useState(repo.stargazers_count);

  const { toast } = useToast();
  const utils = api.useContext();

  const { mutate } = api.github.starAction.useMutation({
    onError: (err) =>
      toast({
        title: "Oh uh..",
        description: err.message,
        variant: "destructive",
      }),
    onSuccess: (res) => {
      setStarCount((count) => {
        if (hasStarred) {
          return count - 1;
        } else {
          return count + 1;
        }
      });
      utils.github.hasStarredTheRepo.invalidate({
        repoName: repo.full_name,
      });
      utils.github.myRepos.invalidate();
      utils.github.otherUserRepos.invalidate();

      toast({
        title: res.success ? "Success!" : "Oh uh..",
        description: res.message,
        variant: res.success ? "default" : "destructive",
      });
    },
  });

  const handleStar = () => {
    if (isLoadingHasStarred) return;
    const action = hasStarred ? "unstar" : "star";
    mutate({
      action,
      repoName: repo.full_name,
    });
  };

  const handleShareRepo = () => handleOpenPostModal(repo);

  return (
    <div
      className={cn(
        "shadow-md",
        border
          ? "rounded-md border border-slate-700 m-2"
          : "border-b border-slate-700"
      )}
    >
      <div className="md:p-5 p-2">
        <Link
          href={
            navigateToGitHub
              ? repo.html_url
              : `/repos/${convertToRepoId(repo.full_name)}`
          }
          target={navigateToGitHub ? "_blank" : undefined}
        >
          <p className="text-md font-bold mb-2 text-blue-400 cursor-pointer hover:underline">
            {repo.full_name}
          </p>
        </Link>
        {repo.fork && (
          <div className="text-[13px] text-gray-400 mb-2 flex flex-row items-center gap-1 italic">
            <AiOutlineFork />
            This is a forked repository
          </div>
        )}
        <p className="text-sm text-slate-500">{repo.description}</p>
        {repo.topics && (
          <div className="mt-2 md:block hidden">
            {repo.topics.map((topic) => (
              <Badge
                key={topic + repo.name}
                variant="secondary"
                className="mr-1 bg-slate-400"
              >
                {topic}
              </Badge>
            ))}
          </div>
        )}
      </div>
      {!hideCounts && (
        <>
          <Separator orientation="horizontal" />
          <div className="w-full flex h-8 items-center justify-between space-x-4 text-sm">
            {isLoadingRepoSharedCounts ? (
              <StarSkeleton />
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="w-full flex flex-row items-center justify-center gap-1 cursor-pointer"
                      onClick={handleShareRepo}
                    >
                      <AiOutlineRetweet />
                      {displayNumbers(totalShared ?? 0)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share repo in a post</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <Separator orientation="vertical" />

            {isLoadingHasStarred ? (
              <StarSkeleton />
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="w-full flex flex-row items-center justify-center gap-1 cursor-pointer"
                      onClick={handleStar}
                    >
                      {hasStarred ? (
                        <AiFillStar className="text-yellow-400" />
                      ) : (
                        <AiOutlineStar />
                      )}
                      {displayNumbers(starCount)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Star/Unstar the repo</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <Separator orientation="vertical" />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="w-full flex flex-row items-center justify-center gap-1 cursor-pointer"
                    onClick={() =>
                      window.open(`https://github.com/${repo.full_name}/fork`)
                    }
                  >
                    <AiOutlineFork /> {displayNumbers(repo.forks_count)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fork the repo</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </>
      )}
    </div>
  );
};

export default RepoCard;
