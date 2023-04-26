import { MAX_TOKEN_LIFE_IN_SECONDS } from "@/constants";
import { getSecondsDifferenceFromNow } from "./getMinuteDiff";

interface CachedToken {
  token: string;
  lastFetched: Date;
}
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
