import { createTRPCRouter } from "@/server/api/trpc";
import { githubRouter } from "./routers/github";
import { postRouter } from "./routers/post";
import { commentRouter } from "./routers/comments";
import { likeRouter } from "./routers/like";
import { notificationRouter } from "./routers/notifications";

export const appRouter = createTRPCRouter({
  github: githubRouter,
  post: postRouter,
  comment: commentRouter,
  like: likeRouter,
  notification: notificationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
