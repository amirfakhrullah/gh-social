"use client";

import { POST_LISTING_PER_PAGE } from "@/constants";
import { api } from "@/lib/api/client";
import CardSkeleton from "../../skeletons/CardSkeleton";
import PostCard from "../../cards/PostCard";
import usePagination from "@/hooks/usePagination";
import useRefetchTimer from "@/hooks/useRefetchTimer";
import { Button } from "@/components/ui/button";

const FollowingFeedLists = () => {
  const { currentPage, Pagination, resetPage } = usePagination();
  const { toRefetch, restartTimer } = useRefetchTimer();

  const {
    isLoading: isLoadingPosts,
    isFetching: isRefetchingPosts,
    data: posts,
    refetch,
  } = api.post.followingFeedPosts.useQuery({
    perPage: POST_LISTING_PER_PAGE,
    page: currentPage,
  });

  const handleRefetch = () => {
    if (!toRefetch) return;
    resetPage();
    refetch();
    restartTimer();
  };

  if (isLoadingPosts || isRefetchingPosts)
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
      {toRefetch && (
        <div className="flex flex-row items-center justify-center">
          <Button onClick={handleRefetch}>Refetch</Button>
        </div>
      )}
      {posts &&
        posts.length > 0 &&
        posts.map((data) => <PostCard key={data.post.id} data={data} />)}
      {posts && <Pagination nextPage={posts.length >= POST_LISTING_PER_PAGE} />}
    </>
  );
};

export default FollowingFeedLists;
