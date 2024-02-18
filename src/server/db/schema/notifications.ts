import { InferModel } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { comments } from "./comments";

export const githubAction = pgEnum("github_action", ["follow", "star", "share"]);
export const postAction = pgEnum("post_action", ["comment", "like"]);

export const notifications = pgTable(
  "notifications",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    githubAction: githubAction("github_action"),
    repoName: varchar("repo_name", { length: 256 }),
    postAction: postAction("post_action"),
    postId: varchar("post_id", { length: 191 }),
    commentId: varchar("comment_id", { length: 191 }),
    originId: varchar("origin_id", { length: 191 }).notNull(),
    receiverId: varchar("receiver_id", { length: 191 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    postIdIdx: index("notifications_post_id_idx").on(table.postId),
    commentIdIdx: index("notifications_comment_id_idx").on(table.postId),
    receiverIdIdx: index("notifications_receiver_id_idx").on(table.receiverId),
  })
);

export type Notification = InferModel<typeof notifications>;
export type NotificationInsert = InferModel<typeof notifications, "insert">;
