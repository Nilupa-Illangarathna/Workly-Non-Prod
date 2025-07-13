import { pgTable, text, pgEnum, uuid, index } from "drizzle-orm/pg-core";
import { createdat, id, updatedat } from "../schemaHelper";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { approve_statuses } from "../schemaHelper";

export const kycEnum = pgEnum("kyc_status", approve_statuses);

// ✅ KYC Table (Identity Verification)
export const kyc = pgTable(
  "kyc",
  {
    id,
    userid: uuid("userid").references(() => users.id), // Foreign key to users table
    type: text("type").notNull(), // Type of KYC document (e.g., ID, Passport)
    idfront: text("idfront").notNull(), // Stores URL of front side of ID
    idback: text("idback"), // Stores URL of back side of ID
    status: kycEnum().notNull().default("pending"),
    createdat,
    updatedat,
  },
  (table) => {
    return {
      useridIdx: index("kyc_userid_idx").on(table.userid),
      statusIdx: index("kyc_status_idx").on(table.status),
      useridStatusIdx: index("kyc_userid_status_idx").on(
        table.userid,
        table.status
      ),
    };
  }
);

export const kycRelations = relations(kyc, ({ one }) => ({
  user: one(users, {
    fields: [kyc.userid],
    references: [users.id],
  }),
}));
