import { env } from "@/env.mjs";
import { Chat } from "../db/schema/chats";
import { Notification } from "../db/schema/notifications";

const baseUrl = (() => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
})();

const pushNotification = async (receiverId: string) => {
  await fetch(baseUrl + "/api/pusher/push-notification", {
    method: "POST",
    body: JSON.stringify({ receiverId }),
    headers: {
      "x-api-key": env.PUSHER_API_KEY,
    },
  });
};

const pushChat = async (chat: Chat) => {
  await fetch(baseUrl + "/api/pusher/push-chat", {
    method: "POST",
    body: JSON.stringify(chat),
    headers: {
      "x-api-key": env.PUSHER_API_KEY,
    },
  });
};

const pusherApi = {
  pushNotification,
  pushChat,
};

export default pusherApi;
