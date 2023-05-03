import { getPusherServerSdk } from "@/lib/pusher/server";
import {
  PUSHER_NOTIFICATION_EVENT,
  getPusherNotificationsChannelId,
} from "@/lib/pusher/shared";
import { getApiKey } from "@/server/helpers/apiKey";
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
  if (apiKey !== getApiKey()) {
    res.status(401).end();
  }

  try {
    const notification = publishNotificationSchema.parse(JSON.parse(req.body));

    const pusher = getPusherServerSdk();
    pusher.trigger(
      getPusherNotificationsChannelId(notification.receiverId),
      PUSHER_NOTIFICATION_EVENT.New,
      notification
    );

    res.status(201).end();
  } catch (ex) {
    console.error(ex);
    res.status(400).end();
  }
}
