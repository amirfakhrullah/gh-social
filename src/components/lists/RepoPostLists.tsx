"use client";

import { POST_LISTING_PER_PAGE } from "@/constants";
import { api } from "@/lib/api/client";
import { TrimmedGitHubRepo } from "@/types/github";
import { useState } from "react";
import CardSkeleton from "../skeletons/CardSkeleton";
import PostCard from "../cards/PostCard";
import { Button } from "../ui/button";

interface Props {
  repo: TrimmedGitHubRepo;
}

const RepoPostLists = ({ repo }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

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
      {posts && (
        <div className="py-2 flex flex-row items-center justify-center gap-2">
          {currentPage > 1 && (
            <Button
              variant="secondary"
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            >
              Prev
            </Button>
          )}
          {currentPage > 1 && posts.length >= POST_LISTING_PER_PAGE && (
            <div>{currentPage}</div>
          )}
          {posts.length >= POST_LISTING_PER_PAGE && (
            <Button
              variant="secondary"
              onClick={() =>
                posts.length >= POST_LISTING_PER_PAGE &&
                setCurrentPage(currentPage + 1)
              }
            >
              Next
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default RepoPostLists;
