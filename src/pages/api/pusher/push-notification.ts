import { env } from "@/env.mjs";
import { getPusherServerSdk } from "@/lib/pusher/server";
import {
  PUSHER_NOTIFICATION_EVENT,
  getPusherNotificationsChannelId,
} from "@/lib/pusher/shared";
import { publishNotificationSchema } from "@/validationSchemas";
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
    const notificationObj = publishNotificationSchema.parse(
      JSON.parse(req.body)
    );

    const pusher = getPusherServerSdk();
    pusher.trigger(
      getPusherNotificationsChannelId(notificationObj.receiverId),
      PUSHER_NOTIFICATION_EVENT.New,
      {}
    );

    res.status(201).end();
  } catch (ex) {
    console.error(ex);
    res.status(400).end();
  }
}
