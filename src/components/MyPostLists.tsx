"use client";

import { POST_LISTING_PER_PAGE } from "@/constants";
import { api } from "@/lib/api/client";
import { useState } from "react";
import CardSkeleton from "./skeletons/CardSkeleton";
import PostCard from "./PostCard";
import { Button } from "./ui/button";

const MyPostLists = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { isLoading: isLoadingPosts, data: posts } = api.post.myPosts.useQuery({
    perPage: POST_LISTING_PER_PAGE,
    page: currentPage,
  });
  const { isLoading: isLoadingProfile, data: profile } =
    api.github.profile.useQuery();

  if (isLoadingPosts || isLoadingProfile)
    return (
      <>
        {[...Array(3)].map((_, idx) => (
          <CardSkeleton key={`cardSkeleton__${idx}`} withAvatar />
        ))}
      </>
    );

  return (
    <>
      {posts && posts.length === 0 && (
        <div className="pt-20 text-center text-lg font-bold text-slate-500">
          Uh oh.. no post here.
        </div>
      )}
      {posts &&
        posts.length > 0 &&
        posts.map((data) => (
          <PostCard key={data.post.id} data={data} owner={profile} />
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

export default MyPostLists;
