import type { InferModel } from "drizzle-orm";
import { timestamp } from "drizzle-orm/mysql-core";
import { index } from "drizzle-orm/mysql-core";
import { text } from "drizzle-orm/mysql-core";
import { varchar } from "drizzle-orm/mysql-core";
import { mysqlTable,   } from "drizzle-orm/mysql-core";

export const posts = mysqlTable(
  "posts",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    ownerId: varchar("owner_id", { length: 191 }).notNull(),
    content: text("content").notNull(),
    repoShared: varchar("repo_shared", { length: 256 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    ownerIdIdx: index("owner_id_idx").on(table.ownerId),
  })
);

export type Post = InferModel<typeof posts>;
