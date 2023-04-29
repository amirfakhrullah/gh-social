"use client";

import { POST_LISTING_PER_PAGE } from "@/constants";
import { api } from "@/lib/api/client";
import CardSkeleton from "../../skeletons/CardSkeleton";
import PostCard from "../../cards/PostCard";
import usePagination from "@/hooks/usePagination";

const HotPostLists = () => {
  const { currentPage, Pagination } = usePagination();

  const { isLoading: isLoadingPosts, data: posts } =
    api.post.hotFeedPosts.useQuery({
      perPage: POST_LISTING_PER_PAGE,
      page: currentPage,
    });

  if (isLoadingPosts)
    return (
      <>
        {[...Array(10)].map((_, idx) => (
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
        posts.map((data) => <PostCard key={data.post.id} data={data} />)}
      {posts && <Pagination nextPage={posts.length >= POST_LISTING_PER_PAGE} />}
    </>
  );
};

export default HotPostLists;
