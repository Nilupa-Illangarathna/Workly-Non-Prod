import { index, pgTable, uuid } from "drizzle-orm/pg-core";
import { createdat, id, updatedat } from "../schemaHelper";
import { users } from "./users";
import { relations } from "drizzle-orm";

// Referrals Table
export const referrals = pgTable(
  "referrals",
  {
    id,
    referrerid: uuid("referrerid")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    referredid: uuid("referredid")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdat,
    updatedat,
  },
  (table) => {
    return {
      referreridIdx: index("referrals_referrerid_idx").on(table.referrerid),
      referredidIdx: index("referrals_referredid_idx").on(table.referredid),
    };
  }
);

// ✅ Define Table Relationships
export const referralRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerid],
    references: [users.id],
  }),
  referred: one(users, {
    fields: [referrals.referredid],
    references: [users.id],
  }),
}));
