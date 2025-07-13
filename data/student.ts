"use server";

import { db } from "@/drizzle/db";
import { payments } from "@/drizzle/schema";
import { and, eq, ne, sum } from "drizzle-orm";

export const getStudentBalance = async (userid: string) => {
  const [paymentDetails] = await db
    .select({ total: sum(payments.amount) })
    .from(payments)
    .where(and(eq(payments.userid, userid), ne(payments.status, "rejected")));

  const totalAmount = paymentDetails.total || 0;

  return totalAmount;
};

export const getPendingPaymentslip = async (userid: string) => {
  const paymentDetails = await db
    .select()
    .from(payments)
    .where(and(eq(payments.userid, userid), eq(payments.status, "pending")))
    .limit(1);

  return paymentDetails[0] && paymentDetails[0].image
    ? paymentDetails[0].image
    : null;
};

export const getPaymentsByUser = async (id: string) => {
  return db.query.payments.findMany({
    where: (payments, { eq }) => eq(payments.userid, id),
    orderBy: (payments, { desc }) => [desc(payments.createdat)],
  });
};
