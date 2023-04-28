import { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";
import {
  Notification,
  NotificationInsert,
  notifications,
} from "../db/schema/notifications";
import { v4 } from "uuid";
import { env } from "@/env.mjs";

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
    commentId = null,
  } = inputs;

  /**
   * - githubAction requires repoName (except "follow")
   * - postAction requires postId (except "comment", it required commentId)
   * - if the originId and receiverId is the same, do not send notification
   */
  if (
    (githubAction && githubAction !== "follow" && !repoName) ||
    (postAction && !postId) ||
    (postAction && postAction === "comment" && !commentId) ||
    // for easier test in development
    (env.NODE_ENV === "production" && receiverId === originId)
  )
    return;

  const newNotification: Notification = {
    id: v4(),
    githubAction,
    repoName,
    postAction,
    postId,
    commentId,
    createdAt: new Date(),
    originId,
    receiverId,
  };
  await db.insert(notifications).values(newNotification);

  /**
   * TODO: pusher with `newNotification` data
   */
};
