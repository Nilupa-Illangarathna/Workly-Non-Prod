"use server";

import { db } from "@/drizzle/db";
import { and, eq, sql } from "drizzle-orm";
import { payments, commission_distributions, users } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import { distributeCommission } from "./distribute-commission";

/**
 * Approves an existing payment and potentially distributes commissions.
 * This is typically used for approving payments initiated by a user (e.g., via payment gateway).
 */
export const approvePayment = async (
  paymentId: string,
  userId: string
): Promise<string> => {
  // Changed return type to Promise<string> for success message
  try {
    // Wrap the entire process in a single transaction
    const message = await db.transaction(async (tx) => {
      // Capture the successful message from transaction
      // 1. Fetch payment details, existing approved total, and course payment details
      const [paymentDetailsResult, oldTotalAmountResult, coursePaymentConfig] =
        await Promise.all([
          tx.select().from(payments).where(eq(payments.id, paymentId)),
          tx
            .select({ total: sql<number>`sum(amount)` })
            .from(payments)
            .where(
              and(eq(payments.userid, userId), eq(payments.status, "approved"))
            ),
          tx
            .select()
            .from(commission_distributions)
            .where(eq(commission_distributions.category, "course_payment")),
        ]);

      // Guard: Check if payment exists
      if (paymentDetailsResult.length === 0) {
        throw new Error("Payment not found."); // Throw error for toast.promise to catch
      }
      const paymentToApprove = paymentDetailsResult[0];

      // Guard: Check if course payment configuration exists
      if (coursePaymentConfig.length === 0) {
        throw new Error(
          "Course payment configuration not found. Cannot determine commission eligibility."
        ); // Throw error
      }

      // Parse amounts
      const oldTotalAmountValue = Number(oldTotalAmountResult[0]?.total) || 0;
      const coursePaymentValue = Number(coursePaymentConfig[0]?.amount) || 0;
      const paymentAmount = Number(paymentToApprove.amount) || 0;
      const newTotalAmount = oldTotalAmountValue + paymentAmount;

      // 2. Approve the user if not already approved (idempotent)
      const user = await tx
        .select({ status: users.status })
        .from(users)
        .where(eq(users.id, userId));

      if (user.length === 0) {
        throw new Error("User not found for payment approval."); // Throw error
      }

      if (user[0]?.status === "pending") {
        await tx
          .update(users)
          .set({ status: "approved", updatedat: new Date() })
          .where(eq(users.id, userId));
      }

      // 3. Update the payment status in the database
      await tx
        .update(payments)
        .set({
          status: "approved",
          totalamount: newTotalAmount.toFixed(2),
          updatedat: new Date(),
        })
        .where(eq(payments.id, paymentId));

      let successMessage = "Payment approved.";

      if (newTotalAmount > coursePaymentValue) {
        // Guard: Prevent overpayment
        throw new Error(
          `Payment exceeds the course fee of ${coursePaymentValue.toFixed(
            2
          )}. Current approved total: ${oldTotalAmountValue.toFixed(2)}.`
        ); // Throw error for toast.promise to catch
      }

      // 4. Check if the payment completes the course fee and distribute commission if so
      if (newTotalAmount === coursePaymentValue) {
        // Call distributeCommission within the same transaction
        const commissionResult = await distributeCommission({
          tx,
          studentId: userId,
          paymentId: paymentId,
        });

        if (!commissionResult.success) {
          // Propagate the specific error message from distributeCommission
          throw new Error(commissionResult.message);
        }
        successMessage = commissionResult.message; // Use commission message if distribution occurred
      }

      // Revalidate cache for affected paths after successful transaction
      revalidatePath("/admin/payments");
      revalidatePath("/admin/students");
      revalidatePath("/admin/partners");
      revalidatePath("/partner/earnings");
      revalidatePath("/admin/registry");

      return successMessage; // Return the success message string
    });
    return message; // Return the message from the transaction
  } catch (error) {
    console.error("Approve payment failed:", error);
    // Re-throw the error to be caught by toast.promise
    throw new Error(
      `Failed to approve payment: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const rejectPayment = async (paymentId: string) => {
  try {
    await db
      .update(payments)
      .set({
        status: "rejected",
        updatedat: new Date(),
      })
      .where(eq(payments.id, paymentId));

    revalidatePath("/admin/payments");
    return { success: "Payment rejected" };
  } catch (error) {
    console.error("Rejection failed:", error);
    return { error: "Failed to reject payment" };
  }
};

export const editPayment = async (
  paymentId: string,
  userId: string,
  newAmount: number
) => {
  try {
    const oldAmountResult = await db
      .select({ total: sql<number>`sum(amount)` })
      .from(payments)
      .where(and(eq(payments.userid, userId), eq(payments.status, "approved")));

    const oldTotalAmountValue = Number(oldAmountResult[0]?.total) || 0;

    await db
      .update(payments)
      .set({
        amount: String(newAmount),
        totalamount: String(oldTotalAmountValue + newAmount),
        updatedat: new Date(),
      })
      .where(eq(payments.id, paymentId));

    revalidatePath("/admin/payments");
    return { success: "Payment updated successfully" };
  } catch (error) {
    console.error("Update failed:", error);
    return { error: "Failed to update payment" };
  }
};
