"use server";

import { db } from "@/drizzle/db";
import { users, partners } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function RejectPartner(userId: string) {
  try {
    await db.transaction(async (tx) => {
      // Update user status
      await tx
        .update(users)
        .set({ status: "rejected" })
        .where(eq(users.id, userId));

      // Update partner status and commission
      await tx
        .update(partners)
        .set({
          status: "rejected",
        })
        .where(eq(partners.userid, userId));
    });

    revalidatePath("/admin/registrations");
    revalidatePath("/admin/students");
    revalidatePath("/admin/registry");
    revalidatePath(`/admin/users/${userId}`);

    return { success: "Partner Rejected!" };
  } catch (error) {
    throw new Error("Partner rejection failed: " + error);
  }
}

export async function RejectStudent(userId: string) {
  try {
    await db.transaction(async (tx) => {
      // Update user status
      await tx
        .update(users)
        .set({ status: "rejected" })
        .where(eq(users.id, userId));
    });

    revalidatePath("/admin/registrations");
    revalidatePath("/admin/students");
    revalidatePath("/admin/registry");
    revalidatePath(`/admin/users/${userId}`);

    revalidatePath(`/admin/users/${userId}`);
    return { success: "Student Rejected!" };
  } catch (error) {
    throw new Error("Student rejection failed: " + error);
  }
}
