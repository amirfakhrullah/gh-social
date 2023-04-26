import { userProtectedProcedure } from "../procedures";
import { createTRPCRouter } from "../trpc";
import { likeActionSchema } from "@/validationSchemas";
import { and, eq } from "drizzle-orm";
import { posts } from "@/server/db/schema/posts";
import { TRPCError } from "@trpc/server";
import { v4 } from "uuid";
import { likes } from "@/server/db/schema/likes";
import { getUsernameFromClerkOrCached } from "@/server/caches/usernameCache";
import { z } from "zod";

export const likeRouter = createTRPCRouter({
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

      if (action === "unlike") {
        await db
          .delete(likes)
          .where(
            and(eq(likes.postId, postReference.id), eq(likes.ownerId, username))
          );
      } else {
        await db.insert(likes).values({
          id: v4(),
          postId: postReference.id,
          ownerId: username,
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
