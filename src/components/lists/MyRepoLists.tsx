"use client";

import { REPO_LISTING_PER_PAGE } from "@/constants";
import { api } from "@/lib/api/client";
import RepoCard from "../cards/RepoCard";
import CardSkeleton from "../skeletons/CardSkeleton";
import usePagination from "@/hooks/usePagination";

const MyRepoLists = () => {
  const { currentPage, Pagination } = usePagination();

  const { data: repos, isLoading } = api.github.myRepos.useQuery({
    perPage: REPO_LISTING_PER_PAGE,
    page: currentPage,
  });

  if (isLoading)
    return (
      <>
        {[...Array(3)].map((_, idx) => (
          <CardSkeleton key={`cardSkeleton__${idx}`} />
        ))}
      </>
    );

  return (
    <>
      {repos && repos.length === 0 && (
        <div className="py-10 text-center">No Repository Found.</div>
      )}
      {repos &&
        repos.length > 0 &&
        repos.map((repo) => <RepoCard key={repo.node_id} repo={repo} />)}
      {repos && <Pagination nextPage={repos.length >= REPO_LISTING_PER_PAGE} />}
    </>
  );
};

export default MyRepoLists;
