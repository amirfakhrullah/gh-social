import { InferModel } from "drizzle-orm";
import { index, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const comments = pgTable(
  "comments",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    ownerId: varchar("owner_id", { length: 191 }).notNull(),
    content: text("content").notNull(),
    postId: varchar("post_id", { length: 191 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    postIdIdx: index("comments_post_id_idx").on(table.postId),
    ownerIdIdx: index("comments_owner_id_idx").on(table.ownerId),
  })
);

export type Comment = InferModel<typeof comments>;
