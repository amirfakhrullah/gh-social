import {
  mysqlTable,
  serial,
  text,
  varchar,
  int,
  timestamp,
  index,
} from "drizzle-orm/mysql-core";

export const comments = mysqlTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    ownerId: varchar("owner_id", { length: 191 }).notNull(),
    content: text("content").notNull(),
    postId: int("post_id").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    ownerIdIdx: index("owner_id_idx").on(table.ownerId),
    postIdIdx: index("post_id_idx").on(table.id),
  })
);
