import { posts } from "@/server/db/schema/posts";
import { userProtectedProcedure } from "../procedures";
import { createTRPCRouter } from "../trpc";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { comments } from "@/server/db/schema/comments";
import { likes } from "@/server/db/schema/likes";
import { v4 } from "uuid";

export const postRouter = createTRPCRouter({
  myPosts: userProtectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const {
        db,
        auth: { userId },
      } = ctx;
      const { page, perPage } = input;

      const myPosts = await db
        .select({
          post: posts,
          commentsCount: sql<number>`count(${comments.id})`.as(
            "comments_count"
          ),
          likesCount: sql<number>`count(${likes.id})`.as("likes_count"),
        })
        .from(posts)
        .where(eq(posts.ownerId, userId))
        .leftJoin(comments, eq(comments.postId, posts.id))
        .leftJoin(likes, eq(likes.postId, posts.id))
        .groupBy(posts.id)
        .orderBy(desc(posts.createdAt))
        .limit(perPage)
        .offset((page - 1) * perPage);

      return myPosts;
    }),
});
