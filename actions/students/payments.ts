"use server";

import { db } from "@/drizzle/db";
import { payments } from "@/drizzle/schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { paymentSchema } from "@/schemas";

export const uploadPayment = async (formData: FormData) => {
  const session = await auth();
  const user = session?.user;
  if (!user) return { error: "Unauthorized" };

  try {
    const data = {
      amount: formData.get("amount"),
      type: formData.get("type"),
      file: formData.get("file"),
    };

    const parsed = paymentSchema.parse(data);

    const fileExt = parsed.file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("payment-slips")
      .upload(fileName, parsed.file);

    if (error) throw error.message;

    await db.insert(payments).values({
      userid: user.id,
      amount: parsed.amount,
      totalamount: parsed.amount,
      type: parsed.type,
      image: fileName,
      status: "pending",
    });

    revalidatePath("/student/profile");
    revalidatePath("/admin/payments");

    return { success: "Payment slip uploaded successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: error instanceof Error ? error.message : "Upload failed" };
  }
};
