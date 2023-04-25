import { InferModel } from "drizzle-orm";
import {
  mysqlTable,
  text,
  varchar,
  timestamp,
  index,
} from "drizzle-orm/mysql-core";

export const comments = mysqlTable(
  "comments",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    ownerId: varchar("owner_id", { length: 191 }).notNull(),
    content: text("content").notNull(),
    postId: varchar("post_id", { length: 191 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    ownerIdIdx: index("owner_id_idx").on(table.ownerId),
    postIdIdx: index("post_id_idx").on(table.id),
  })
);

export type Comment = InferModel<typeof comments>