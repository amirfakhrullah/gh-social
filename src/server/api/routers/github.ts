import { createTRPCRouter, gitHubProtectedProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { GitHubUserProfile } from "@/types/github";
import { z } from "zod";

export const githubRouter = createTRPCRouter({
  profile: gitHubProtectedProcedure.query(async ({ ctx }) => {
    const {
      oAuth: { token, user },
    } = ctx;

    const ghResp = await fetch(
      `https://api.github.com/users/${user.username}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    return (await ghResp.json()) as GitHubUserProfile;
  }),

  followers: gitHubProtectedProcedure
    .input(
      z.object({
        page: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const {
        oAuth: { token, user },
      } = ctx;
      const { page } = input;

      const res = await fetch(
        `https://api.github.com/users/${user.username}/followers`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      return (await res.json()) as GitHubUserProfile[];
    }),
});
