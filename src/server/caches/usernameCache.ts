import { MAX_USERNAME_LIFE_IN_SECONDS } from "@/constants";
import { getSecondsDifferenceFromNow } from "../helpers/getMinuteDiff";
import { getUsernameFromClerkOrThrow } from "../helpers/clerk";

/**
 * WHY WE CACHED USERNAME?
 * - For every requests that requires username, we need to make a call to Clerk to get it
 * - Requests with paginations === Too many requests to Clerk
 * - Username mostly not changed, so we better cache it
 */

interface CachedUsername {
  username: string;
  lastFetched: Date;
}

// in-memory cache
const usernameCache = new Map<string, CachedUsername>();

export const getUsernameFromClerkOrCached = async (userId: string) => {
  const obj = usernameCache.get(userId);

  let username: string;
  if (
    !obj ||
    getSecondsDifferenceFromNow(obj.lastFetched) >=
      MAX_USERNAME_LIFE_IN_SECONDS ||
    !obj.username
  ) {
    username = await getUsernameFromClerkOrThrow(userId);
    usernameCache.set(userId, {
      username,
      lastFetched: new Date(),
    });
  } else {
    username = obj.username;
  }
  return username;
};
