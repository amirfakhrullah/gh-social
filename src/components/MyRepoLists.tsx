"use client";

import { REPO_LISTING_PER_PAGE } from "@/constants";
import { api } from "@/lib/api/client";
import RepoCard from "./RepoCard";

interface Props {
  isActive: boolean;
  page: number;
}
const MyRepoLists = ({ isActive, page }: Props) => {
  const { data: repos, isLoading } = api.github.myRepos.useQuery(
    {
      perPage: REPO_LISTING_PER_PAGE,
      page,
    },
    {
      enabled: isActive,
    }
  );

  if (isLoading) return <></>;

  return (
    <>
      {repos &&
        repos.length > 0 &&
        repos.map((repo) => <RepoCard key={repo.node_id} repo={repo} />)}

      {repos && repos.length === 0 && (
        <div className="py-10 text-center">No Repository Found.</div>
      )}
    </>
  );
};

export default MyRepoLists;
