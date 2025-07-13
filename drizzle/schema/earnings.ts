import {
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { payments } from "./payments";
import { users } from "./users";

export const partnerEarnings = pgTable(
  "partner_earnings",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    partnerId: uuid("partner_id")
      .references(() => users.id)
      .notNull(),
    studentId: uuid("student_id")
      .references(() => users.id)
      .notNull(),
    amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
    referenceId: uuid("reference_id").references(() => payments.id),
    description: text("description"),
    createdat: timestamp("createdat", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedat: timestamp("updatedat", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      partnerIdIdx: index("partner_earnings_partnerid_idx").on(table.partnerId),
      studentIdIdx: index("partner_earnings_studentid_idx").on(table.studentId),
      referenceIdIdx: index("partner_earnings_referenceid_idx").on(
        table.referenceId
      ),
      createdatIdx: index("partner_earnings_createdat_idx").on(table.createdat),
    };
  }
);
