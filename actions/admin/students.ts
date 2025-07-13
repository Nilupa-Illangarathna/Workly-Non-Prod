"use server";

import { auth } from "@/auth";
import { db } from "@/drizzle/db";
import {
  commission_distributions,
  partners,
  payments,
  users,
} from "@/drizzle/schema";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { distributeCommission } from "./distribute-commission";

/**
 * Handles a new direct payment from an admin for a student.
 * This inserts a new payment record and potentially triggers commission distribution.
 */
export const handleStudentPayment = async (
  studentid: string,
  amount: number
): Promise<{ success: boolean; message: string }> => {
  try {
    // Wrap the entire process in a single transaction
    return await db.transaction(async (tx) => {
      // 1. Fetch current approved total for the student and course payment config
      const [oldTotalAmountResult, coursePaymentConfig] = await Promise.all([
        tx
          .select({ total: sql<number>`sum(amount)` })
          .from(payments)
          .where(
            and(eq(payments.userid, studentid), eq(payments.status, "approved"))
          ),
        tx
          .select()
          .from(commission_distributions)
          .where(eq(commission_distributions.category, "course_payment")),
      ]);

      // Guard: Check if course payment configuration exists
      if (coursePaymentConfig.length === 0) {
        return {
          success: false,
          message:
            "Course payment configuration not found. Cannot process payment.",
        };
      }

      // Parse amounts
      const oldTotalAmountValue = Number(oldTotalAmountResult[0]?.total) || 0;
      const coursePaymentValue = Number(coursePaymentConfig[0]?.amount) || 0;
      const newTotalAmount = oldTotalAmountValue + amount;

      // Guard: Prevent overpayment
      if (newTotalAmount > coursePaymentValue) {
        return {
          success: false,
          message: `Payment exceeds the course fee of ${coursePaymentValue.toFixed(
            2
          )}. Current approved total: ${oldTotalAmountValue.toFixed(2)}.`,
        };
      }

      // 2. Approve the user if not already approved (idempotent)
      const user = await tx
        .select({ status: users.status })
        .from(users)
        .where(eq(users.id, studentid));

      if (user.length === 0) {
        return {
          success: false,
          message: "Student not found for payment processing.",
        };
      }

      if (user[0]?.status === "pending") {
        await tx
          .update(users)
          .set({ status: "approved", updatedat: new Date() })
          .where(eq(users.id, studentid));
      }

      // 3. Insert the new payment record
      // The payment is "approved" immediately as it's directly handled by admin
      const [newPayment] = await tx
        .insert(payments)
        .values({
          userid: studentid,
          amount: amount.toFixed(2), // Store as fixed-point string
          totalamount: newTotalAmount.toFixed(2), // Store as fixed-point string
          type: "direct",
          status: "approved",
          createdat: new Date(),
          updatedat: new Date(),
        })
        .returning({ id: payments.id }); // Get the ID of the newly inserted payment

      const insertedPaymentId = newPayment.id;

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
        const commissionResult = await distributeCommission({
          tx, // Pass the transaction object
          studentId: studentid,
          paymentId: insertedPaymentId,
        });

        if (!commissionResult.success) {
          // Propagate the specific error message from distributeCommission
          throw new Error(commissionResult.message);
        }
      }

      // Revalidate cache for affected paths after successful transaction
      revalidatePath("/admin/students");
      revalidatePath("/admin/partners");
      revalidatePath("/admin/registry");
      revalidatePath("/partner/earnings");
      revalidatePath("/admin/payments"); // New payment added

      return { success: true, message: "Payment processed successfully." };
    });
  } catch (error) {
    console.error("Handle student payment failed:", error);
    return {
      success: false,
      message: `Failed to process payment: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
};

export async function handlePromotePartner(userId: string, commission: number) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }
  const { user } = session;
  try {
    await db.transaction(async (tx) => {
      // Update user status
      await tx
        .update(users)
        .set({ role: "student_partner" })
        .where(eq(users.id, userId));

      // Update partner status and commission
      await tx.insert(partners).values({
        userid: userId,
        status: "approved",
        level: user.level + 1,
        commissionrate: commission.toString(),
      });
    });

    revalidatePath("/admin/students");
    return { success: "Partner Approved Successfully" };
  } catch (error) {
    throw new Error("Partner approval failed: " + error);
  }
}
