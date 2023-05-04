import { createTRPCRouter } from "../trpc";
import { z } from "zod";
import {
  trimGitHubProfileData,
  trimGitHubRepoData,
} from "@/server/helpers/trimGitHubData";
import { gitHubProtectedProcedure } from "../procedures";
import githubApi from "@/server/helpers/githubApi";
import { githubRepoSchema, paginationSchema } from "@/validationSchemas";
import { postNotification } from "@/server/helpers/notifications";
import { getUsernameFromClerkOrCached } from "@/server/caches/usernameCache";
import { deleteFollowingsUsernameListsCache } from "@/server/caches/followingsCache";

export const githubRouter = createTRPCRouter({
  profile: gitHubProtectedProcedure.query(async ({ ctx }) => {
    const {
      auth: { userId },
      oAuth: { token },
    } = ctx;
    const username = await getUsernameFromClerkOrCached(userId);
    const profile = await githubApi.getUserProfile(token, username);
    if (!profile) return;
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
      if (!profile) return;
      return trimGitHubProfileData(profile);
    }),

  followers: gitHubProtectedProcedure
    .input(
      z
        .object({
          username: z.string(),
        })
        .merge(paginationSchema)
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
      return profiles.map(trimGitHubProfileData);
    }),

  following: gitHubProtectedProcedure
    .input(
      z
        .object({
          username: z.string(),
        })
        .merge(paginationSchema)
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
      return profiles.map(trimGitHubProfileData);
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
        db,
        auth: { userId },
        oAuth: { token },
      } = ctx;
      const { username, action } = input;

      const isRequestSucceed = await githubApi.followAction(
        token,
        username,
        action
      );

      // delete cache
      if (isRequestSucceed) deleteFollowingsUsernameListsCache(userId);

      // notifications
      if (action === "follow" && isRequestSucceed) {
        const originId = await getUsernameFromClerkOrCached(userId);

        await postNotification(db, {
          originId,
          receiverId: username,
          githubAction: "follow",
        });
      }

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
    .input(githubRepoSchema)
    .query(async ({ ctx, input }) => {
      const {
        oAuth: { token },
      } = ctx;
      return await githubApi.hasIStarredTheRepo(token, input.repoName);
    }),

  getARepo: gitHubProtectedProcedure
    .input(githubRepoSchema)
    .query(async ({ ctx, input }) => {
      const {
        oAuth: { token },
      } = ctx;
      const repo = await githubApi.getARepo(token, input.repoName);
      if (!repo) return;
      return trimGitHubRepoData(repo);
    }),

  myRepos: gitHubProtectedProcedure
    .input(paginationSchema)
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
      z
        .object({
          username: z.string().min(1),
        })
        .merge(paginationSchema)
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
      z
        .object({
          action: z.enum(["star", "unstar"]),
        })
        .merge(githubRepoSchema)
    )
    .mutation(async ({ ctx, input }) => {
      const {
        db,
        auth: { userId },
        oAuth: { token },
      } = ctx;
      const { repoName, action } = input;

      const isRequestSucceed = await githubApi.starAction(
        token,
        repoName,
        action
      );

      // notifications
      if (action === "star" && isRequestSucceed) {
        const receiverId = repoName.split("/")[0];
        const originId = await getUsernameFromClerkOrCached(userId);

        await postNotification(db, {
          originId,
          receiverId,
          githubAction: "star",
          repoName,
        });
      }

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
