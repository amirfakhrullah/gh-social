import { paginationSchema } from "@/validationSchemas";
import { userProtectedProcedure } from "../procedures";
import { createTRPCRouter } from "../trpc";
import { notifications } from "@/server/db/schema/notifications";
import { desc, eq } from "drizzle-orm";
import { getUsernameFromClerkOrCached } from "@/server/caches/usernameCache";

export const notificationRouter = createTRPCRouter({
  getRecents: userProtectedProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const {
        db,
        auth: { userId },
      } = ctx;
      const { page, perPage } = input;
      const username = await getUsernameFromClerkOrCached(userId);

      const notificationLists = await db
        .select()
        .from(notifications)
        .where(eq(notifications.receiverId, username))
        .orderBy(desc(notifications.createdAt))
        .offset((page - 1) * perPage)
        .limit(perPage);

      return notificationLists;
    }),
});
