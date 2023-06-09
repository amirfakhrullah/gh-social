import { InferModel } from "drizzle-orm";
import {
  index,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const likes = mysqlTable(
  "likes",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    ownerId: varchar("owner_id", { length: 191 }).notNull(),
    postId: varchar("post_id", { length: 191 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    ownerIdIdx: index("owner_id_idx").on(table.ownerId),
    postIdIdx: index("post_id_idx").on(table.id),
    ownerIdPostIdUniqueIdx: uniqueIndex("owner_id_post_id_unique_idx").on(
      table.postId,
      table.ownerId
    ),
  })
);

export type Like = InferModel<typeof likes>;
