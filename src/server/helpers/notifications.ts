import { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";
import {
  Notification,
  NotificationInsert,
  notifications,
} from "../db/schema/notifications";
import { v4 } from "uuid";

export const postNotification = async (
  db: PlanetScaleDatabase,
  inputs: Omit<NotificationInsert, "id">
) => {
  const {
    originId,
    receiverId,
    githubAction = null,
    repoName = null,
    postAction = null,
    postId = null,
  } = inputs;

  /**
   * githubAction requires repoName
   * postAction requires postId
   */
  if (
    (githubAction && githubAction !== "follow" && !repoName) ||
    (postAction && !postId)
  )
    return;

  const newNotification: Notification = {
    id: v4(),
    githubAction,
    repoName,
    postAction,
    postId,
    createdAt: new Date(),
    originId,
    receiverId,
  };
  await db.insert(notifications).values(newNotification);

  /**
   * TODO: pusher with `newNotification` data
   */
};
