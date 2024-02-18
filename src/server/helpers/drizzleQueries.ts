import { eq, sql } from "drizzle-orm";
import { posts } from "../db/schema/posts";
import { comments } from "../db/schema/comments";
import { likes } from "../db/schema/likes";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";

export const getPostsWithCommentsCountAndLikesCountQuery = (
  db: NeonHttpDatabase<Record<string, never>>
) => {
  const postCommentsSq = db
    .select({
      postId: posts.id,
      commentsCount: sql<number>`count(${comments.id})`.as("comments_count"),
    })
    .from(posts)
    .leftJoin(comments, eq(comments.postId, posts.id))
    .groupBy(posts.id)
    .as("post_comments_sq");

  const postLikesSq = db
    .select({
      postId: posts.id,
      likesCount: sql<number>`count(${likes.id})`.as("likes_count"),
    })
    .from(posts)
    .leftJoin(likes, eq(likes.postId, posts.id))
    .groupBy(posts.id)
    .as("post_likes_sq");

  return db
    .select({
      post: posts,
      commentsCount: postCommentsSq.commentsCount,
      likesCount: postLikesSq.likesCount,
    })
    .from(posts)
    .leftJoin(postCommentsSq, eq(postCommentsSq.postId, posts.id))
    .leftJoin(postLikesSq, eq(postLikesSq.postId, posts.id))
    .groupBy(posts.id, postCommentsSq.commentsCount, postLikesSq.likesCount);
};
