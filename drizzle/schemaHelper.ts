import { timestamp, uuid } from "drizzle-orm/pg-core";

export const approve_statuses = ["pending", "approved", "rejected"] as const;
export type ApproveStatus = (typeof approve_statuses)[number];

export const id = uuid("id").defaultRandom().primaryKey();
export const createdat = timestamp({ withTimezone: true })
  .notNull()
  .defaultNow();
export const updatedat = timestamp({ withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());
export const deletedAt = timestamp("deletedat", { withTimezone: true });
