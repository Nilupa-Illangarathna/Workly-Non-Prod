// actions/referral-actions.ts
"use server";

import { db } from "@/drizzle/db";
import { sql } from "drizzle-orm";
import { users, referrals } from "@/drizzle/schema";

export async function getReferralStats(partnerId: string) {
  return db.transaction(async (tx) => {
    // Direct referrals
    const directStats = await tx.execute(sql`
      SELECT 
        SUM(CASE WHEN u.role = 'student' THEN 1 ELSE 0 END) as direct_students,
        SUM(CASE WHEN u.role IN ('partner', 'student_partner') THEN 1 ELSE 0 END) as direct_partners
      FROM ${referrals} r
      JOIN ${users} u ON r.referredid = u.id
      WHERE r.referrerid = ${partnerId}
    `);

    // Total referrals in hierarchy
    const totalStats = await tx.execute(sql`
      WITH RECURSIVE referral_tree AS (
        SELECT referredid FROM ${referrals} WHERE referrerid = ${partnerId}
        UNION ALL
        SELECT r.referredid FROM ${referrals} r
        JOIN referral_tree rt ON r.referrerid = rt.referredid
      )
      SELECT 
        SUM(CASE WHEN u.role = 'student' THEN 1 ELSE 0 END) as total_students,
        SUM(CASE WHEN u.role IN ('partner', 'student_partner') THEN 1 ELSE 0 END) as total_partners
      FROM referral_tree rt
      JOIN ${users} u ON rt.referredid = u.id
    `);

    return {
      directStudents: Number(directStats[0].direct_students) || 0,
      directPartners: Number(directStats[0].direct_partners) || 0,
      totalStudents: Number(totalStats[0].total_students) || 0,
      totalPartners: Number(totalStats[0].total_partners) || 0,
    };
  });
}
