import { TRPCError } from "@trpc/server";
import { procedure } from "./trpc";
import { clerkClient } from "@clerk/nextjs/server";
import cachedTokens from "../helpers/cache";

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

    let token: string;

    /**
     * Strategy: cached OAuth Tokens for 30 seconds to avoid making too many request to Clerk
     */
    if (cachedTokens.hasToken(userId)) {
      console.log("getting from cache");
      token = cachedTokens.getToken(userId);
    } else {
      console.log("getting from clerk");
      const oAuthTokens = await clerkClient.users.getUserOauthAccessToken(
        userId,
        "oauth_github"
      );

      token = oAuthTokens[0]?.token;

      cachedTokens.setToken(userId, {
        token,
        lastFetched: new Date(),
      });
    }

    if (!token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Failed to retrieve OAuth tokens from Clerk",
      });
    }

    return next({
      ctx: {
        ...ctx,
        oAuth: {
          token,
        },
      },
    });
  }
);
