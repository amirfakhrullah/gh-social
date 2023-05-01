import { env } from "@/env.mjs";
import { Chat } from "../db/schema/chats";
import { Notification } from "../db/schema/notifications";

const pushNotification = async (notification: Notification) => {
  await fetch("/api/pusher/push-notification", {
    method: "POST",
    body: JSON.stringify(notification),
    headers: {
      "x-api-key": env.PUSHER_API_KEY,
    },
  });
};

const pushChat = async (chat: Chat) => {
  await fetch("/api/pusher/push-chat", {
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
