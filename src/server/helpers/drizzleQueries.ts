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
      commentsCount: sql<string>`count(${comments.id})`.as("comments_count"),
    })
    .from(posts)
    .leftJoin(comments, eq(comments.postId, posts.id))
    .groupBy(posts.id, comments.postId)
    .as("post_comments_sq");

  const postLikesSq = db
    .select({
      postId: posts.id,
      likesCount: sql<string>`count(${likes.id})`.as("likes_count"),
    })
    .from(posts)
    .leftJoin(likes, eq(likes.postId, posts.id))
    .groupBy(posts.id, likes.postId)
    .as("post_likes_sq");

  return db
    .select({
      post: posts,
      commentsCount:
        sql<string>`coalesce(${postCommentsSq.commentsCount}, "0")`.as(
          "comments_count"
        ),
      likesCount: sql<string>`coalesce(${postLikesSq.likesCount}, "0")`.as(
        "likes_count"
      ),
    })
    .from(posts)
    .leftJoin(postCommentsSq, eq(postCommentsSq.postId, posts.id))
    .leftJoin(postLikesSq, eq(postLikesSq.postId, posts.id))
    .groupBy(posts.id);
};
