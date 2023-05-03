import { env } from "@/env.mjs";
import { getPusherServerSdk } from "@/lib/pusher/server";
import {
  PUSHER_CHAT_EVENT,
  getPusherChatsChannelId,
} from "@/lib/pusher/shared";
import { publishChatSchema } from "@/validationSchemas";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(400).end();
  }
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== env.PUSHER_API_KEY) {
    res.status(401).end();
  }

  try {
    const chat = publishChatSchema.parse(req.body);

    const pusher = getPusherServerSdk();
    pusher.trigger(
      getPusherChatsChannelId(chat.receiverId),
      PUSHER_CHAT_EVENT.Add,
      chat
    );

    res.status(201).end();
  } catch (ex) {
    console.error(ex);
    res.status(400).end();
  }
}
