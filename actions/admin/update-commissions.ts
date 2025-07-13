// actions/update-commissions.ts
"use server";

import { db } from "@/drizzle/db";
import { commission_distributions } from "@/drizzle/schema";
import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateCommissions(values: {
  course_payment: string;
  expenses: string;
  development: string;
  total_commission: string;
  top_managers: string;
  sub_company: string;
}) {
  const result = db.transaction(async (tx) => {
    await Promise.all([
      tx
        .update(commission_distributions)
        .set({ amount: values.course_payment })
        .where(sql`category = 'course_payment'`),

      tx
        .update(commission_distributions)
        .set({ amount: values.expenses })
        .where(sql`category = 'expenses'`),

      tx
        .update(commission_distributions)
        .set({ amount: values.development })
        .where(sql`category = 'development'`),

      tx
        .update(commission_distributions)
        .set({ amount: values.total_commission })
        .where(sql`category = 'total_commission'`),

      tx
        .update(commission_distributions)
        .set({ amount: values.top_managers })
        .where(sql`category = 'top_managers'`),

      tx
        .update(commission_distributions)
        .set({ amount: values.sub_company })
        .where(sql`category = 'sub_company'`),
    ]);
  });

  revalidatePath("/admin/sd-panel");
  return result;
}
