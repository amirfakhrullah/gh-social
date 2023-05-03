import { v4 } from "uuid";

let apiKey: string;

export const getApiKey = () => {
  if (!apiKey) {
    apiKey = v4();
  }
  return apiKey;
};
