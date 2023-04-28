import { InferModel } from "drizzle-orm";
import {
  index,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const chats = mysqlTable(
  "chats",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    senderId: varchar("sender_id", { length: 191 }).notNull(),
    receiverId: varchar("receiver_id", { length: 191 }).notNull(),
    text: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    receiverIdIdx: index("receiver_id_idx").on(table.receiverId),
    senderIdReceiverIdIdx: index("sender_id_receiver_id_idx").on(
      table.senderId,
      table.receiverId
    ),
    senderIdReceiverIdUniqueIdx: uniqueIndex(
      "sender_id_receiver_id_unique_idx"
    ).on(table.senderId, table.receiverId),
  })
);

export type Chat = InferModel<typeof chats>
