"use server";

import { db } from "@/drizzle/db";
import { paymentMethods } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const getPaymentMethodsByUser = async (id: string) => {
  try {
    const data = await db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.userid, id));

    return data;
  } catch {
    throw new Error("Failed to fetch payment methods");
  }
};
