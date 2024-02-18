import { userProtectedProcedure } from "../procedures";
import { createTRPCRouter } from "../trpc";
import { likeActionSchema, paginationSchema } from "@/validationSchemas";
import { and, desc, eq, inArray } from "drizzle-orm";
import { Post, posts } from "@/server/db/schema/posts";
import { TRPCError } from "@trpc/server";
import { v4 } from "uuid";
import { likes } from "@/server/db/schema/likes";
import { getUsernameFromClerkOrCached } from "@/server/caches/usernameCache";
import { z } from "zod";
import { getPostsWithCommentsCountAndLikesCountQuery } from "@/server/helpers/drizzleQueries";
import { postNotification } from "@/server/helpers/notifications";

export const likeRouter = createTRPCRouter({
  myLikedPosts: userProtectedProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const {
        db,
        auth: { userId },
      } = ctx;
      const { page, perPage } = input;

      const username = await getUsernameFromClerkOrCached(userId);

      const likedPosts = await db
        .select({
          id: posts.id,
        })
        .from(likes)
        .where(eq(likes.ownerId, username))
        .innerJoin(posts, eq(posts.id, likes.postId))
        .orderBy(desc(likes.createdAt))
        .limit(perPage)
        .offset((page - 1) * perPage);

      if (likedPosts.length === 0) return [];

      const likedPostsWithCommentsAndLikes =
        await getPostsWithCommentsCountAndLikesCountQuery(db).where(
          inArray(
            posts.id,
            likedPosts.map((post) => post.id)
          )
        );

      const mapping = new Map<
        string,
        {
          post: Post;
          commentsCount: number;
          likesCount: number;
        }
      >();
      for (const data of likedPostsWithCommentsAndLikes) {
        mapping.set(data.post.id, data);
      }

      return likedPosts.map(({ id }) => mapping.get(id)!);
    }),

  otherUserLikedPost: userProtectedProcedure
    .input(
      z
        .object({
          username: z.string().min(1),
        })
        .merge(paginationSchema)
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { page, perPage, username } = input;

      const likedPosts = await db
        .select({
          id: posts.id,
        })
        .from(likes)
        .where(eq(likes.ownerId, username))
        .innerJoin(posts, eq(posts.id, likes.postId))
        .orderBy(desc(likes.createdAt))
        .limit(perPage)
        .offset((page - 1) * perPage);

      if (likedPosts.length === 0) return [];

      const likedPostsWithCommentsAndLikes =
        await getPostsWithCommentsCountAndLikesCountQuery(db).where(
          inArray(
            posts.id,
            likedPosts.map((post) => post.id)
          )
        );

      return likedPostsWithCommentsAndLikes;
    }),

  likeActionByPostId: userProtectedProcedure
    .input(likeActionSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        db,
        auth: { userId },
      } = ctx;
      const { action, postId } = input;
      const username = await getUsernameFromClerkOrCached(userId);

      const postReference = (
        await db
          .select({ id: posts.id, ownerId: posts.ownerId })
          .from(posts)
          .where(eq(posts.id, postId))
      )[0];

      if (!postReference) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Post doesn't exist",
        });
      }

      if (action === "unlike") {
        await db
          .delete(likes)
          .where(
            and(eq(likes.postId, postReference.id), eq(likes.ownerId, username))
          )
          .catch((err) => {
            console.error(err);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message:
                "There's an error occured when trying to unlike the post.",
            });
          });
      } else {
        await db
          .insert(likes)
          .values({
            id: v4(),
            postId: postReference.id,
            ownerId: username,
          })
          .catch((err) => {
            console.error(err);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "There's an error occured when trying to like the post.",
            });
          });
        // notifications for liking posts
        await postNotification(db, {
          originId: username,
          receiverId: postReference.ownerId,
          postAction: "like",
          postId: postReference.id,
        });
      }
    }),

  hasLikedThePost: userProtectedProcedure
    .input(
      z.object({
        postId: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const {
        db,
        auth: { userId },
      } = ctx;
      const username = await getUsernameFromClerkOrCached(userId);

      const likeFound = (
        await db
          .select({ id: likes.id })
          .from(likes)
          .where(
            and(eq(likes.postId, input.postId), eq(likes.ownerId, username))
          )
      )[0];

      return !!likeFound;
    }),
});
