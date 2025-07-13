import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { db } from "@/drizzle/db";
import { commission_distributions, payments } from "@/drizzle/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { and, eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const amount = formData.get("amount");
  const file = formData.get("file") as File;
  let id = formData.get("id") as string;

  if (!id) {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    id = session?.user.id;
  }

  try {
    // Validate inputs
    if (!file || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [oldTotalAmount, coursePayment] = await Promise.all([
      db
        .select({ total: sql<number>`sum(amount)` })
        .from(payments)
        .where(and(eq(payments.userid, id), eq(payments.status, "approved"))),

      db
        .select()
        .from(commission_distributions)
        .where(eq(commission_distributions.category, "course_payment")),
    ]);

    const oldTotalAmountValue = Number(oldTotalAmount[0]?.total) || 0;
    const coursePaymentValue = Number(coursePayment[0]?.amount) || 0;
    const newTotalAmount = oldTotalAmountValue + Number(amount);

    if (newTotalAmount > coursePaymentValue) {
      throw new Error(
        "Payment exceeds the course payment: " + coursePaymentValue.toString()
      );
    }

    // Upload to Supabase
    const fileExt = file.name.split(".").pop();
    const fileName = `${id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("payment-slips")
      .upload(fileName, file);

    if (uploadError) {
      return NextResponse.json(
        { error: "File upload failed" },
        { status: 500 }
      );
    }

    // Create payment record
    await db.insert(payments).values({
      userid: id,
      amount: amount.toString(),
      totalamount: newTotalAmount.toString(),
      type: "bank",
      image: fileName,
      status: "pending",
    });

    revalidatePath("/student/profile");
    revalidatePath("/admin/payments");

    return NextResponse.json(
      { success: "Payment uploaded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading payment:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
