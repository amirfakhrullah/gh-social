"use client";

import { COMMENTS_LISTING_PER_PAGE } from "@/constants";
import { api } from "@/lib/api/client";
import { useState } from "react";
import CommentCard from "../cards/CommentCard";
import { Button } from "../ui/button";
import CardSkeleton from "../skeletons/CardSkeleton";
import CommentForm from "../CommentForm";

interface Props {
  postId: string;
}
const PostCommentLists = ({ postId }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { isLoading, data: comments } = api.comment.commentsByPostId.useQuery({
    postId,
    page: currentPage,
    perPage: COMMENTS_LISTING_PER_PAGE,
  });

  return (
    <>
      <h3 className="text-lg font-bold mt-12 mx-3 mb-2">Comments:</h3>
      <CommentForm postId={postId} />
      {isLoading &&
        [...Array(3)].map((_, idx) => (
          <CardSkeleton key={`skeleton__${idx}`} hideCounts withAvatar />
        ))}
      {comments && comments.length === 0 && (
        <div className="pt-10 text-center text-lg font-bold text-slate-500">
          No comment.
        </div>
      )}
      {comments &&
        comments.length > 0 &&
        comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      {comments && (
        <div className="py-2 flex flex-row items-center justify-center gap-2">
          {currentPage > 1 && (
            <Button
              variant="secondary"
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            >
              Prev
            </Button>
          )}
          {currentPage > 1 && comments.length >= COMMENTS_LISTING_PER_PAGE && (
            <div>{currentPage}</div>
          )}
          {comments.length >= COMMENTS_LISTING_PER_PAGE && (
            <Button
              variant="secondary"
              onClick={() =>
                comments.length >= COMMENTS_LISTING_PER_PAGE &&
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

export default PostCommentLists;
