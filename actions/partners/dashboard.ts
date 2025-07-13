// lib/referral.ts
import { db } from "@/drizzle/db";
import { sql } from "drizzle-orm";
import { auth } from "@/auth";

// Get current partner's user ID from session
export async function getCurrentPartnerUserId() {
  const session = await auth();
  return session?.user?.id || null;
}

// 1. Direct Students (students directly referred by the partner)
export async function getDirectStudentCount(partnerUserId: string) {
  const result = await db.execute(sql`
    SELECT COUNT(*)::integer
    FROM referrals
    WHERE referrerid = ${partnerUserId}
      AND referredid IN (SELECT id FROM users WHERE role = 'student')
  `);

  return result[0].count;
}

// 2. Direct Partners (partners directly referred by the current partner)
export async function getDirectPartnerCount(partnerUserId: string) {
  const result = await db.execute(sql`
    SELECT COUNT(DISTINCT p.id)::integer
    FROM partners p
    INNER JOIN referrals r ON p.userid = r.referredid
    WHERE r.referrerid = ${partnerUserId}
  `);

  return result[0].count;
}

// 3. All Students in Network (direct + sub-partners' students)
export async function getAllStudentCount(partnerUserId: string) {
  const result = await db.execute(sql`
    WITH RECURSIVE referral_chain AS (
      SELECT referredid
      FROM referrals
      WHERE referrerid = ${partnerUserId}
      
      UNION ALL
      
      SELECT r.referredid
      FROM referrals r
      INNER JOIN referral_chain rc ON r.referrerid = rc.referredid
    )
    SELECT COUNT(DISTINCT rc.referredid)::integer
    FROM referral_chain rc
    INNER JOIN users u ON rc.referredid = u.id
    WHERE u.role = 'student'
  `);

  return result[0].count;
}

// 4. All Partners in Network (direct + sub-partners' partners)
export async function getAllPartnerCount(partnerUserId: string) {
  const result = await db.execute(sql`
    WITH RECURSIVE partner_chain AS (
      SELECT p.userid
      FROM partners p
      INNER JOIN referrals r ON p.userid = r.referredid
      WHERE r.referrerid = ${partnerUserId}
      
      UNION ALL
      
      SELECT p.userid
      FROM partners p
      INNER JOIN referrals r ON p.userid = r.referredid
      INNER JOIN partner_chain pc ON r.referrerid = pc.userid
    )
    SELECT COUNT(DISTINCT pc.userid)::integer
    FROM partner_chain pc
  `);

  return result[0].count;
}

// Transaction wrapper for consistent counts
export async function getFullNetworkStats(partnerUserId: string) {
  return db.transaction(async () => {
    const [directStudents, directPartners, allStudents, allPartners] =
      await Promise.all([
        getDirectStudentCount(partnerUserId),
        getDirectPartnerCount(partnerUserId),
        getAllStudentCount(partnerUserId),
        getAllPartnerCount(partnerUserId),
      ]);

    return {
      directStudents,
      directPartners,
      allStudents,
      allPartners,
    };
  });
}
