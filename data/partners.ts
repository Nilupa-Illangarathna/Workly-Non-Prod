"use server";

import { sql, eq, and, ne, sum } from "drizzle-orm";
import { db } from "@/drizzle/db";
import {
  users,
  partners,
  referrals,
  payments,
  partnerEarnings,
  partnerWithdrawals,
  paymentMethods,
} from "@/drizzle/schema";

export type Partner = {
  id: string;
  createdAt: Date;
  loginId: string;
  worklyId: string;
  name: string;
  email: string;
  level: number;
  commission: string;
  amountPaid: string;
  totalAmount: string;
  totalReferrals: number;
};

export async function getPartnerById(id: string) {
  const result = await db
    .select()
    .from(partners)
    .where(eq(partners.userid, id));

  if (result.length === 0) return null;

  const partner = result[0];
  return partner;
}

export async function getPartners(): Promise<Partner[]> {
  const partnersData = await db
    .select({
      id: users.id,
      createdAt: users.createdat,
      loginId: users.loginid,
      worklyId: users.worklyid,
      name: sql<string>`CONCAT(${users.firstname}, ' ', ${users.lastname})`,
      amountPaid:
        sql<string>`COALESCE(MAX(${payments.totalamount}::numeric), 0)`.as(
          "amountPaid"
        ),
      email: users.email,
      level: partners.level,
      commission: partners.commissionrate,
      totalAmount: sql<string>`COALESCE(${partners.amount}, '0')`,
      totalReferrals: sql<number>`COALESCE(count(${referrals.id}), 0)`,
    })
    .from(users)
    .innerJoin(partners, eq(users.id, partners.userid))
    .leftJoin(referrals, eq(users.id, referrals.referrerid))
    .leftJoin(payments, eq(users.id, payments.userid))
    .where(and(eq(users.role, "partner"), ne(partners.level, 5)))
    .groupBy(users.id, partners.id);

  return partnersData.map((p) => ({
    ...p,
    createdAt: new Date(p.createdAt),
  }));
}

export async function getReferralChain(userId?: string) {
  if (!userId) return null;

  const [currentPartner] = await db
    .select({
      currentPartnerLevel: partners.level,
      currentPartnerCommission: partners.commissionrate,
      currentUserId: partners.userid,
    })
    .from(partners)
    .where(eq(partners.userid, userId));

  if (!currentPartner) return null;

  const referralTree = (await db.execute(sql`
      WITH RECURSIVE referral_hierarchy AS (
        -- Anchor member: Get direct referrals of the current partner
        SELECT 
          r.referredid,
          r.referrerid,
          ${currentPartner.currentPartnerLevel} + 1 AS level,
          p.level AS referrer_level
        FROM ${referrals} r
        JOIN ${partners} p ON r.referrerid = p.userid
        WHERE r.referrerid = ${currentPartner.currentUserId}
        
        UNION ALL
        
        -- Recursive member: Traverse down the hierarchy
        SELECT 
          r.referredid,
          r.referrerid,
          CASE 
            WHEN p.userid IS NOT NULL THEN p.level  -- For partners
            ELSE rh.level + 1                       -- For students
          END AS level,
          COALESCE(p.level, rh.level) AS referrer_level
        FROM ${referrals} r
        JOIN referral_hierarchy rh ON r.referrerid = rh.referredid
        LEFT JOIN ${partners} p ON r.referredid = p.userid
      )
      SELECT 
        u.id,
        u.worklyid,
        u.firstname,
        u.lastname,
        u.district,
        u.phone,
        u.whatsapp,
        u.email,
        u.createdat,
        u.status,
        u.role,
        rh.level,
        COALESCE(SUM(p.amount)::numeric, 0) AS totalpaid,
        s.worklyid AS sponsor_worklyid,
        s.firstname AS sponsor_firstname,
        s.lastname AS sponsor_lastname,
        COALESCE(ptn.commissionrate::text, '0') AS commissionrate
      FROM referral_hierarchy rh
      JOIN ${users} u ON rh.referredid = u.id
      LEFT JOIN ${users} s ON rh.referrerid = s.id
      LEFT JOIN ${partners} ptn ON u.id = ptn.userid
      LEFT JOIN ${payments} p ON u.id = p.userid AND p.status = 'approved'
      WHERE rh.level > ${currentPartner.currentPartnerLevel}  -- Start from current level +1
      GROUP BY 
        u.id, u.worklyid, u.firstname, u.lastname, u.district, 
        u.phone, u.email, u.createdat, u.status, u.role,
        rh.level, s.worklyid, s.firstname, s.lastname, ptn.commissionrate
      ORDER BY rh.level, u.createdat
    `)) as Array<{
    id: string;
    worklyid: string;
    firstname: string;
    lastname: string;
    district: string;
    phone: string;
    whatsapp: string;
    email: string;
    createdat: Date;
    status: string;
    role: string;
    level: number;
    totalpaid: number;
    sponsor_worklyid: string;
    sponsor_firstname: string;
    sponsor_lastname: string;
    commissionrate: string;
  }>;

  return {
    currentUserId: currentPartner.currentUserId,
    currentPartnerLevel: currentPartner.currentPartnerLevel,
    currentPartnerCommission: currentPartner.currentPartnerCommission,
    referrals: referralTree as Array<{
      id: string;
      worklyid: string;
      firstname: string;
      lastname: string;
      district: string;
      phone: string;
      whatsapp: string;
      email: string;
      createdat: Date;
      status: string;
      role: string;
      level: number;
      totalpaid: number;
      sponsor_worklyid: string;
      sponsor_firstname: string;
      sponsor_lastname: string;
      commissionrate: string;
    }>,
  };
}

export async function getEarningsHistory(partnerid: string) {
  return db
    .select({
      id: partnerEarnings.id,
      worklyid: users.worklyid,
      name: sql<string>`CONCAT(${users.firstname}, ' ', ${users.lastname})`,
      amount: partnerEarnings.amount,
      createdAt: partnerEarnings.createdat,
      level: sql<number>`
        CASE
          WHEN ${users.role} = 'partner' THEN ${partners.level}
          ELSE COALESCE((
            SELECT ${partners.level} + 1
            FROM ${referrals}
            INNER JOIN ${partners} ON ${partners.userid} = ${referrals.referrerid}
            WHERE ${referrals.referredid} = ${users.id}
            LIMIT 1
          ), 0)
        END
      `,
    })
    .from(partnerEarnings)
    .where(eq(partnerEarnings.partnerId, partnerid))
    .innerJoin(users, eq(partnerEarnings.studentId, users.id))
    .leftJoin(partners, eq(users.id, partners.userid))
    .orderBy(sql`createdat DESC`);
}

export async function getWithdrawalHistory(partnerId: string) {
  return db.query.partnerWithdrawals.findMany({
    where: eq(partnerWithdrawals.partner_id, partnerId),
    columns: {
      id: true,
      amount: true,
      method_id: true,
      status: true,
      createdAt: true,
    },
    orderBy: sql`created_at DESC`,
    with: {
      paymentMethod: {
        columns: {
          id: true,
          type: true,
          email: true,
          bank: true,
          number: true,
          branch: true,
        },
      },
    },
  });
}

export async function requestWithdrawal(
  partnerId: string,
  amount: number,
  method_id: string
) {
  return db.insert(partnerWithdrawals).values({
    partner_id: partnerId,
    amount: amount.toFixed(2),
    method_id,
    status: "pending",
  });
}

export async function getPartnerBalance(partnerId: string) {
  const balanceData = await db
    .select({ balance: partners.amount })
    .from(partners)
    .where(eq(partners.userid, partnerId));

  return balanceData[0]?.balance || "0";
}

export const getPartnerOverview = async (partnerId: string) => {
  // Total Earnings
  const totalEarningsResult = await db
    .select({ amount: partners.amount })
    .from(partners)
    .where(eq(partners.userid, partnerId));

  // Complete Withdrawals
  const withdrawalsResult = await db
    .select({ total: sum(partnerWithdrawals.amount) })
    .from(partnerWithdrawals)
    .where(
      and(
        eq(partnerWithdrawals.partner_id, partnerId),
        eq(partnerWithdrawals.status, "approved")
      )
    );

  // Pending Withdrawals
  const pendingWithdrawalsResult = await db
    .select({ total: sum(partnerWithdrawals.amount) })
    .from(partnerWithdrawals)
    .where(
      and(
        eq(partnerWithdrawals.partner_id, partnerId),
        eq(partnerWithdrawals.status, "pending")
      )
    );

  const [partnerData] = await db
    .select({
      commissionRate: partners.commissionrate,
      level: partners.level,
    })
    .from(partners)
    .where(eq(partners.userid, partnerId));

  // Fetch all referrals in the hierarchy
  const referralTreeQuery = await db.execute(sql`
    WITH RECURSIVE referral_tree AS (
      SELECT 
        r.referredid,
        1 AS level,
        u.role,
        p.totalamount
      FROM ${referrals} r
      INNER JOIN ${users} u ON r.referredid = u.id
      LEFT JOIN LATERAL (
        SELECT totalamount 
        FROM ${payments}
        WHERE userid = r.referredid
        ORDER BY createdat DESC
        LIMIT 1
      ) p ON true
      WHERE r.referrerid = ${partnerId}
      
      UNION ALL
      
      SELECT 
        r.referredid,
        rt.level + 1,
        u.role,
        p.totalamount
      FROM ${referrals} r
      INNER JOIN referral_tree rt ON r.referrerid = rt.referredid
      INNER JOIN ${users} u ON r.referredid = u.id
      LEFT JOIN LATERAL (
        SELECT totalamount 
        FROM ${payments}
        WHERE userid = r.referredid
        ORDER BY createdat DESC
        LIMIT 1
      ) p ON true
    )
    SELECT
      role,
      level,
      COALESCE(totalamount::numeric, 0) AS total_paid
    FROM referral_tree
  `);

  // Initialize metrics object
  const metrics = {
    totalEarnings: totalEarningsResult[0]?.amount || 0,
    pendingWithdrawals: pendingWithdrawalsResult[0]?.total || 0,
    completeWithdrawals: withdrawalsResult[0]?.total || 0,
    totalReferrals: {
      total: 0,
      partners: 0,
      students: 0,
    },
    payments: {
      completed: 0,
      pending: 0,
      notCompleted: 0,
    },
    directReferrals: {
      count: 0,
      earnings: 0,
    },
    subReferrals: {
      count: 0,
      earnings: 0,
    },
  };

  // Process each referral
  for (const row of referralTreeQuery) {
    metrics.totalReferrals.total++;
    const totalPaid = Number(row.total_paid);
    const level = Number(row.level);
    const role = row.role;

    // Count partners/students
    if (role === "partner") {
      metrics.totalReferrals.partners++;
    } else {
      metrics.totalReferrals.students++;

      // Track payment status
      if (totalPaid >= 17500) {
        metrics.payments.completed++;
      } else if (totalPaid > 0) {
        metrics.payments.pending++;
      } else {
        metrics.payments.notCompleted++;
      }
    }

    if (level === Number(partnerData.level) + 1) {
      metrics.directReferrals.count++;
    } else if (level > Number(partnerData.level) + 1) {
      metrics.subReferrals.count++;
    }
  }

  // Calculate direct and sub-referrals earnings
  const partnerEarningsRecords = await db
    .select({
      totalPaid: partnerEarnings.amount,
    })
    .from(partnerEarnings)
    .where(eq(partnerEarnings.partnerId, partnerId));

  for (const row of partnerEarningsRecords) {
    if (row.totalPaid === partnerData.commissionRate) {
      metrics.directReferrals.earnings += Number(row.totalPaid);
    } else {
      metrics.subReferrals.earnings += Number(row.totalPaid);
    }
  }

  return metrics;
};

export const getPartnerPaymentMethods = async (partnerId: string) => {
  return await db.query.paymentMethods.findMany({
    where: eq(paymentMethods.userid, partnerId),
    columns: {
      id: true,
      type: true,
      email: true,
      bank: true,
      number: true,
    },
  });
};
