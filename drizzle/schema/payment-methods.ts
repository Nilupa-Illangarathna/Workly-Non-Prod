import { pgTable, uuid, text, index } from "drizzle-orm/pg-core";
import { createdat, id, updatedat } from "../schemaHelper";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const paymentMethods = pgTable(
  "payment_methods",
  {
    id,
    userid: uuid("user_id")
      .notNull()
      .references(() => users.id),
    type: text("type").notNull(), // 'bank', 'skrill', 'binance'
    email: text("email"),
    holder: text("holder"),
    bank: text("bank"),
    branch: text("branch"),
    number: text("number"),
    createdat,
    updatedat,
  },
  (table) => {
    return {
      useridIdx: index("paymentmethods_userid_idx").on(table.userid),
      typeIdx: index("paymentmethods_type_idx").on(table.type),
    };
  }
);

export const paymentMethodRelations = relations(paymentMethods, ({ one }) => ({
  user: one(users, {
    fields: [paymentMethods.userid],
    references: [users.id],
  }),
}));
