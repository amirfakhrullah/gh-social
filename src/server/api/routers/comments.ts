import { z } from "zod";
import { userProtectedProcedure } from "../procedures";
import { createTRPCRouter } from "../trpc";
import {
  createCommentSchema,
  idSchema,
  paginationSchema,
} from "@/validationSchemas";
import { comments } from "@/server/db/schema/comments";
import { and, asc, eq } from "drizzle-orm";
import { getUsernameFromClerkOrThrow } from "@/server/helpers/clerk";
import { posts } from "@/server/db/schema/posts";
import { TRPCError } from "@trpc/server";
import { v4 } from "uuid";

export const commentRouter = createTRPCRouter({
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
        .where(eq(comments.id, postId))
        .orderBy(asc(comments.createdAt))
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
      const username = await getUsernameFromClerkOrThrow(userId);

      const postReference = (
        await db
          .select({ id: posts.id })
          .from(posts)
          .where(eq(posts.id, postId))
      )[0];

      if (!postReference) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Post doesn't exist",
        });
      }

      await db.insert(comments).values({
        id: v4(),
        ownerId: username,
        content,
        postId: postReference.id,
      });
    }),

  deleteById: userProtectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        db,
        auth: { userId },
      } = ctx;
      const username = await getUsernameFromClerkOrThrow(userId);

      await db
        .delete(comments)
        .where(and(eq(comments.ownerId, username), eq(comments.id, input.id)));
    }),
});
