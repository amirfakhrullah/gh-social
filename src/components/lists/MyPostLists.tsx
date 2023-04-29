"use client";

import { POST_LISTING_PER_PAGE } from "@/constants";
import { api } from "@/lib/api/client";
import CardSkeleton from "../skeletons/CardSkeleton";
import PostCard from "../cards/PostCard";
import usePagination from "@/hooks/usePagination";

const MyPostLists = () => {
  const { currentPage, Pagination } = usePagination();

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
      {posts && <Pagination nextPage={posts.length >= POST_LISTING_PER_PAGE} />}
    </>
  );
};

export default MyPostLists;
