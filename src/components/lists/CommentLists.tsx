"use client";

import { COMMENTS_LISTING_PER_PAGE } from "@/constants";
import { api } from "@/lib/api/client";
import { useState } from "react";
import CardSkeleton from "../skeletons/CardSkeleton";
import CommentCard from "../cards/CommentCard";
import { Button } from "../ui/button";

interface Props {
  username: string;
}
const CommentLists = ({ username }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { isLoading: isLoadingComments, data: comments } =
    api.comment.otherUserComments.useQuery({
      username,
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

export default CommentLists;
