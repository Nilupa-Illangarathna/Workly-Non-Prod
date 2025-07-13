"use server";

import { db } from "@/drizzle/db";
import { partners, partnerWithdrawals } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const approveWithdrawal = async (id: string) => {
  try {
    await db.transaction(async (tx) => {
      // If the withdrawal amount is greater than the partner's total earnings, throw an error
      const withdrawal = await tx
        .select({
          amount: partnerWithdrawals.amount,
          partner_id: partnerWithdrawals.partner_id,
        })
        .from(partnerWithdrawals)
        .where(eq(partnerWithdrawals.id, id));

      const partner = await tx
        .select({ amount: partners.amount })
        .from(partners)
        .where(eq(partners.userid, withdrawal[0].partner_id));

      if (Number(withdrawal[0].amount) > Number(partner[0].amount)) {
        throw new Error("Withdrawal amount exceeds total earnings");
      }

      const withdrawalRecord = await tx
        .update(partnerWithdrawals)
        .set({ status: "approved" })
        .where(eq(partnerWithdrawals.id, id))
        .returning();

      const totalamount = await tx
        .select({ amount: partners.amount })
        .from(partners)
        .where(eq(partners.userid, withdrawalRecord[0].partner_id));
      const newTot =
        Number(totalamount[0].amount) - Number(withdrawalRecord[0].amount);

      await tx
        .update(partners)
        .set({ amount: newTot.toString() })
        .where(eq(partners.userid, withdrawalRecord[0].partner_id));
    });

    revalidatePath("/admin/withdrawals");
    revalidatePath("/partner/earnings");
    revalidatePath("/partner");
    return { success: true };
  } catch {
    return { error: "Failed to approve withdrawal" };
  }
};

export const rejectWithdrawal = async (id: string) => {
  try {
    await db
      .update(partnerWithdrawals)
      .set({ status: "rejected" })
      .where(eq(partnerWithdrawals.id, id));

    revalidatePath("/admin/withdrawals");
    revalidatePath("/partner/earnings");
    revalidatePath("/partner");
    return { success: true };
  } catch {
    return { error: "Failed to reject withdrawal" };
  }
};
