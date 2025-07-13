import { timestamp, pgTable, text, uuid, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const sessions = pgTable(
  "session",
  {
    sessionToken: text("sessionToken").primaryKey(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id), // Reference new id
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("sessions_userid_idx").on(table.userId),
      expiresIdx: index("sessions_expires_idx").on(table.expires),
    };
  }
);

export const sessionUserRelations = relations(users, ({ one }) => ({
  user: one(users, {
    fields: [users.worklyid],
    references: [users.worklyid],
  }),
}));
