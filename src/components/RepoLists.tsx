"use client";

import { REPO_LISTING_PER_PAGE } from "@/constants";
import { api } from "@/lib/api/client";
import RepoCard from "./RepoCard";

interface Props {
  isActive: boolean;
  username: string;
  page: number;
}
const RepoLists = ({ isActive, username, page }: Props) => {
  const { data: repos, isLoading } = api.github.otherUserRepos.useQuery(
    {
      perPage: REPO_LISTING_PER_PAGE,
      page,
      username,
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

export default RepoLists;
