import { createTRPCRouter, gitHubProtectedProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import {
  GitHubRepo,
  GitHubRepoWithUserLike,
  GitHubUserProfile,
} from "@/types/github";
import { z } from "zod";

export const githubRouter = createTRPCRouter({
  profile: gitHubProtectedProcedure.query(async ({ ctx }) => {
    const {
      auth: { userId },
      oAuth: { token },
    } = ctx;

    const user = await clerkClient.users.getUser(userId);

    const res = await fetch(`https://api.github.com/users/${user.username}`, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    return (await res.json()) as GitHubUserProfile;
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

      const res = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      return (await res.json()) as GitHubUserProfile;
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

  myRepos: gitHubProtectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
        visibility: z.enum(["all", "public", "private"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const {
        oAuth: { token },
      } = ctx;
      const { page, perPage, visibility } = input;

      const res = await fetch(
        `https://api.github.com/user/repos?page=${page}&per_page=${perPage}&visibility=${visibility ?? "all"}&sort=pushed`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      const repos = (await res.json()) as GitHubRepo[];

      let response: GitHubRepoWithUserLike[] = [];
      for (const repo of repos) {
        const res = await fetch(
          `https://api.github.com/user/starred/${repo.owner.login}/${repo.name}`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: `Bearer ${token}`,
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        response.push({
          ...repo,
          isLiked: res.status === 204,
        });
      }
      return response;
    }),

  otherUserRepos: gitHubProtectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
        username: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const {
        oAuth: { token },
      } = ctx;
      const { page, perPage, username } = input;

      const res = await fetch(
        `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}&sort=pushed`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      const repos = (await res.json()) as GitHubRepo[];

      let response: GitHubRepoWithUserLike[] = [];
      for (const repo of repos) {
        const res = await fetch(
          `https://api.github.com/user/starred/${repo.owner.login}/${repo.name}`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: `Bearer ${token}`,
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        response.push({
          ...repo,
          isLiked: res.status === 204,
        });
      }
      return response;
    }),

  starAction: gitHubProtectedProcedure
    .input(
      z.object({
        repoName: z.string().min(1),
        owner: z.string().min(1),
        action: z.enum(["star", "unstar"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        oAuth: { token },
      } = ctx;
      const { repoName, owner, action } = input;

      const res = await fetch(
        `https://api.github.com/user/starred/${owner}/${repoName}`,
        {
          method: action === "unstar" ? "DELETE" : "PUT",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );
      const successMessage =
        action === "unstar"
          ? "Successfully unstarred the repository"
          : "Successfully starred the repository";
      return {
        success: res.status === 204,
        message:
          res.status === 204 ? successMessage : "There's an error occured",
      };
    }),
});
