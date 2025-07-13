"use server";

import { cache } from "react";
import { auth } from "@/auth";
import StudentInvoiceComponent from "@/components/students/student-invoice";
import { db } from "@/drizzle/db";
import { commission_distributions, payments } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export interface InvoiceData {
  logo: string;
  user: {
    worklyId: string;
    name: string;
  };
  course: {
    name: string;
    fee: number;
    paid: number;
    remaining: number;
  };
  payments: {
    date: string;
    amount: number;
  }[];
}

const getInvoiceData = cache(async (userId: string) => {
  try {
    const [paymentsData, coursePaymentData] = await Promise.all([
      db
        .select()
        .from(payments)
        .where(
          and(eq(payments.userid, userId), eq(payments.status, "approved"))
        ),
      db
        .select({ amount: commission_distributions.amount })
        .from(commission_distributions)
        .where(eq(commission_distributions.category, "course_payment")),
    ]);

    return { paymentsData, coursePaymentData };
  } catch (error) {
    console.error("Invoice data error:", error);
    throw new Error("Failed to load invoice data");
  }
});

export default async function StudentInvoice() {
  const session = await auth();
  if (!session || !session.user)
    return <div>Please log in to view invoices</div>;
  const { user } = session;

  const { paymentsData, coursePaymentData } = await getInvoiceData(
    session.user.id
  );
  const totalPaid = paymentsData.reduce(
    (acc, payment) => acc + parseFloat(payment.amount),
    0
  );
  const course_payment =
    coursePaymentData.length > 0 ? parseFloat(coursePaymentData[0].amount) : 0;
  const remainingBalance = course_payment - totalPaid;

  const data: InvoiceData = {
    logo: "/Logo_for_dark_theme.png",
    user: {
      worklyId: user.worklyid,
      name: `${user.firstname} ${user.lastname}`,
    },
    course: {
      name: "Workly LMS",
      fee: course_payment,
      paid: totalPaid,
      remaining: remainingBalance,
    },
    payments: paymentsData.map((payment) => ({
      date: payment.createdat.toLocaleDateString(),
      amount: parseFloat(payment.amount),
    })),
  };

  return <StudentInvoiceComponent paymentData={data} />;
}
