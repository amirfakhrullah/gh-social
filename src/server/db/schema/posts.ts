import type { InferModel } from "drizzle-orm";
import { index, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const posts = pgTable(
  "posts",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    ownerId: varchar("owner_id", { length: 191 }).notNull(),
    content: text("content").notNull(),
    repoShared: varchar("repo_shared", { length: 256 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    ownerIdIdx: index("posts_owner_id_idx").on(table.ownerId),
    repoSharedIdx: index("posts_repo_shared_idx").on(table.repoShared),
  })
);

export type Post = InferModel<typeof posts>;
