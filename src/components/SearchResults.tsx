"use client";

import { POST_LISTING_PER_PAGE } from "@/constants";
import usePagination from "@/hooks/usePagination";
import { api } from "@/lib/api/client";
import CardSkeleton from "./skeletons/CardSkeleton";
import PostCard from "./cards/PostCard";

interface Props {
  query: string;
}
const SearchResults = ({ query }: Props) => {
  const { Pagination, currentPage } = usePagination();

  const { isLoading, data: posts } = api.post.searchPosts.useQuery({
    query,
    page: currentPage,
    perPage: POST_LISTING_PER_PAGE,
  });

  if (isLoading)
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
          Uh oh.. no post found.
        </div>
      )}
      {posts &&
        posts.length > 0 &&
        posts.map((data) => <PostCard key={data.post.id} data={data} />)}
      {posts && <Pagination nextPage={posts.length >= POST_LISTING_PER_PAGE} />}
    </>
  );
};

export default SearchResults;
