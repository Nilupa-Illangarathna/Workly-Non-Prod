"use server";

import { db } from "@/drizzle/db";
import { payments } from "@/drizzle/schema";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";

export async function uploadPaymentSlip(file: File, type: string) {
  try {
    const session = await auth();

    // Upload to Supabase Storage
    const fileName = `${uuidv4()}`;

    // Validate file type
    if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
      throw new Error("Invalid file type. Allowed: JPG, PNG, PDF");
    }

    const { data, error } = await supabase.storage
      .from("payment-slips")
      .upload(fileName, file);

    if (error) throw new Error("File upload failed");

    // Insert into database
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/payment-slips/${data?.path}`;

    await db.insert(payments).values({
      amount: "0",
      type: type as "direct" | "bank" | "online",
      image: imageUrl,
      status: "pending",
      userid: session?.user?.id,
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Payment upload error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Payment processing failed",
    };
  }
}
