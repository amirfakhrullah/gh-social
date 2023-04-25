import {
  index,
  int,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { posts } from "./posts";

export const likes = mysqlTable(
  "likes",
  {
    id: serial("id").primaryKey(),
    ownerId: varchar("owner_id", { length: 191 }).notNull(),
    postId: int("post_id").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    ownerIdIdx: index("owner_id_idx").on(table.ownerId),
    postIdIdx: index("post_id_idx").on(table.id),
  })
);
