import { InferModel } from "drizzle-orm";
import {
  index,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const notifications = mysqlTable(
  "notifications",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    githubAction: mysqlEnum("github_action", ["follow", "star", "share"]),
    repoName: varchar("repo_name", { length: 256 }),
    postAction: mysqlEnum("post_action", ["comment", "like"]),
    postId: varchar("post_id", { length: 191 }),
    commentId: varchar("comment_id", { length: 191 }),
    originId: varchar("origin_id", { length: 191 }).notNull(),
    receiverId: varchar("receiver_id", { length: 191 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    receiverIdIdx: index("receiver_id_idx").on(table.receiverId),
  })
);

export type Notification = InferModel<typeof notifications>;
export type NotificationInsert = InferModel<typeof notifications, "insert">;
