import { posts } from "@/server/db/schema/posts";
import { userProtectedProcedure } from "../procedures";
import { createTRPCRouter } from "../trpc";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { comments } from "@/server/db/schema/comments";
import { likes } from "@/server/db/schema/likes";
import { v4 } from "uuid";
import { TRPCError } from "@trpc/server";
import {
  createPostSchema,
  idSchema,
  paginationSchema,
} from "@/validationSchemas";
import { getUsernameFromClerkOrCached } from "@/server/caches/usernameCache";

export const postRouter = createTRPCRouter({
  myPosts: userProtectedProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const {
        db,
        auth: { userId },
      } = ctx;
      const { page, perPage } = input;

      const username = await getUsernameFromClerkOrCached(userId);

      const myPosts = await db
        .select({
          post: posts,
          commentsCount: sql<number>`count(${comments.id})`.as(
            "comments_count"
          ),
          likesCount: sql<number>`count(${likes.id})`.as("likes_count"),
        })
        .from(posts)
        .where(eq(posts.ownerId, username))
        .leftJoin(comments, eq(comments.postId, posts.id))
        .leftJoin(likes, eq(likes.postId, posts.id))
        .groupBy(posts.id)
        .orderBy(desc(posts.createdAt))
        .limit(perPage)
        .offset((page - 1) * perPage);

      return myPosts;
    }),

  otherUserPosts: userProtectedProcedure
    .input(
      z
        .object({
          username: z.string().min(1),
        })
        .merge(paginationSchema)
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { username, page, perPage } = input;

      const myPosts = await db
        .select({
          post: posts,
          commentsCount: sql<number>`count(${comments.id})`.as(
            "comments_count"
          ),
          likesCount: sql<number>`count(${likes.id})`.as("likes_count"),
        })
        .from(posts)
        .where(eq(posts.ownerId, username))
        .leftJoin(comments, eq(comments.postId, posts.id))
        .leftJoin(likes, eq(likes.postId, posts.id))
        .groupBy(posts.id)
        .orderBy(desc(posts.createdAt))
        .limit(perPage)
        .offset((page - 1) * perPage);

      return myPosts;
    }),

  postById: userProtectedProcedure
    .input(idSchema)
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const post = (
        await db
          .select({
            post: posts,
            commentsCount: sql<number>`count(${comments.id})`.as(
              "comments_count"
            ),
            likesCount: sql<number>`count(${likes.id})`.as("likes_count"),
          })
          .from(posts)
          .where(eq(posts.id, input.id))
          .leftJoin(comments, eq(comments.postId, posts.id))
          .leftJoin(likes, eq(likes.postId, posts.id))
          .groupBy(posts.id)
      )[0];

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }
      return post;
    }),

  create: userProtectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        db,
        auth: { userId },
      } = ctx;
      const { content, repoShared } = input;
      const username = await getUsernameFromClerkOrCached(userId);

      await db.insert(posts).values({
        id: v4(),
        ownerId: username,
        content,
        repoShared,
      });
    }),

  deleteById: userProtectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        db,
        auth: { userId },
      } = ctx;
      const username = await getUsernameFromClerkOrCached(userId);

      const postNeededToBeDeleted = (
        await db
          .select({
            id: posts.id,
          })
          .from(posts)
          .where(and(eq(posts.id, input.id), eq(posts.ownerId, username)))
      )[0];

      if (!postNeededToBeDeleted) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      await db.transaction(async (tx) => {
        await tx
          .delete(likes)
          .where(eq(likes.postId, postNeededToBeDeleted.id));
        await tx
          .delete(comments)
          .where(eq(comments.postId, postNeededToBeDeleted.id));
        await tx.delete(posts).where(eq(posts.id, postNeededToBeDeleted.id));
      });
    }),
});
