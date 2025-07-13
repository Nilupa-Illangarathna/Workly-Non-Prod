import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

// Add audit logging table
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  action: text("action").notNull(),
  entityId: uuid("entity_id"),
  entityType: text("entity_type"),
  timestamp: timestamp("timestamp").defaultNow(),
});
