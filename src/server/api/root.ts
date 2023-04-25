import { createTRPCRouter } from "@/server/api/trpc";
import { githubRouter } from "./routers/github";
import { postRouter } from "./routers/post";

export const appRouter = createTRPCRouter({
  github: githubRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
