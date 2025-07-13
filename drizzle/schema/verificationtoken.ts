import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { id } from "../schemaHelper";
import { users } from "./users";

export const verificationTokens = pgTable(
  "verificationtoken",
  {
    id,
    userId: uuid("userId").references(() => users.id),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => {
    return {
      compositePk: primaryKey({ columns: [table.userId, table.token] }),
      userIdIdx: index("verificationtokens_userid_idx").on(table.userId), // If queried by userId alone
      expiresIdx: index("verificationtokens_expires_idx").on(table.expires),
    };
  }
);
