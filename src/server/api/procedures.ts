import { TRPCError } from "@trpc/server";
import { procedure } from "./trpc";
import { clerkClient } from "@clerk/nextjs/server";

/**
 * Public
 */
export const publicProcedure = procedure;

/**
 * For logged-in user
 */
export const userProtectedProcedure = publicProcedure.use(
  async ({ ctx, next }) => {
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
  }
);

/**
 * For logged-in user with GitHub OAuth Access Token
 */
export const gitHubProtectedProcedure = userProtectedProcedure.use(
  async ({ ctx, next }) => {
    const {
      auth: { userId },
    } = ctx;

    const oAuthTokens = await clerkClient.users.getUserOauthAccessToken(
      userId,
      "oauth_github"
    );

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
          token: oAuthToken,
        },
      },
    });
  }
);
