import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { type Context } from "./context";
import { clerkClient } from "@clerk/nextjs/server";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.auth?.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }

  return next({
    ctx: {
      ...ctx,
      auth: ctx.auth,
    },
  });
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);

export const gitHubProtectedProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const {
      auth: { userId },
    } = ctx;

    const [user, oAuthTokens] = await Promise.all([
      clerkClient.users.getUser(userId),
      clerkClient.users.getUserOauthAccessToken(userId, "oauth_github"),
    ]);

    const oAuthToken = oAuthTokens[0]?.token;
    if (!oAuthToken) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Failed to retrieve OAuth token from Clerk",
      });
    }

    return next({
      ctx: {
        ...ctx,
        oAuth: {
          user,
          token: oAuthToken,
        },
      },
    });
  }
);
