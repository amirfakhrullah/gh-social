import { createTRPCRouter, gitHubProtectedProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { GitHubUserProfile } from "@/types/github";
import { z } from "zod";

export const githubRouter = createTRPCRouter({
  profile: gitHubProtectedProcedure.query(async ({ ctx }) => {
    const {
      auth: { userId },
      oAuth: { token },
    } = ctx;

    const user = await clerkClient.users.getUser(userId);

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
        username: z.string(),
        page: z.number(),
        perPage: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const {
        oAuth: { token },
      } = ctx;
      const { page, perPage, username } = input;

      const res = await fetch(
        `https://api.github.com/users/${username}/followers?page=${page}&per_page=${perPage}`,
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

  following: gitHubProtectedProcedure
    .input(
      z.object({
        username: z.string(),
        page: z.number(),
        perPage: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const {
        oAuth: { token },
      } = ctx;
      const { page, perPage, username } = input;

      const res = await fetch(
        `https://api.github.com/users/${username}/following?page=${page}&per_page=${perPage}`,
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

  otherProfile: gitHubProtectedProcedure
    .input(
      z.object({
        username: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const {
        oAuth: { token },
      } = ctx;
      const { username } = input;

      const ghResp = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      return (await ghResp.json()) as GitHubUserProfile;
    }),

  hasFollowedTheUser: gitHubProtectedProcedure
    .input(
      z.object({
        username: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const {
        oAuth: { token },
      } = ctx;
      const { username } = input;

      const ghResp = await fetch(
        `https://api.github.com/user/following/${username}`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      return ghResp.status === 204;
    }),

  followAction: gitHubProtectedProcedure
    .input(
      z.object({
        username: z.string().min(1),
        action: z.enum(["follow", "unfollow"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        oAuth: { token },
      } = ctx;
      const { username, action } = input;

      const res = await fetch(
        `https://api.github.com/user/following/${username}`,
        {
          method: action === "unfollow" ? "DELETE" : "PUT",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );
      const successMessage =
        action === "unfollow"
          ? "Successfully unfollowed the user"
          : "Successfully followed the user";
      return {
        success: res.status === 204,
        message:
          res.status === 204 ? successMessage : "There's an error occured",
      };
    }),
});
