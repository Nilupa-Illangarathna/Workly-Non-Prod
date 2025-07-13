import {
  pgTable,
  text,
  numeric,
  pgEnum,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { createdat, id, updatedat } from "../schemaHelper";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { approve_statuses } from "../schemaHelper";

export const paymentEnum = pgEnum("payment_status", approve_statuses);

export const payment_types = ["direct", "bank", "online"] as const;
export type ApproveStatus = (typeof payment_types)[number];
export const paymentType = pgEnum("payment_type", payment_types);

// ✅ Payments Table (Tracks User Payments)
export const payments = pgTable(
  "payments",
  {
    id,
    userid: uuid("userid").references(() => users.id),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    totalamount: numeric("totalamount", { precision: 8, scale: 2 }).default(
      "0"
    ),
    type: paymentType().notNull(),
    image: text("image"), // Stores URL of payment slip
    status: paymentEnum().notNull().default("pending"),
    createdat,
    updatedat,
  },
  (table) => {
    return {
      useridIdx: index("payments_userid_idx").on(table.userid),
      statusIdx: index("payments_status_idx").on(table.status),
      typeIdx: index("payments_type_idx").on(table.type),
      useridStatusIdx: index("payments_userid_status_idx").on(
        table.userid,
        table.status
      ),
      useridCreatedatIdx: index("payments_userid_createdat_idx").on(
        table.userid,
        table.createdat
      ),
    };
  }
);

export const paymentRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userid],
    references: [users.id],
  }),
}));
