"use server";

import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { users } from "@/drizzle/schema";
import { passwordSchema } from "@/schemas/index";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import z from "zod";

export const changePassword = async (formData: FormData) => {
  const session = await auth();
  const user = session?.user;
  if (!user) return { error: "Unauthorized" };

  const rawData = {
    current: formData.get("current"),
    new: formData.get("new"),
    confirm: formData.get("confirm"),
  };

  try {
    const data = passwordSchema.parse(rawData);

    // Verify current password
    const [existing] = await db
      .select({ password: users.password })
      .from(users)
      .where(eq(users.id, user.id));

    const isValid = await bcrypt.compare(data.current, existing.password);
    if (!isValid) return { error: "Current password is incorrect" };

    // Update password
    const hashedPassword = await bcrypt.hash(data.new, 10);
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, user.id));

    revalidatePath("/profile");
    return { success: "Password updated successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Failed to update password" };
  }
};
