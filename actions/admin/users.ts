"use server";

import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import { partners, referrals, users } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";

export async function deleteUser(userId: string) {
  await db
    .update(users)
    .set({ deletedat: new Date() })
    .where(eq(users.id, userId));

  revalidatePath("/admin/registrations");
  revalidatePath("/admin/students");
  revalidatePath("/admin/registry");
  revalidatePath(`/admin/users/${userId}`);
}

export async function updateUser(
  userId: string,
  data: Partial<typeof users.$inferInsert>
) {
  await db.update(users).set(data).where(eq(users.id, userId));

  revalidatePath(`/admin/users/${userId}`);
}

export async function activateStudent(studentId: string) {
  try {
    await db
      .update(users)
      .set({ status: "approved" })
      .where(eq(users.id, studentId));

    revalidatePath("/admin/registrations");
    revalidatePath("/admin/students");
    revalidatePath("/admin/registry");
    revalidatePath(`/admin/users/${studentId}`);
    return { success: "Student activated successfully" };
  } catch (error) {
    throw new Error("Failed to activate student: " + error);
  }
}

export async function activatePartner(
  userId: string,
  commission: number,
  company?: string
) {
  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ status: "approved", role: "partner" })
      .where(eq(users.id, userId));

    const sponsor = await tx
      .select({ referrerid: referrals.referrerid })
      .from(referrals)
      .where(eq(referrals.referredid, userId));

    if (!sponsor[0]?.referrerid) throw new Error("No sponsor found");

    const sponsorLevel = await tx
      .select({ level: partners.level })
      .from(partners)
      .where(eq(partners.userid, sponsor[0].referrerid));

    await tx.insert(partners).values({
      userid: userId,
      status: "approved",
      level: sponsorLevel[0]?.level + 1,
      commissionrate: commission.toString(),
      companyname: company || null,
    });
  });

  revalidatePath("/admin/registrations");
  revalidatePath("/admin/students");
  revalidatePath("/admin/registry");
  revalidatePath(`/admin/users/${userId}`);

  return { success: "Partner activated successfully" };
}

export async function activateStudentPartner(
  userId: string,
  commission: number,
  company?: string
) {
  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ status: "approved", role: "student_partner" })
      .where(eq(users.id, userId));

    await tx.insert(partners).values({
      userid: userId,
      status: "approved",
      level: 0, // Student partners start at level 0
      commissionrate: commission.toString(),
      companyname: company || null,
    });
  });

  revalidatePath("/admin/registrations");
  revalidatePath("/admin/students");
  revalidatePath("/admin/registry");
  revalidatePath(`/admin/users/${userId}`);

  return { success: "Student partner activated successfully" };
}

export async function demotePartner(userId: string) {
  await db.transaction(async (tx) => {
    // Update user role
    await tx.update(users).set({ role: "student" }).where(eq(users.id, userId));

    // Remove partner entry
    await tx.delete(partners).where(eq(partners.userid, userId));
  });

  revalidatePath("/partner/users");
  revalidatePath("/admin/registrations");
  revalidatePath("/admin/students");
  revalidatePath("/admin/registry");
  revalidatePath(`/admin/users/${userId}`);
}

export async function demoteStudentPartner(userId: string) {
  await db.transaction(async (tx) => {
    // Update user role
    await tx
      .update(users)
      .set({ role: "student_partner" })
      .where(eq(users.id, userId));
  });

  revalidatePath("/partner/users");
  revalidatePath("/admin/registrations");
  revalidatePath("/admin/students");
  revalidatePath("/admin/registry");
  revalidatePath(`/admin/users/${userId}`);
}

export async function addSponsor(
  studentId: string,
  sponsorWorklyId: string
): Promise<{ error?: string; success?: string }> {
  try {
    // Check if the sponsor exists
    const sponsor = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.worklyid, sponsorWorklyId),
          eq(users.role, "partner"),
          eq(users.status, "approved")
        )
      )
      .limit(1);

    if (sponsor.length === 0) {
      return { error: "Sponsor not found or not approved." };
    }

    // Add the referral
    await db.insert(referrals).values({
      referrerid: sponsor[0].id,
      referredid: studentId,
    });

    revalidatePath(`/admin/users/${studentId}`);
    revalidatePath("/admin/registrations");
    revalidatePath("/admin/registry");

    return { success: "Sponsor added successfully." };
  } catch (error) {
    return {
      error: `An unexpected error occurred while adding the sponsor: ${error}`,
    };
  }
}
