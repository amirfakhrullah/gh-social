/**
 * WHY WE CACHED THIS?
 * - For getting feed posts, we need the all follower's username from github
 * - And github limits max = 100 followers per requests
 * - The github requests gonna be heavy if the user has a lot of followings (1 requests per 100 followers)
 */

import { MAX_FOLLOWING_USERNAME_LISTS_CACHE_LIFE_IN_SECONDS } from "@/constants";
import { getSecondsDifferenceFromNow } from "../helpers/getMinuteDiff";
import githubApi from "../helpers/githubApi";
import { getUsernameFromClerkOrCached } from "./usernameCache";

const userNameToFollowingUsernameListsCache = new Map<
  string,
  {
    followingUsernames: string[];
    lastFetched: Date;
  }
>();

export const getFollowingUsernameFromGitHubOrCached = async (
  token: string,
  userId: string
) => {
  const MAX_PER_PAGE = 100;

  const cachedObj = userNameToFollowingUsernameListsCache.get(userId);
  if (
    cachedObj &&
    getSecondsDifferenceFromNow(cachedObj.lastFetched) <
      MAX_FOLLOWING_USERNAME_LISTS_CACHE_LIFE_IN_SECONDS
  ) {
    return cachedObj.followingUsernames;
  }

  const username = await getUsernameFromClerkOrCached(userId);

  const profile = await githubApi.getUserProfile(token, username);
  if (!profile) return [];

  const followingCount = profile.following;
  const pagesNeeded = Math.ceil(followingCount / MAX_PER_PAGE);

  const followingUsernames = (
    await Promise.all(
      [...Array(pagesNeeded)].map((_, idx) =>
        githubApi.getFollowingLists(token, username, idx + 1, MAX_PER_PAGE)
      )
    )
  )
    .flat()
    .map((profile) => profile.login);

  userNameToFollowingUsernameListsCache.set(userId, {
    followingUsernames,
    lastFetched: new Date(),
  });
  return followingUsernames;
};

export const deleteFollowingsUsernameListsCache = (userId: string) =>
  userNameToFollowingUsernameListsCache.delete(userId);
