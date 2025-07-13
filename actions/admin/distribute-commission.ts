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
import { db } from "@/drizzle/db"; // Import your DB instance

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
  studentId,
  paymentId,
}: {
  studentId: string;
  paymentId?: string;
}) => {
  try {
    console.log("🟡 Starting commission distribution...");

    if (!paymentId) {
      console.error("❌ Missing payment ID");
      throw new Error("Payment ID is missing for commission distribution.");
    }

    console.log(`➡️ Student ID: ${studentId}`);
    console.log(`➡️ Payment ID: ${paymentId}`);

    return await db.transaction(async (tx) => {
      const currentPaymentId = paymentId;

      // 1). Ensure user status is 'approved'
      const user = await tx
        .select({ status: users.status })
        .from(users)
        .where(eq(users.id, studentId));

      if (user.length === 0) {
        console.error("❌ Student not found");
        throw new Error("Student not found for commission distribution.");
      }

      if (user[0]?.status === "pending") {
        console.log("🟢 Approving pending student...");
        await tx
          .update(users)
          .set({ status: "approved", updatedat: new Date() })
          .where(eq(users.id, studentId));
      }

      // 2). Load the three distribution pools
      console.log("🔄 Fetching commission pools...");
      const [totalPoolResult, topPoolResult, subPoolResult] = await Promise.all([
        tx.select({ amount: commission_distributions.amount })
          .from(commission_distributions)
          .where(eq(commission_distributions.category, "total_commission")),
        tx.select({ amount: commission_distributions.amount })
          .from(commission_distributions)
          .where(eq(commission_distributions.category, "top_managers")),
        tx.select({ amount: commission_distributions.amount })
          .from(commission_distributions)
          .where(eq(commission_distributions.category, "sub_company")),
      ]);

      const totalPoolAmount = parseFloat(totalPoolResult[0]?.amount || "0");
      const topPoolAmount = parseFloat(topPoolResult[0]?.amount || "0");
      const subPoolAmount = parseFloat(subPoolResult[0]?.amount || "0");

      console.log(`📊 Pool amounts: total=${totalPoolAmount}, top=${topPoolAmount}, sub=${subPoolAmount}`);

      // 3) Build the referral chain
      console.log("🔗 Building referral chain...");
      const chain = await getCommissionChain(tx, studentId);
      const subChain = chain.filter((p) => p.level > 0).sort((a, b) => a.level - b.level);
      const hasReferral = subChain.length > 0;
      console.log(`🔗 Referral chain found: ${hasReferral} (${subChain.length} members)`);

      // 4) Distribute to ALL Top Managers
      const topManagers = await tx.select().from(partners).where(eq(partners.level, 0));
      const baseTopAmount = hasReferral ? topPoolAmount : totalPoolAmount;

      console.log(`💸 Distributing to ${topManagers.length} top managers...`);
      for (const mgr of topManagers) {
        const rate = Number(mgr.commissionrate) / 100;
        const amt = parseFloat((rate * baseTopAmount).toFixed(2));
        console.log(`➡️ Top Manager [${mgr.userid}] earns ${amt} (rate: ${rate * 100}%)`);
        if (amt > 0) {
          await creditPartner(tx, mgr.userid!, amt, studentId, currentPaymentId, mgr.level);
        }
      }

      // 5) Distribute to Developers
      console.log("💻 Crediting developer account with fixed 300...");
      await creditPartner(
        tx,
        "d56a1e10-40a3-4730-b903-9afde580de74",
        300,
        studentId,
        currentPaymentId,
        -1
      );

      // 6) Distribute to Referral Chain (if exists)
      if (hasReferral) {
        console.log("🔁 Distributing to referral chain...");
        for (let i = 0; i < subChain.length; i++) {
          const partner = subChain[i];
          let amountToCredit: number;

          const rate = Number(partner.commissionrate);

          if (i === 0) {
            amountToCredit =
              subChain.length > 1
                ? subPoolAmount - Number(subChain[i + 1].commissionrate)
                : subPoolAmount;
          } else if (i === subChain.length - 1) {
            amountToCredit = rate;
          } else {
            amountToCredit = rate - Number(subChain[i + 1].commissionrate);
          }

          const amt = parseFloat(amountToCredit.toFixed(2));
          console.log(`➡️ Referral [${partner.userid}] earns ${amt} (level: ${partner.level})`);

          if (amt > 0) {
            await creditPartner(tx, partner.userid, amt, studentId, currentPaymentId, partner.level);
          }
        }
      }

      console.log("✅ Commission distribution completed successfully.");
      return { success: true, message: "Commission distributed successfully" };
    });
  } catch (err) {
    console.error("❌ Commission distribution FAILED:", err);
    return { success: false, message: (err as Error).message || "Unknown error" };
  }
};
