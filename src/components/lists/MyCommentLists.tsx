"use client";

import { COMMENTS_LISTING_PER_PAGE } from "@/constants";
import { api } from "@/lib/api/client";
import CardSkeleton from "../skeletons/CardSkeleton";
import CommentCard from "../cards/CommentCard";
import usePagination from "@/hooks/usePagination";

const MyCommentLists = () => {
  const { currentPage, Pagination } = usePagination();

  const { isLoading: isLoadingComments, data: comments } =
    api.comment.myComments.useQuery({
      perPage: COMMENTS_LISTING_PER_PAGE,
      page: currentPage,
    });
  const { isLoading: isLoadingProfile, data: profile } =
    api.github.profile.useQuery();

  if (isLoadingComments || isLoadingProfile)
    return (
      <>
        {[...Array(5)].map((_, idx) => (
          <CardSkeleton key={`skeleton__${idx}`} hideCounts withAvatar />
        ))}
      </>
    );

  return (
    <>
      {comments && comments.length === 0 && (
        <div className="pt-20 text-center text-lg font-bold text-slate-500">
          Uh oh.. no comment here.
        </div>
      )}
      {comments &&
        comments.length > 0 &&
        comments.map((data) => (
          <CommentCard key={data.id} comment={data} owner={profile} />
        ))}
      {comments && (
        <Pagination nextPage={comments.length >= COMMENTS_LISTING_PER_PAGE} />
      )}
    </>
  );
};

export default MyCommentLists;
