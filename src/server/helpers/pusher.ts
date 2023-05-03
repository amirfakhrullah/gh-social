import { env } from "@/env.mjs";
import { Chat } from "../db/schema/chats";
import { Notification } from "../db/schema/notifications";
import { getApiKey } from "./apiKey";

const baseUrl = (() => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
})();

const pushNotification = async (notification: Notification) => {
  await fetch(baseUrl + "/api/pusher/push-notification", {
    method: "POST",
    body: JSON.stringify(notification),
    headers: {
      "x-api-key": getApiKey(),
    },
  });
};

const pushChat = async (chat: Chat) => {
  await fetch(baseUrl + "/api/pusher/push-chat", {
    method: "POST",
    body: JSON.stringify(chat),
    headers: {
      "x-api-key": getApiKey(),
    },
  });
};

const pusherApi = {
  pushNotification,
  pushChat,
};

export default pusherApi;
