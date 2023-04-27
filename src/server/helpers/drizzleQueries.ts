import { SQL, eq, sql } from "drizzle-orm";
import { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";
import { posts } from "../db/schema/posts";
import { comments } from "../db/schema/comments";
import { likes } from "../db/schema/likes";

export const getPostsWithCommentsCountAndLikesCountQuery = (
  db: PlanetScaleDatabase
) => {
  const postCommentsSq = db
    .select({
      postId: posts.id,
      commentsCount: sql<string>`count(${comments.id})`.as("comments_count"),
    })
    .from(posts)
    .leftJoin(comments, eq(comments.postId, posts.id))
    .groupBy(posts.id)
    .as("post_comments_sq");

  const postLikesSq = db
    .select({
      postId: posts.id,
      likesCount: sql<string>`count(${likes.id})`.as("likes_count"),
    })
    .from(posts)
    .leftJoin(likes, eq(likes.postId, posts.id))
    .groupBy(posts.id)
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
