"use server";

import { auth } from "@/auth";
import { db } from "@/drizzle/db";
import { partnerWithdrawals } from "@/drizzle/schema";
import { WithdrawalSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createWithdrawalRequest = async (
  values: z.infer<typeof WithdrawalSchema>
) => {
  try {
    const sesion = await auth();
    if (!sesion?.user) return { error: "Unauthorized" };
    const { user } = sesion;

    const result = await db.insert(partnerWithdrawals).values({
      partner_id: user.id,
      amount: values.amount.toString(),
      status: "pending",
      method_id: values.method,
    });

    if (!result) {
      return { error: "Failed to create withdrawal request" };
    }

    revalidatePath("/partner/dashboard");
    revalidatePath("/partner/withdrawals");
    return { success: true };
  } catch {
    return { error: `Something went wrong` };
  }
};
