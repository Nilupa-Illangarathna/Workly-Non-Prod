"use server";

import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { kyc } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";

export const approveKYC = async (kycId: string) => {
  try {
    await db.transaction(async (tx) => {
      // Update KYC status
      await tx
        .update(kyc)
        .set({
          status: "approved",
          updatedat: new Date(),
        })
        .where(eq(kyc.id, kycId));
    });

    revalidatePath("/admin/kyc");
    return { success: "KYC approved successfully" };
  } catch (error) {
    console.error("KYC approval failed:", error);
    return { error: "Failed to approve KYC" };
  }
};

export const rejectKYC = async (kycId: string) => {
  try {
    await db
      .update(kyc)
      .set({
        status: "rejected",
        updatedat: new Date(),
      })
      .where(eq(kyc.id, kycId));

    revalidatePath("/admin/kyc");
    return { success: "KYC rejected successfully" };
  } catch (error) {
    console.error("KYC rejection failed:", error);
    return { error: "Failed to reject KYC" };
  }
};
