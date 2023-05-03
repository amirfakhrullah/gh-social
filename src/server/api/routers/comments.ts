import { z } from "zod";
import { userProtectedProcedure } from "../procedures";
import { createTRPCRouter } from "../trpc";
import {
  createCommentSchema,
  idSchema,
  paginationSchema,
} from "@/validationSchemas";
import { comments } from "@/server/db/schema/comments";
import { and, desc, eq } from "drizzle-orm";
import { posts } from "@/server/db/schema/posts";
import { TRPCError } from "@trpc/server";
import { v4 } from "uuid";
import { getUsernameFromClerkOrCached } from "@/server/caches/usernameCache";
import { postNotification } from "@/server/helpers/notifications";

export const commentRouter = createTRPCRouter({
  commentById: userProtectedProcedure
    .input(idSchema)
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const foundComment = (
        await db.select().from(comments).where(eq(comments.id, input.id))
      )[0];

      if (!foundComment) return;
      return foundComment;
    }),

  commentsByPostId: userProtectedProcedure
    .input(
      z
        .object({
          postId: z.string().min(1),
        })
        .merge(paginationSchema)
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { postId, page, perPage } = input;

      const commentLists = await db
        .select()
        .from(comments)
        .where(eq(comments.postId, postId))
        .orderBy(desc(comments.createdAt))
        .limit(perPage)
        .offset((page - 1) * perPage);

      return commentLists;
    }),

  myComments: userProtectedProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const {
        db,
        auth: { userId },
      } = ctx;
      const { page, perPage } = input;
      const username = await getUsernameFromClerkOrCached(userId);

      const commentLists = await db
        .select()
        .from(comments)
        .where(eq(comments.ownerId, username))
        .orderBy(desc(comments.createdAt))
        .limit(perPage)
        .offset((page - 1) * perPage);

      return commentLists;
    }),

  otherUserComments: userProtectedProcedure
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

      const commentLists = await db
        .select()
        .from(comments)
        .where(eq(comments.ownerId, username))
        .orderBy(desc(comments.createdAt))
        .limit(perPage)
        .offset((page - 1) * perPage);

      return commentLists;
    }),

  create: userProtectedProcedure
    .input(createCommentSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        db,
        auth: { userId },
      } = ctx;
      const { content, postId } = input;
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

      const commentId = v4();
      await db
        .insert(comments)
        .values({
          id: commentId,
          ownerId: username,
          content,
          postId: postReference.id,
        })
        .catch((err) => {
          console.error(err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "There's an error occured when trying to create the comment.",
          });
        });

      // notifications adding comments
      await postNotification(db, {
        originId: username,
        receiverId: postReference.ownerId,
        postAction: "comment",
        postId: postReference.id,
        commentId: commentId,
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

      await db
        .delete(comments)
        .where(and(eq(comments.ownerId, username), eq(comments.id, input.id)))
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
