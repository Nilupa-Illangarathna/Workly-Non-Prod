"use server";

import { db } from "@/drizzle/db";
import { payments } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getPaymentStatus(userId: string) {
  try {
    const [latestPayment] = await db
      .select()
      .from(payments)
      .where(eq(payments.userid, userId))
      .orderBy(payments.createdat)
      .limit(1);

    return latestPayment || null;
  } catch {
    return null;
  }
}
