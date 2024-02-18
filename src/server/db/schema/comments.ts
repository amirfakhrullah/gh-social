import { InferModel } from "drizzle-orm";
import { index, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { posts } from "./posts";

export const comments = pgTable(
  "comments",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    ownerId: varchar("owner_id", { length: 191 }).notNull(),
    content: text("content").notNull(),
    postId: varchar("post_id", { length: 191 })
      .notNull()
      .references(() => posts.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    ownerIdIdx: index("comments_owner_id_idx").on(table.ownerId),
  })
);

export type Comment = InferModel<typeof comments>;
