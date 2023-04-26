"use client";

import { TrimmedGitHubRepo } from "@/types/github";
import Link from "next/link";
import { Separator } from "./ui/separator";
import {
  AiOutlineRetweet,
  AiFillStar,
  AiOutlineStar,
  AiOutlineFork,
} from "react-icons/ai";
import { api } from "@/lib/api/client";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { displayNumbers } from "@/helpers/displayNumbers";
import StarSkeleton from "./skeletons/StarSkeleton";

interface Props {
  repo: TrimmedGitHubRepo;
}
const RepoCard = ({ repo }: Props) => {
  const { isLoading, data: hasStarred } = api.github.hasStarredTheRepo.useQuery(
    {
      owner: repo.owner.login,
      repoName: repo.name,
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
        owner: repo.owner.login,
        repoName: repo.name,
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
    if (isLoading) return;
    const action = hasStarred ? "unstar" : "star";
    mutate({
      action,
      owner: repo.owner.login,
      repoName: repo.name,
    });
  };

  return (
    <div className="border border-slate-700 m-2 rounded-md">
      <div className="md:p-5 p-2">
        <Link href={repo.html_url} target="_blank">
          <p className="text-md font-bold mb-2 text-blue-400 cursor-pointer hover:underline">
            {repo.name}
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
          <div className="mt-2">
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
      <Separator orientation="horizontal" />
      <div className="w-full flex h-8 items-center justify-between space-x-4 text-sm">
        <div className="w-full flex flex-row items-center justify-center gap-1">
          <AiOutlineRetweet />
          {displayNumbers(starCount)}
        </div>
        <Separator orientation="vertical" />

        {isLoading ? (
          <StarSkeleton />
        ) : (
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
        )}
        <Separator orientation="vertical" />
        <div
          className="w-full flex flex-row items-center justify-center gap-1 cursor-pointer"
          onClick={() =>
            window.open(`https://github.com/${repo.full_name}/fork`)
          }
        >
          <AiOutlineFork /> {displayNumbers(repo.forks_count)}
        </div>
      </div>
    </div>
  );
};

export default RepoCard;
