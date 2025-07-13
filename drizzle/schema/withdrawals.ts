import {
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { partners } from "./partners";
import { paymentMethods } from "./payment-methods";
import { relations } from "drizzle-orm";

export const partnerWithdrawals = pgTable(
  "partner_withdrawals",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    partner_id: uuid("partner_id")
      .references(() => partners.id)
      .notNull(),
    amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
    method_id: uuid("method_id")
      .references(() => paymentMethods.id)
      .notNull(),
    status: text("status")
      .$type<"pending" | "approved" | "rejected">()
      .default("pending")
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      partnerIdIdx: index("partner_withdrawals_partnerid_idx").on(
        table.partner_id
      ),
      methodIdIdx: index("partner_withdrawals_methodid_idx").on(
        table.method_id
      ),
      statusIdx: index("partner_withdrawals_status_idx").on(table.status),
      createdAtIdx: index("partner_withdrawals_createdat_idx").on(
        table.createdAt
      ),
    };
  }
);

export const partnerWithdrawalsRelations = relations(
  partnerWithdrawals,
  ({ one }) => ({
    paymentMethod: one(paymentMethods, {
      fields: [partnerWithdrawals.method_id],
      references: [paymentMethods.id],
    }),
  })
);
