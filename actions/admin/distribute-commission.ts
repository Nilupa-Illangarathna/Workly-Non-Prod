"use server";

import { eq, ExtractTablesWithRelations, sql } from "drizzle-orm"; // Added InferSelectModel for better typing
import {
  commission_distributions,
  users,
  partners,
  partnerEarnings,
  referrals,
} from "@/drizzle/schema";
import { PgTransaction } from "drizzle-orm/pg-core"; // Import necessary Drizzle types
import { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";

// Define the type for the transaction object for better type safety
type DBTransaction = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof import("@/drizzle/schema"),
  ExtractTablesWithRelations<typeof import("@/drizzle/schema")>
>;

// --- Helper Functions ---

/** Small helper to credit a single partner and record the earning */
async function creditPartner(
  tx: DBTransaction,
  userId: string,
  amount: number,
  studentId: string,
  paymentId: string,
  level: number
) {
  // Define roles for description
  const roles = [
    "Developer", // Level -1 (custom for developer)
    "Top Manager", // Level 0
    "Sub Company", // Level 1
    "Sub 1", // Level 2
    "Sub 2", // Level 3
    "Sub 3", // Level 4
  ];
  const role = level === -1 ? roles[0] : roles[level + 1] || "Unknown";

  // Update partner's total accumulated amount
  await tx
    .update(partners)
    .set({ amount: sql`${partners.amount} + ${amount}` })
    .where(eq(partners.userid, userId));

  // Record the specific earning for transparency
  await tx.insert(partnerEarnings).values({
    partnerId: userId,
    studentId,
    amount: amount.toFixed(2), // Store as fixed-point string for currency
    referenceId: paymentId,
    description: `${role} Commission`,
  });
}

/** Recursively builds the full referral chain for a student */
const getCommissionChain = async (
  tx: DBTransaction, // Accept transaction object
  studentId: string
) => {
  // Use tx.execute to ensure this query is part of the transaction
  const result = await tx.execute(sql`
    WITH RECURSIVE commission_hierarchy AS (
      SELECT
        p.userid,
        p.level,
        p.commissionrate,
        r.referrerid,
        0 AS depth
      FROM ${referrals} r
      JOIN ${partners} p ON r.referrerid = p.userid
      WHERE r.referredid = ${studentId}
      UNION ALL
      SELECT
        p.userid,
        p.level,
        p.commissionrate,
        r.referrerid,
        ch.depth + 1
      FROM ${referrals} r
      JOIN commission_hierarchy ch ON r.referredid = ch.referrerid
      JOIN ${partners} p ON r.referrerid = p.userid
    )
    SELECT
      userid,
      level,
      commissionrate,
      ROW_NUMBER() OVER (ORDER BY depth DESC) AS hierarchy_order
    FROM commission_hierarchy
    ORDER BY depth DESC
  `);

  // Map results to a consistent type for easier access
  return result.map((row) => ({
    userid: row.userid as string,
    level: row.level as number,
    commissionrate: row.commissionrate as string, // Assuming commissionrate is stored as string/decimal
  }));
};

/**
 * Distributes commission to partners based on the referral chain and predefined pools.
 * This function should be called within a larger transaction.
 */
export const distributeCommission = async ({
  tx, // The transaction object from the calling function
  studentId,
  paymentId,
}: {
  tx: DBTransaction;
  studentId: string;
  paymentId?: string;
}) => {
  try {
    const currentPaymentId = paymentId; // Use a mutable variable for paymentId

    // 1). Ensure user status is 'approved' (idempotent: only updates if pending)
    const user = await tx
      .select({ status: users.status })
      .from(users)
      .where(eq(users.id, studentId));

    if (user.length === 0) {
      throw new Error("Student not found for commission distribution.");
    }

    if (user[0]?.status === "pending") {
      await tx
        .update(users)
        .set({ status: "approved", updatedat: new Date() })
        .where(eq(users.id, studentId));
    }

    // Ensure paymentId is available for earning records
    if (!currentPaymentId) {
      throw new Error("Payment ID is missing for commission distribution.");
    }

    // 3) Load the three distribution pools (using the passed 'tx' object)
    const [totalPoolResult, topPoolResult, subPoolResult] = await Promise.all([
      tx
        .select({ amount: commission_distributions.amount })
        .from(commission_distributions)
        .where(eq(commission_distributions.category, "total_commission")),
      tx
        .select({ amount: commission_distributions.amount })
        .from(commission_distributions)
        .where(eq(commission_distributions.category, "top_managers")),
      tx
        .select({ amount: commission_distributions.amount })
        .from(commission_distributions)
        .where(eq(commission_distributions.category, "sub_company")),
    ]);

    // Parse pool amounts, defaulting to 0 if not found
    const totalPoolAmount = parseFloat(totalPoolResult[0]?.amount || "0");
    const topPoolAmount = parseFloat(topPoolResult[0]?.amount || "0");
    const subPoolAmount = parseFloat(subPoolResult[0]?.amount || "0");

    // 4) Build the referral chain
    const chain = await getCommissionChain(tx, studentId);

    // Filter out level 0 (Top Manager) from the sub-chain if they are included in the chain
    // The recursive CTE might include the direct referrer regardless of level.
    // The top managers are handled separately in step 5.
    const subChain = chain
      .filter((p) => p.level > 0)
      .sort((a, b) => a.level - b.level); // Ensure ascending order by level for correct distribution logic

    const hasReferral = subChain.length > 0;

    // 5) Distribute to ALL Top Managers (level 0 partners)
    const topManagers = await tx
      .select()
      .from(partners)
      .where(eq(partners.level, 0));

    // Determine the base amount for top managers based on referral presence
    const baseTopAmount = hasReferral ? topPoolAmount : totalPoolAmount;

    for (const mgr of topManagers) {
      const rate = Number(mgr.commissionrate) / 100;
      const calculatedAmount = rate * baseTopAmount;
      const amt = parseFloat(calculatedAmount.toFixed(2)); // Round to 2 decimal places for currency

      if (amt > 0) {
        await creditPartner(
          tx,
          mgr.userid!,
          amt,
          studentId,
          currentPaymentId,
          mgr.level
        );
      }
    }

    // 6) Distribute to Developers (hardcoded developer ID and fixed amount)
    // Consider making the developer ID and amount configurable if they can change
    await creditPartner(
      tx,
      "d56a1e10-40a3-4730-b903-9afde580de74", // Developer User ID
      300, // Fixed amount for developer
      studentId,
      currentPaymentId,
      -1 // Custom level for developer for role mapping
    );

    // 7) If there IS a referral chain (sub-company and below), distribute subPool down it
    if (hasReferral) {
      for (let i = 0; i < subChain.length; i++) {
        const currentPartnerInChain = subChain[i];
        let amountToCredit: number;

        const currentPartnerRate = Number(currentPartnerInChain.commissionrate);

        if (i === 0) {
          // This is the Sub-Company (level 1)
          // It takes the subPool amount minus the rate for the *next* level if it exists
          if (subChain.length > 1) {
            const nextLevelRate = Number(subChain[i + 1].commissionrate);
            amountToCredit = subPoolAmount - nextLevelRate;
          } else {
            // If only sub-company exists in the chain, it gets the full subPool
            amountToCredit = subPoolAmount;
          }
        } else if (i === subChain.length - 1) {
          // This is the last partner in the chain, they get their full rate
          amountToCredit = currentPartnerRate;
        } else {
          // Middle partners in the chain (Sub 1, Sub 2, etc.)
          // They get their rate minus the rate of the next tier below them
          const nextLevelRate = Number(subChain[i + 1].commissionrate);
          amountToCredit = currentPartnerRate - nextLevelRate;
        }

        const amt = parseFloat(amountToCredit.toFixed(2)); // Round to 2 decimal places

        // Only credit partner if the calculated amount is greater than 0
        if (amt > 0) {
          await creditPartner(
            tx,
            currentPartnerInChain.userid,
            amt,
            studentId,
            currentPaymentId,
            currentPartnerInChain.level
          );
        }
      }
    }

    return { success: true, message: "Commission distributed successfully" };
  } catch (err) {
    // Log the error for debugging
    console.error("Internal commission distribution failed:", err);
    // Re-throw the error to ensure the calling transaction is rolled back
    throw err;
  }
};
