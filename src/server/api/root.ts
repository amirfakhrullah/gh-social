import { createTRPCRouter } from "@/server/api/trpc";
import { githubRouter } from "./routers/github";

export const appRouter = createTRPCRouter({
  github: githubRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
