import { MAX_TOKEN_LIFE_IN_SECONDS } from "@/constants";
import { getSecondsDifferenceFromNow } from "../helpers/getMinuteDiff";

/**
 * WHY WE CACHED THIS?
 * - For every requests that requires GitHub OAuth Access Token, we need to make a call to Clerk to get it
 * - There's some pages that making multiple parallel calls (that requires OAuth Access Token) to the server 
 * - Caching it can minimise the requests to Clerk
 * - We keep the cached tokens short lived (30 seconds)
 */

interface CachedToken {
  token: string;
  lastFetched: Date;
}

// in-memory cache
const oAuthCache = new Map<string, CachedToken>();

const getToken = (userId: string) => {
  const obj = oAuthCache.get(userId);
  if (!obj) return;

  if (
    getSecondsDifferenceFromNow(obj.lastFetched) >= MAX_TOKEN_LIFE_IN_SECONDS ||
    !obj.token
  ) {
    oAuthCache.delete(userId);
    return;
  }
  return obj.token;
};

const setToken = (userId: string, obj: CachedToken) =>
  oAuthCache.set(userId, obj);

const cachedTokens = {
  getToken,
  setToken,
};

export default cachedTokens;
