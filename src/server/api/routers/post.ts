import { posts } from "@/server/db/schema/posts";
import {
  gitHubProtectedProcedure,
  userProtectedProcedure,
} from "../procedures";
import { createTRPCRouter } from "../trpc";
import { and, desc, eq, like, inArray, sql } from "drizzle-orm";
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
import { getPostsWithCommentsCountAndLikesCountQuery } from "@/server/helpers/drizzleQueries";
import { postNotification } from "@/server/helpers/notifications";
import { getFollowingUsernameFromGitHubOrCached } from "@/server/caches/followingsCache";

export const postRouter = createTRPCRouter({
  hotFeedPosts: userProtectedProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { page, perPage } = input;

      const topPosts = await getPostsWithCommentsCountAndLikesCountQuery(db)
        .orderBy(desc(sql<string>`count(${likes.id})`.as("likes_count")))
        .offset((page - 1) * perPage)
        .limit(perPage);

      return topPosts;
    }),

  latestFeedPosts: userProtectedProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { page, perPage } = input;

      const latestPosts = await getPostsWithCommentsCountAndLikesCountQuery(db)
        .orderBy(desc(posts.createdAt))
        .offset((page - 1) * perPage)
        .limit(perPage);

      return latestPosts;
    }),

  followingFeedPosts: gitHubProtectedProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const {
        db,
        auth: { userId },
        oAuth: { token },
      } = ctx;
      const { page, perPage } = input;
      const followingUsernames = await getFollowingUsernameFromGitHubOrCached(
        token,
        userId
      );

      if (!followingUsernames) return [];

      const latestPosts = await getPostsWithCommentsCountAndLikesCountQuery(db)
        .where(inArray(posts.ownerId, followingUsernames))
        .orderBy(desc(posts.createdAt))
        .offset((page - 1) * perPage)
        .limit(perPage);

      return latestPosts;
    }),

  searchPosts: userProtectedProcedure
    .input(
      z
        .object({
          query: z.string().min(1).max(50),
        })
        .merge(paginationSchema)
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { query, page, perPage } = input;
      const keys = query.trim().split(" ");

      const results = await getPostsWithCommentsCountAndLikesCountQuery(db)
        .where(and(...keys.map((key) => like(posts.content, `%${key}%`))))
        .offset((page - 1) * perPage)
        .limit(perPage);

      return results;
    }),

  myPosts: userProtectedProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const {
        db,
        auth: { userId },
      } = ctx;
      const { page, perPage } = input;

      const username = await getUsernameFromClerkOrCached(userId);

      const myPosts = await getPostsWithCommentsCountAndLikesCountQuery(db)
        .where(eq(posts.ownerId, username))
        .orderBy(desc(posts.createdAt))
        .offset((page - 1) * perPage)
        .limit(perPage);

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

      const postLists = await getPostsWithCommentsCountAndLikesCountQuery(db)
        .where(eq(posts.ownerId, username))
        .orderBy(desc(posts.createdAt))
        .offset((page - 1) * perPage)
        .limit(perPage);

      return postLists;
    }),

  postById: userProtectedProcedure
    .input(idSchema)
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const post = (
        await getPostsWithCommentsCountAndLikesCountQuery(db).where(
          eq(posts.id, input.id)
        )
      )[0];

      if (!post) return;
      return post;
    }),

  repoSharedPosts: userProtectedProcedure
    .input(
      z
        .object({
          repoName: z.string(),
        })
        .merge(paginationSchema)
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { repoName, perPage, page } = input;

      const postLists = await getPostsWithCommentsCountAndLikesCountQuery(db)
        .where(eq(posts.repoShared, repoName))
        .orderBy(desc(posts.createdAt))
        .offset((page - 1) * perPage)
        .limit(perPage);

      return postLists;
    }),

  repoSharedCounts: userProtectedProcedure
    .input(
      z.object({
        repoName: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const postsWithRepoShared = await db
        .select({ id: posts.id })
        .from(posts)
        .where(eq(posts.repoShared, input.repoName));

      return postsWithRepoShared.length;
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

      const id = v4();

      await db
        .insert(posts)
        .values({
          id,
          ownerId: username,
          content,
          repoShared,
        })
        .catch((err) => {
          console.error(err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "There's an error occured when trying to create the post.",
          });
        });

      // notifications
      if (repoShared) {
        const receiverId = repoShared.split("/")[0];
        await postNotification(db, {
          originId: username,
          receiverId,
          githubAction: "share",
          repoName: repoShared,
          postId: id,
        });
      }
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

      await db
        .transaction(async (tx) => {
          await tx
            .delete(likes)
            .where(eq(likes.postId, postNeededToBeDeleted.id));
          await tx
            .delete(comments)
            .where(eq(comments.postId, postNeededToBeDeleted.id));
          await tx.delete(posts).where(eq(posts.id, postNeededToBeDeleted.id));
        })
        .catch((err) => {
          console.error(err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "There's an error occured when trying to delete the comment.",
          });
        });
    }),
});
