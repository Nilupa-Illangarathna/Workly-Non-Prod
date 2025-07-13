import { pgTable, text, numeric, pgEnum, index } from "drizzle-orm/pg-core";
import { id } from "../schemaHelper";

// export const commission_distributions = pgTable("commission_distributions", {
//   id,
//   development: numeric(),
//   expenses: numeric(),
//   total_commission: numeric(),
//   top_managers: numeric(),
//   sub_company: numeric(),
//   course_payment: numeric(),
//   createdat,
// });

// category enums
export const commission_categories = [
  "course_payment",
  "expenses",
  "development",
  "total_commission",
  "top_managers",
  "sub_company",
] as const;
export type CommissionCategory = (typeof commission_categories)[number];
export const commission_category_enum = pgEnum(
  "commission_category",
  commission_categories
);

export const commission_distributions = pgTable(
  "commission_distributions",
  {
    id,
    category: commission_category_enum().notNull(),
    amount: numeric("amount").notNull(),
    description: text("description"),
  },
  (table) => {
    return {
      categoryIdx: index("commission_dist_category_idx").on(table.category),
    };
  }
);
