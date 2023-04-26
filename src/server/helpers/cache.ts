import {
  MAX_TOKEN_LIFE_IN_SECONDS,
  getSecondsDifferenceFromNow,
} from "./getMinuteDiff";

interface CachedToken {
  token: string;
  lastFetched: Date;
}
const oAuthCache = new Map<string, CachedToken>();

const hasToken = (userId: string) => {
  const obj = oAuthCache.get(userId);
  if (!obj) return false;

  if (
    getSecondsDifferenceFromNow(obj.lastFetched) >= MAX_TOKEN_LIFE_IN_SECONDS ||
    !obj.token
  ) {
    oAuthCache.delete(userId);
    return false;
  }
  return !!obj.token;
};

/**
 * Make sure to pre-check with `.hasToken()` before using this
 */
const getToken = (userId: string) => {
  const obj = oAuthCache.get(userId);
  return obj?.token ?? "";
};

const setToken = (userId: string, obj: CachedToken) =>
  oAuthCache.set(userId, obj);

const cachedTokens = {
  hasToken,
  getToken,
  setToken,
};

export default cachedTokens;
