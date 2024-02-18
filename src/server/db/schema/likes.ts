import { InferModel } from "drizzle-orm";
import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const likes = pgTable(
  "likes",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    ownerId: varchar("owner_id", { length: 191 }).notNull(),
    postId: varchar("post_id", { length: 191 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    postIdIdx: index("likes_post_id_idx").on(table.postId),
    ownerIdIdx: index("likes_owner_id_idx").on(table.ownerId),
    uniqueIdx: uniqueIndex("likes_unique_idx").on(table.postId, table.ownerId),
  })
);

export type Like = InferModel<typeof likes>;
