"use client";

import { POST_LISTING_PER_PAGE } from "@/constants";
import { api } from "@/lib/api/client";
import { TrimmedGitHubRepo } from "@/types/github";
import CardSkeleton from "../skeletons/CardSkeleton";
import PostCard from "../cards/PostCard";
import usePagination from "@/hooks/usePagination";

interface Props {
  repo: TrimmedGitHubRepo;
}

const RepoPostLists = ({ repo }: Props) => {
  const { currentPage, Pagination } = usePagination();

  const { isLoading, data: posts } = api.post.repoSharedPosts.useQuery({
    repoName: repo.full_name,
    page: currentPage,
    perPage: POST_LISTING_PER_PAGE,
  });

  return (
    <>
      <h3 className="text-lg font-bold mt-12 mx-3 mb-2">
        Posts that shared this repo:
      </h3>
      {isLoading &&
        [...Array(3)].map((_, idx) => (
          <CardSkeleton key={`cardSkeleton__${idx}`} withAvatar />
        ))}
      {posts && posts.length === 0 && (
        <div className="pt-10 text-center text-lg font-bold text-slate-500">
          No post linked to this repo.
        </div>
      )}
      {posts &&
        posts.length > 0 &&
        posts.map((data) => (
          <PostCard key={data.post.id} data={data} isInRepoPage />
        ))}
      {posts && <Pagination nextPage={posts.length >= POST_LISTING_PER_PAGE} />}
    </>
  );
};

export default RepoPostLists;
