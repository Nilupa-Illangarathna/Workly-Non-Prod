"use server";

import { db } from "@/drizzle/db";
import { eq, gte, sql } from "drizzle-orm";
import {
  users,
  payments,
  kyc,
  partnerWithdrawals,
  partners,
  commission_distributions,
  partnerEarnings,
} from "@/drizzle/schema";

export async function getAdminDashboardData() {
  // Fetch default course fee once
  const defaultCourseFeeQuery = await db
    .select({ fee: commission_distributions.amount }) // Assuming 'courseFee' column
    .from(commission_distributions)
    .where(
      eq(commission_distributions.category, "course_payment") // Assuming 'type' column
    )
    .limit(1);
  // Use a fallback if no course fee is found in the database.
  const DEFAULT_COURSE_FEE = Number(defaultCourseFeeQuery[0]?.fee) ?? 17500.0;

  return db.transaction(async (tx) => {
    const [
      pendingUsersCount,
      pendingPaymentsCount,
      pendingKYCCount,
      pendingWithdrawalsCount,

      totalPartnersCount,
      subCompanyPartnersCount,
      sub1PartnersCount,
      sub2PartnersCount,
      sub3PartnersCount,

      studentPaymentStats,

      totalReceivedAmountResult,

      totalPartnerEarningsResult,
      totalPartnerWithdrawalsResult,
      pendingWithdrawalsAmountResult,
    ] = await Promise.all([
      tx
        .select({ count: sql<number>`count(*)::int` })
        .from(users)
        .where(eq(users.status, "pending"))
        .then((r) => r[0].count),
      tx
        .select({ count: sql<number>`count(*)::int` })
        .from(payments)
        .where(eq(payments.status, "pending"))
        .then((r) => r[0].count),
      tx
        .select({ count: sql<number>`count(*)::int` })
        .from(kyc)
        .where(eq(kyc.status, "pending"))
        .then((r) => r[0].count),
      tx
        .select({ count: sql<number>`count(*)::int` })
        .from(partnerWithdrawals)
        .where(eq(partnerWithdrawals.status, "pending"))
        .then((r) => r[0].count),

      tx
        .select({ count: sql<number>`count(*)::int` })
        .from(partners)
        .then((r) => r[0].count),
      tx
        .select({ count: sql<number>`count(*)::int` })
        .from(partners)
        .where(eq(partners.level, 1))
        .then((r) => r[0]?.count ?? 0),
      tx
        .select({ count: sql<number>`count(*)::int` })
        .from(partners)
        .where(eq(partners.level, 2))
        .then((r) => r[0]?.count ?? 0),
      tx
        .select({ count: sql<number>`count(*)::int` })
        .from(partners)
        .where(eq(partners.level, 3))
        .then((r) => r[0]?.count ?? 0),
      tx
        .select({ count: sql<number>`count(*)::int` })
        .from(partners)
        .where(eq(partners.level, 4))
        .then((r) => r[0]?.count ?? 0),

      tx
        .select({
          userId: payments.userid,
          totalPaid: sql<number>`coalesce(sum(${payments.amount}), 0)`.mapWith(
            Number
          ),
        })
        .from(payments)
        .where(eq(payments.status, "approved"))
        .groupBy(payments.userid),

      tx
        .select({
          total: sql<number>`coalesce(sum(${payments.amount}), 0)`.mapWith(
            Number
          ),
        })
        .from(payments)
        .where(eq(payments.status, "approved"))
        .then((r) => r[0].total),

      tx
        .select({
          total:
            sql<number>`coalesce(sum(${partnerEarnings.amount}), 0)`.mapWith(
              Number
            ),
        })
        .from(partnerEarnings)
        .leftJoin(partners, eq(partnerEarnings.partnerId, partners.userid))
        .where(gte(partners.level, 1))
        .then((r) => r[0]?.total ?? 0),
      tx
        .select({
          total:
            sql<number>`coalesce(sum(${partnerWithdrawals.amount}), 0)`.mapWith(
              Number
            ),
        })
        .from(partnerWithdrawals)
        .where(eq(partnerWithdrawals.status, "approved"))
        .then((r) => r[0]?.total ?? 0),
      tx
        .select({
          total:
            sql<number>`coalesce(sum(${partnerWithdrawals.amount}), 0)`.mapWith(
              Number
            ),
        })
        .from(partnerWithdrawals)
        .where(eq(partnerWithdrawals.status, "pending"))
        .then((r) => r[0]?.total ?? 0),
    ]);

    const allStudentsQuery = await tx
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, "student"));
    const totalStudentsCount = allStudentsQuery.length;

    let paidStudentsCount = 0;
    let pendingStudentsCount = 0;
    let totalCompletedStudentAmount = 0;
    let totalPendingStudentAmount = 0;

    const studentDataMap = new Map(
      studentPaymentStats.map((item) => [item.userId, item.totalPaid])
    );

    allStudentsQuery.forEach((student) => {
      const totalPaidByStudent = studentDataMap.get(student.id) ?? 0;
      const studentCourseFee = DEFAULT_COURSE_FEE; // Simplified: Assumes one course fee for all

      if (totalPaidByStudent >= studentCourseFee) {
        paidStudentsCount++;
        totalCompletedStudentAmount += studentCourseFee;
      } else if (
        totalPaidByStudent > 0 &&
        totalPaidByStudent < studentCourseFee
      ) {
        pendingStudentsCount++;
        totalPendingStudentAmount += studentCourseFee - totalPaidByStudent;
      }
    });

    const unpaidStudentsCount =
      totalStudentsCount - paidStudentsCount - pendingStudentsCount;

    return {
      kycApprovals: pendingKYCCount,
      coursePaymentApprovals: pendingPaymentsCount,
      pendingUserApprovals: pendingUsersCount,
      pendingWithdrawalApprovals: pendingWithdrawalsCount,

      partnersOverview: {
        title: "Partners Overview",
        totalValue: totalPartnersCount,
        categorizedValues: [
          { label: "Sub company", value: subCompanyPartnersCount },
          { label: "Sub 1", value: sub1PartnersCount },
          { label: "Sub 2", value: sub2PartnersCount },
          { label: "Sub 3", value: sub3PartnersCount },
        ],
      },
      studentPaymentOverview: {
        title: "Student Payment Overview",
        totalValue: totalStudentsCount,
        categorizedValues: [
          { label: "Paid", value: paidStudentsCount },
          { label: "Pending", value: pendingStudentsCount },
          { label: "Unpaid", value: unpaidStudentsCount },
        ],
      },
      studentPaymentSummary: {
        title: "Student Payment Summary",
        totalValue: totalReceivedAmountResult,
        categorizedValues: [
          { label: "Total Received", value: totalReceivedAmountResult },
          { label: "Completed Amount", value: totalCompletedStudentAmount },
          { label: "Pending Amount", value: totalPendingStudentAmount },
        ],
      },
      partnerEarningsAndWithdrawals: {
        title: "Partner Earnings & Withdrawals",
        totalValue: totalPartnerEarningsResult,
        categorizedValues: [
          { label: "Total Earnings", value: totalPartnerEarningsResult },
          { label: "Total Withdrawals", value: totalPartnerWithdrawalsResult },
          {
            label: "Pending Withdrawals",
            value: pendingWithdrawalsAmountResult,
          },
        ],
      },
    };
  });
}
