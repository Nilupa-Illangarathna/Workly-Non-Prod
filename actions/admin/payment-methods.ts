"use server";

import { db } from "@/drizzle/db";
import { paymentMethods } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { paymentMethodSchema } from "@/schemas";

export const addPaymentMethod = async (
  formData: z.infer<typeof paymentMethodSchema>,
  id: string
) => {
  const type = formData.type as string;
  const data = {
    type,
    email: formData.email as string,
    holder: formData.holder as string,
    bank: formData.bank as string,
    branch: formData.branch as string,
    number: formData.number as string,
  };

  try {
    await db.insert(paymentMethods).values({
      userid: id,
      ...data,
    });
  } catch {
    return { error: "Failed to add payment method" };
  }

  revalidatePath("/partner/profile");
  revalidatePath("/student/profile");
  return { success: "Payment method added" };
};

export const deletePaymentMethod = async (id: string) => {
  try {
    await db.delete(paymentMethods).where(eq(paymentMethods.id, id));
    revalidatePath("/partner/profile");
    return { success: "Payment method deleted successfully" };
  } catch (error) {
    console.error("Something went wrong: ", error as string);
    return { error: "Something went wrong!" };
  }
};
