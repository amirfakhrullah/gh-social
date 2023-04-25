"use client";

import { POST_LISTING_PER_PAGE } from "@/constants";
import { api } from "@/lib/api/client";
import { useState } from "react";
import RepoCardSkeleton from "./skeletons/RepoCardSkeleton";

const MyPostLists = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { isLoading, data: posts } = api.post.myPosts.useQuery({
    perPage: POST_LISTING_PER_PAGE,
    page: currentPage,
  });

  if (isLoading)
    return (
      <>
        {[...Array(3)].map((_, idx) => (
          <RepoCardSkeleton key={`repoCardSkeleton__${idx}`} />
        ))}
      </>
    );

  return <div>{JSON.stringify(posts)}</div>;
};

export default MyPostLists;
