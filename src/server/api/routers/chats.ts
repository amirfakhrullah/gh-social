import { Chat, chats } from "@/server/db/schema/chats";
import { userProtectedProcedure } from "../procedures";
import { createTRPCRouter } from "../trpc";
import { and, desc, eq, sql } from "drizzle-orm";
import { paginationSchema } from "@/validationSchemas";
import { z } from "zod";
import { getUsernameFromClerkOrCached } from "@/server/caches/usernameCache";
import { v4 } from "uuid";
import { TRPCError } from "@trpc/server";
import pusherApi from "@/server/helpers/pusher";

export const chatRouter = createTRPCRouter({
  recentChatters: userProtectedProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const {
        db,
        auth: { userId },
      } = ctx;
      const { page, perPage } = input;

      const recentChatters = await db
        .select({
          senderId: chats.senderId,
          chatsCount: sql<string>`count(${chats.id})`.as("chats_count"),
        })
        .from(chats)
        .where(and(eq(chats.receiverId, userId)))
        .groupBy(chats.senderId)
        .orderBy(desc(chats.createdAt))
        .offset((page - 1) * perPage)
        .limit(perPage);

      return recentChatters;
    }),

  getChatsWithUser: userProtectedProcedure
    .input(
      z
        .object({
          username: z.string().min(1),
        })
        .merge(paginationSchema)
    )
    .query(async ({ ctx, input }) => {
      const {
        db,
        auth: { userId },
      } = ctx;
      const { username, page, perPage } = input;
      const myUsername = await getUsernameFromClerkOrCached(userId);

      const chatLists = await db
        .select()
        .from(chats)
        .where(
          and(eq(chats.receiverId, myUsername), eq(chats.senderId, username))
        )
        .orderBy(desc(chats.createdAt))
        .offset((page - 1) * perPage)
        .limit(perPage);

      return chatLists;
    }),

  add: userProtectedProcedure
    .input(
      z.object({
        username: z.string().min(1),
        text: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        db,
        auth: { userId },
      } = ctx;
      const { username, text } = input;
      const myUsername = await getUsernameFromClerkOrCached(userId);

      const chatContent: Chat = {
        id: v4(),
        createdAt: new Date(),
        receiverId: username,
        senderId: myUsername,
        text,
      };

      await db
        .insert(chats)
        .values(chatContent)
        .catch(() => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "There's an error when trying to send the chat",
          });
        });

      await pusherApi.pushChat(chatContent);
    }),
});
