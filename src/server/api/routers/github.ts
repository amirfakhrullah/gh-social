import { createTRPCRouter } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { TrimmedGitHubRepo } from "@/types/github";
import { z } from "zod";
import {
  trimGitHubProfileData,
  trimGitHubRepoData,
} from "@/server/helpers/trimGitHubData";
import { gitHubProtectedProcedure } from "../procedures";
import githubApi from "@/server/helpers/githubApi";
import { TRPCError } from "@trpc/server";

export const githubRouter = createTRPCRouter({
  profile: gitHubProtectedProcedure.query(async ({ ctx }) => {
    const {
      auth: { userId },
      oAuth: { token },
    } = ctx;

    const user = await clerkClient.users.getUser(userId);

    if (!user.username) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Username not found in Clerk",
      });
    }

    const profile = await githubApi.getUserProfile(token, user.username);
    return trimGitHubProfileData(profile);
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

      const profile = await githubApi.getUserProfile(token, username);
      return trimGitHubProfileData(profile);
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

      const profiles = await githubApi.getFollowerLists(
        token,
        username,
        page,
        perPage
      );
      return profiles.map((profile) => trimGitHubProfileData(profile));
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

      const profiles = await githubApi.getFollowingLists(
        token,
        username,
        page,
        perPage
      );
      return profiles.map((profile) => trimGitHubProfileData(profile));
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
      return await githubApi.amIFollowingTheUser(token, username);
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

      const isRequestSucceed = await githubApi.followAction(
        token,
        username,
        action
      );

      const successMessage =
        action === "unfollow"
          ? "Successfully unfollowed the user"
          : "Successfully followed the user";
      return {
        success: isRequestSucceed,
        message: isRequestSucceed ? successMessage : "There's an error occured",
      };
    }),

  hasStarredTheRepo: gitHubProtectedProcedure
    .input(
      z.object({
        owner: z.string().min(1),
        repoName: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const {
        oAuth: { token },
      } = ctx;
      const { owner, repoName } = input;
      return await githubApi.hasIStarredTheRepo(token, owner, repoName);
    }),

  myRepos: gitHubProtectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const {
        oAuth: { token },
      } = ctx;
      const { page, perPage } = input;
      const repos = await githubApi.myRepoLists(token, page, perPage);
      return repos.map(trimGitHubRepoData);
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
      const repos = await githubApi.otherUserRepoLists(
        token,
        username,
        page,
        perPage
      );
      return repos.map(trimGitHubRepoData);
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

      const isRequestSucceed = await githubApi.starAction(
        token,
        owner,
        repoName,
        action
      );
      const successMessage =
        action === "unstar"
          ? "Successfully unstarred the repository"
          : "Successfully starred the repository";
      return {
        success: isRequestSucceed,
        message: isRequestSucceed ? successMessage : "There's an error occured",
      };
    }),
});
