"use server";

import { Registrations } from "@/app/admin/registrations/columns";
import { auth } from "@/auth";
import { db } from "@/drizzle/db";
import {
  commission_distributions,
  kyc,
  partners,
  partnerWithdrawals,
  paymentMethods,
  payments,
  referrals,
  users,
} from "@/drizzle/schema";
import { KYCSchema, TPendingPayment } from "@/schemas";
import { PaymentHistory } from "@/types";
import { and, desc, eq, sql } from "drizzle-orm";

export type Student = {
  id: string;
  createdAt: Date;
  loginId: string;
  worklyId: string;
  name: string;
  email: string;
  nic: string;
  courseFee: number;
  amountPaid: number;
  remainingBalance: number;
  regMethod: "Direct" | "Referral";
  level: number | null;
  kycStatus: string | null;
};

export async function getStudents(): Promise<Student[]> {
  return await db.transaction(
    async (tx) => {
      // Subquery with explicit alias for aggregated field
      const courseFeeResult = await tx
        .select()
        .from(commission_distributions)
        .where(eq(commission_distributions.category, "course_payment"));
      const courseFee =
        courseFeeResult.length > 0 ? parseFloat(courseFeeResult[0].amount) : 0;

      // Main query
      const students = await tx
        .select({
          id: users.id,
          createdAt: users.createdat,
          loginId: users.loginid,
          worklyId: users.worklyid,
          name: sql<string>`CONCAT(${users.firstname}, ' ', ${users.lastname})`.as(
            "full_name"
          ),
          email: users.email,
          nic: users.nicnumber,
          amountPaid:
            sql<number>`COALESCE(MAX(${payments.totalamount}::numeric), 0)`.as(
              "amountPaid"
            ),
          regMethod: sql<"Direct" | "Referral">`CASE 
            WHEN ${referrals.referredid} IS NOT NULL THEN 'Referral' 
            ELSE 'Direct' 
          END`.as("registration_method"),
          level: partners.level,
          kycStatus: kyc.status,
        })
        .from(users)
        .leftJoin(referrals, eq(users.id, referrals.referredid))
        .leftJoin(partners, eq(referrals.referrerid, partners.userid))
        .leftJoin(kyc, eq(users.id, kyc.userid))
        .leftJoin(payments, eq(users.id, payments.userid))
        .where(and(eq(users.role, "student"), eq(users.status, "approved")))
        .groupBy(users.id, referrals.referredid, partners.level, kyc.status);

      return students.map((student) => ({
        ...student,
        kycStatus: student.kycStatus || "N/A",
        courseFee: courseFee,
        remainingBalance: Math.max(17500 - student.amountPaid, 0),
      }));
    },
    {
      isolationLevel: "read committed",
      accessMode: "read only",
    }
  );
}

export async function getPendingUsers(): Promise<Registrations[]> {
  const courseFeeResult = await db
    .select()
    .from(commission_distributions)
    .where(eq(commission_distributions.category, "course_payment"));
  const courseFee =
    courseFeeResult.length > 0 ? parseFloat(courseFeeResult[0].amount) : 0;

  const results = await db
    .select({
      id: users.id,
      datetime: users.createdat,
      loginID: users.loginid,
      worklyID: users.worklyid,
      firstname: users.firstname,
      lastname: users.lastname,
      email: users.email,
      partnerLevel: partners.level,
      referredBy: referrals.referrerid,
      amountPaid:
        sql<number>`COALESCE(MAX(${payments.totalamount}::numeric), 0)`.as(
          "amountPaid"
        ),
      paymentSlip: sql<string>`
        COALESCE(
          (SELECT ${payments.image} 
           FROM ${payments}
           WHERE ${payments.userid} = ${users.id}
           ORDER BY ${payments.createdat} DESC
           LIMIT 1
          ), 
          ''
        )`.as("paymentSlip"),
    })
    .from(users)
    .leftJoin(referrals, eq(users.id, referrals.referredid))
    .leftJoin(partners, eq(referrals.referrerid, partners.userid))
    .leftJoin(payments, eq(users.id, payments.userid))
    .where(and(eq(users.status, "pending")))
    .groupBy(
      users.id,
      referrals.referredid,
      referrals.referrerid,
      partners.level
    );

  return results.map((row) => ({
    id: row.id,
    datetime: row.datetime.toISOString(),
    loginID: row.loginID,
    worklyID: row.worklyID,
    name: `${row.firstname} ${row.lastname}`,
    email: row.email,
    regMethod: row.referredBy ? "Referral" : "Direct",
    level: row.partnerLevel !== null ? row.partnerLevel.toString() : "N/A",
    courseFee: courseFee,
    amountPaid: row.amountPaid,
    paymentSlip: row.paymentSlip,
    remainingBalance: Math.max(17500 - row.amountPaid, 0),
  }));
}

// Getting partner details from users and partners table
export async function getPartnerDetails(id: string) {
  const [partner] = await db
    .select({
      id: users.id,
      worklyId: users.worklyid,
      loginId: users.loginid,
      phone: users.phone,
      whatsapp: users.whatsapp,
      email: users.email,
      isEmailVerified: users.is_email_verified,
      isPhoneVerified: users.is_phone_verified,
      firstName: users.firstname,
      lastName: users.lastname,
      status: users.status,
      level: partners.level,
      nicNumber: users.nicnumber,
      dateofbirth: users.dateofbirth,
      address: users.address,
      language: users.language,
      district: users.district,
      country: users.country,
      createdat: users.createdat,
      deletedat: users.deletedat,
      commissionrate: partners.commissionrate,
      amount: partners.amount,
    })
    .from(users)
    .leftJoin(partners, eq(users.id, partners.userid))
    .where(eq(users.id, id));

  return partner;
}

export const getPendingPayments = async (): Promise<TPendingPayment[]> => {
  const results = await db.query.payments.findMany({
    where: eq(payments.status, "pending"),
    with: {
      user: {
        columns: {
          id: true,
          worklyid: true,
          firstname: true,
          lastname: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: (payments, { desc }) => [desc(payments.createdat)],
  });

  return results.map((payment) => ({
    ...payment,
    createdat: new Date(payment.createdat),
    user: {
      id: payment?.user?.id || "",
      worklyid: payment?.user?.worklyid || "",
      name: `${payment?.user?.firstname} ${payment?.user?.lastname}` || "",
      email: payment?.user?.email || "",
      phone: payment?.user?.phone || "",
    },
  }));
};

export const getPendingKYCs = async () => {
  const results = await db.query.kyc.findMany({
    where: eq(kyc.status, "pending"),
    with: {
      user: {
        columns: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: (kyc, { desc }) => [desc(kyc.createdat)],
  });
  return results.map((kyc) =>
    KYCSchema.parse({
      id: kyc.id,
      userId: kyc.userid,
      idFront: kyc.idfront,
      idBack: kyc.idback,
      status: kyc.status,
      type: kyc.type,
      createdAt: new Date(kyc.createdat),
      updatedAt: new Date(kyc.updatedat),
      user: {
        id: kyc.user?.id || "",
        firstname: kyc.user?.firstname || "",
        lastname: kyc.user?.lastname || "",
        email: kyc.user?.email || "",
        phone: kyc.user?.phone || "",
      },
    })
  );
};

export const getKYCStatus = async () => {
  const session = await auth();
  const user = session?.user;
  if (!user) return null;

  return db.query.kyc.findFirst({
    where: eq(kyc.userid, user.id),
  });
};

export const getPaymentHistory = async (): Promise<PaymentHistory[]> => {
  return await db
    .select({
      id: payments.id,
      status: payments.status,
      type: payments.type,
      userid: payments.userid,
      createdat: payments.createdat,
      amount: payments.amount,
      totalamount: payments.totalamount,
      image: payments.image,
      worklyid: users.worklyid,
      name: sql<string>`CONCAT(${users.firstname}, ' ', ${users.lastname})`.as(
        "full_name"
      ),
      email: users.email,
      phone: users.phone,
    })
    .from(payments)
    .leftJoin(users, eq(payments.userid, users.id))
    .where(and(eq(payments.status, "approved")))
    .orderBy(desc(payments.createdat));
};

export const getWithdrawalHistory = async () => {
  return await db
    .select({
      id: partnerWithdrawals.id,
      amount: partnerWithdrawals.amount,
      status: partnerWithdrawals.status,
      createdAt: partnerWithdrawals.createdAt,
      partner: {
        worklyid: users.worklyid,
        name: sql`concat(${users.firstname}, ' ', ${users.lastname})`,
        email: users.email,
        phone: users.phone,
      },
      paymentMethod: {
        id: paymentMethods.id,
        type: paymentMethods.type,
        email: paymentMethods.email,
        bank: paymentMethods.bank,
        holder: paymentMethods.holder,
        number: paymentMethods.number,
        branch: paymentMethods.branch,
      },
    })
    .from(partnerWithdrawals)
    .innerJoin(partners, eq(partnerWithdrawals.partner_id, partners.userid))
    .innerJoin(users, eq(partners.userid, users.id))
    .innerJoin(
      paymentMethods,
      eq(partnerWithdrawals.method_id, paymentMethods.id)
    )
    .where(eq(partnerWithdrawals.status, "approved"))
    .orderBy(desc(partnerWithdrawals.createdAt));
};

export const getAdminWithdrawals = async () => {
  return await db
    .select({
      id: partnerWithdrawals.id,
      amount: partnerWithdrawals.amount,
      status: partnerWithdrawals.status,
      createdAt: partnerWithdrawals.createdAt,
      partner: {
        worklyid: users.worklyid,
        name: sql`concat(${users.firstname}, ' ', ${users.lastname})`,
        email: users.email,
        phone: users.phone,
        totalEarnings: partners.amount,
      },
      paymentMethod: {
        id: paymentMethods.id,
        type: paymentMethods.type,
        email: paymentMethods.email,
        bank: paymentMethods.bank,
        holder: paymentMethods.holder,
        number: paymentMethods.number,
        branch: paymentMethods.branch,
      },
    })
    .from(partnerWithdrawals)
    .innerJoin(partners, eq(partnerWithdrawals.partner_id, partners.userid))
    .innerJoin(users, eq(partners.userid, users.id))
    .innerJoin(
      paymentMethods,
      eq(partnerWithdrawals.method_id, paymentMethods.id)
    )
    .where(eq(partnerWithdrawals.status, "pending"))
    .orderBy(desc(partnerWithdrawals.createdAt));
};

export const getPaymentMethodDetails = async (methodId: string) => {
  return await db.query.paymentMethods.findFirst({
    where: eq(paymentMethods.id, methodId),
    columns: {
      type: true,
      email: true,
      bank: true,
      holder: true,
      number: true,
      branch: true,
    },
  });
};

export async function getAllUsersWithLevels(): Promise<
  {
    id: string;
    loginid: string;
    nicnumber: string;
    worklyid: string;
    name: string;
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
    sponsor: string;
    commissionrate: string;
    registration_method: string;
    kyc_status: string;
    referrals: number;
    balance: number;
  }[]
> {
  const usersData = await db.execute(sql`
    SELECT 
      u.id,
      u.loginid,
      u.nicnumber,
      u.worklyid,
      CONCAT(u.firstname, ' ', u.lastname) AS name,
      u.district,
      u.phone,
      u.whatsapp,
      u.email,
      u.createdat,
      u.status,
      u.role,
      p.amount AS balance, -- Balance from user's own partner record
      (
        SELECT COALESCE(COUNT(r_count.id)::numeric, 0) 
        FROM ${referrals} r_count 
        WHERE r_count.referrerid = u.id
      ) AS referrals, -- Number of users referred by u
      CASE
        WHEN u.role IN ('partner', 'student_partner') THEN p.level -- User's own partner level
        WHEN u.role = 'student' THEN 
          COALESCE(
            (SELECT sp.level FROM ${partners} sp WHERE sp.userid = r.referrerid), -- Sponsor's partner level
            0
          ) + 1
        ELSE 0
      END AS level,
      (
        SELECT COALESCE(SUM(pay.amount)::numeric, 0) 
        FROM ${payments} pay 
        WHERE pay.userid = u.id AND pay.status = 'approved'
      ) AS totalpaid,
      s.worklyid AS sponsor_worklyid, -- Sponsor's worklyid
      s.firstname AS sponsor_firstname, -- Sponsor's firstname
      s.lastname AS sponsor_lastname, -- Sponsor's lastname
      CONCAT(s.firstname, ' ', s.lastname) AS sponsor, -- Sponsor's full name
      COALESCE(p.commissionrate::text, '0') AS commissionrate, -- User's own commission rate
      CASE
        WHEN r.referrerid IS NULL THEN 'Direct' -- Check if user u was referred
        ELSE 'Referral'
      END AS registration_method,
      k.status AS kyc_status
    FROM ${users} u
    LEFT JOIN ${partners} p ON u.id = p.userid -- For user's own partner details
    LEFT JOIN ${referrals} r ON u.id = r.referredid -- To find who referred user 'u'
    LEFT JOIN ${users} s ON r.referrerid = s.id -- To get details of the sponsor 's'
    LEFT JOIN ${kyc} k ON u.id = k.userid -- For user's KYC status
    WHERE u.status != 'rejected'
    -- No explicit GROUP BY needed here if joins are 1:1 or 1:0 and aggregations are scalar subqueries
    ORDER BY level DESC, u.createdat;
  `);

  return usersData.map((user) => ({
    id: user.id as string,
    loginid: user.loginid as string,
    nicnumber: user.nicnumber as string,
    worklyid: user.worklyid as string,
    name: user.name as string,
    district: user.district as string,
    phone: user.phone as string,
    whatsapp: user.whatsapp as string,
    email: user.email as string,
    createdat: new Date(user.createdat as string),
    status: user.status as string,
    role: user.role as string,
    balance: user.balance as number,
    referrals: user.referrals as number,
    level: user.level as number,
    totalpaid: user.totalpaid as number,
    sponsor_worklyid: user.sponsor_worklyid as string,
    sponsor_firstname: user.sponsor_firstname as string,
    sponsor_lastname: user.sponsor_lastname as string,
    sponsor: user.sponsor as string,
    commissionrate: user.commissionrate as string,
    registration_method: user.registration_method as string,
    kyc_status: user.kyc_status as string,
  }));
}
