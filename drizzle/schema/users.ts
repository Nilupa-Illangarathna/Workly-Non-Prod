import {
  pgTable,
  text,
  timestamp,
  pgEnum,
  boolean,
  uuid,
  numeric,
  index,
} from "drizzle-orm/pg-core";
import { createdat, updatedat } from "../schemaHelper";
import { approve_statuses } from "../schemaHelper";

export const user_roles = [
  "student",
  "partner",
  "student_partner",
  "admin",
] as const;
export type UserRole = (typeof user_roles)[number];
export const roleEnum = pgEnum("user_role", user_roles);

export const userEnum = pgEnum("user_status", approve_statuses);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(), // New field for Auth.js
    worklyid: text("worklyid").notNull().unique(),
    firstname: text("firstname").notNull(),
    lastname: text("lastname").notNull(),
    fullname: text("fullname"),
    nicnumber: text("nicnumber").unique().notNull(),
    dateofbirth: timestamp("dateofbirth").notNull(),
    phone: text("phone").unique().notNull(),
    whatsapp: text("whatsapp").unique().notNull(),
    email: text("email").unique().notNull(),
    is_email_verified: boolean("is_email_verified").default(false),
    is_phone_verified: boolean("is_phone_verified").default(false),
    language: text("language").notNull(),
    address: text("address").notNull(),
    district: text("district").notNull(),
    postalcode: numeric("postalcode"),
    country: text("country").notNull(),
    loginid: text("loginid").unique().notNull(),
    password: text("password").notNull(),
    role: roleEnum().notNull().default("student"),
    status: userEnum().notNull().default("pending"),
    profilepic: text("profilepic"),
    createdat,
    updatedat,
    deletedat: timestamp({ withTimezone: true }),
  },
  (table) => {
    return {
      loginidIdx: index("users_loginid_idx").on(table.loginid),
      roleIdx: index("users_role_idx").on(table.role),
      statusIdx: index("users_status_idx").on(table.status),
      // deletedatIdx: index("users_deletedat_idx").on(table.deletedat), // If you frequently filter by deletedat IS NULL
    };
  }
);
