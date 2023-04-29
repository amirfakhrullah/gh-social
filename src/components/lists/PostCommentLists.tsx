"use client";

import { COMMENTS_LISTING_PER_PAGE } from "@/constants";
import { api } from "@/lib/api/client";
import CommentCard from "../cards/CommentCard";
import CardSkeleton from "../skeletons/CardSkeleton";
import CommentForm from "../CommentForm";
import usePagination from "@/hooks/usePagination";

interface Props {
  postId: string;
}
const PostCommentLists = ({ postId }: Props) => {
  const { currentPage, Pagination } = usePagination();

  const { isLoading, data: comments } = api.comment.commentsByPostId.useQuery({
    postId,
    page: currentPage,
    perPage: COMMENTS_LISTING_PER_PAGE,
  });

  return (
    <>
      <h3 className="text-lg font-bold mt-12 mx-3 mb-2">Replies:</h3>
      <CommentForm postId={postId} />
      {isLoading &&
        [...Array(3)].map((_, idx) => (
          <CardSkeleton key={`skeleton__${idx}`} hideCounts withAvatar />
        ))}
      {comments && comments.length === 0 && (
        <div className="pt-10 text-center text-lg font-bold text-slate-500">
          No reply.
        </div>
      )}
      {comments &&
        comments.length > 0 &&
        comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            navigateToPost={false}
          />
        ))}
      {comments && (
        <Pagination nextPage={comments.length >= COMMENTS_LISTING_PER_PAGE} />
      )}
    </>
  );
};

export default PostCommentLists;
