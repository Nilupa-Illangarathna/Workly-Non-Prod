import {
  pgTable,
  timestamp,
  numeric,
  integer,
  pgEnum,
  uuid,
  text,
  index,
} from "drizzle-orm/pg-core";
import { createdat, id, updatedat } from "../schemaHelper";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { approve_statuses } from "../schemaHelper";

export const partnerEnum = pgEnum("partner_status", approve_statuses);

// ✅ Partners Table
export const partners = pgTable(
  "partners",
  {
    id,
    userid: uuid("userid").references(() => users.id, {
      onDelete: "cascade",
    }),
    status: partnerEnum().notNull().default("pending"), // pending, approved, rejected
    level: integer("level").notNull().default(1), // 1 = Sub-Company, 2 = Sub 1, etc.
    companyname: text("companyname"),
    commissionrate: numeric("commissionrate", { precision: 6, scale: 2 })
      .notNull()
      .default("0"),
    amount: numeric("amount", { precision: 10, scale: 2 }).default("0"),
    createdat,
    updatedat,
    deletedat: timestamp({ withTimezone: true }),
  },
  (table) => {
    return {
      useridIdx: index("partners_userid_idx").on(table.userid),
      statusIdx: index("partners_status_idx").on(table.status),
      levelIdx: index("partners_level_idx").on(table.level),
    };
  }
);

export const partnerRelations = relations(partners, ({ one }) => ({
  user: one(users, {
    fields: [partners.userid],
    references: [users.id],
  }),
}));
