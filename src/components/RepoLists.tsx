"use client";

import { REPO_LISTING_PER_PAGE } from "@/constants";
import { api } from "@/lib/api/client";
import RepoCard from "./RepoCard";
import RepoCardSkeleton from "./skeletons/RepoCardSkeleton";
import { Button } from "./ui/button";
import { useState } from "react";

interface Props {
  isActive: boolean;
  username: string;
}
const RepoLists = ({ isActive, username }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: repos, isLoading } = api.github.otherUserRepos.useQuery(
    {
      perPage: REPO_LISTING_PER_PAGE,
      page: currentPage,
      username,
    },
    {
      enabled: isActive,
    }
  );

  const handlePage = (pageToGo: number) => {
    window.scrollTo(0, 0);
    setCurrentPage(pageToGo);
  };

  if (isLoading)
    return (
      <>
        {[...Array(3)].map((_, idx) => (
          <RepoCardSkeleton key={`repoCardSkeleton__${idx}`} />
        ))}
      </>
    );

  return (
    <>
      {repos &&
        repos.length > 0 &&
        repos.map((repo) => <RepoCard key={repo.node_id} repo={repo} />)}

      {repos && (
        <div className="py-2 flex flex-row items-center justify-center gap-2">
          {currentPage > 1 && (
            <Button
              variant="secondary"
              onClick={() => currentPage > 1 && handlePage(currentPage - 1)}
            >
              Prev
            </Button>
          )}
          {currentPage > 1 && repos.length >= REPO_LISTING_PER_PAGE && (
            <div>{currentPage}</div>
          )}
          {repos.length >= REPO_LISTING_PER_PAGE && (
            <Button
              variant="secondary"
              onClick={() =>
                repos.length >= REPO_LISTING_PER_PAGE &&
                handlePage(currentPage + 1)
              }
            >
              Next
            </Button>
          )}
        </div>
      )}

      {repos && repos.length === 0 && (
        <div className="py-10 text-center">No Repository Found.</div>
      )}
    </>
  );
};

export default RepoLists;
