"use server";

import { db } from "@/drizzle/db";
import { users, referrals } from "@/drizzle/schema";
import { registerSchema } from "@/schemas";
import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";

export const registerUser = async (data: z.infer<typeof registerSchema>) => {
  // Check if the user is already registered
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.loginid, data.loginId));

  if (existingUser.length > 0) {
    return { error: "User already registered" };
  }

  // check the validity of the sponsor
  if (data.sponsor) {
    const sponsorUser = (
      await db.select().from(users).where(eq(users.worklyid, data.sponsor!))
    )[0];

    if (
      !sponsorUser ||
      sponsorUser.role === "student" ||
      sponsorUser.status !== "approved"
    ) {
      return { error: "Invalid sponsor" };
    }
  }

  // Hash the password before storing
  const hashedPassword = await hash(data.password, 10);

  // Generating the worklyID
  const userCount = await db.select({ count: count() }).from(users);
  const countInt = userCount[0].count;
  const last3Digits = data.phone.slice(-3);
  const worklyId = `WCS${countInt + 1}${last3Digits}`;

  try {
    await db.transaction(async (tx) => {
      // Insert the user into the users table with pending status
      const newUser = await tx
        .insert(users)
        .values({
          worklyid: worklyId,
          firstname: data.firstName,
          lastname: data.lastName,
          nicnumber: data.nicNumber,
          dateofbirth: new Date(data.dateOfBirth),
          phone: data.phone,
          whatsapp: data.whatsapp,
          email: data.email,
          is_email_verified: false,
          is_phone_verified: false,
          language: data.language,
          address: data.address,
          district: data.district,
          country: data.country,
          loginid: data.loginId,
          password: hashedPassword, // Make sure to hash the password before storing it
          role: "student",
          status: "pending",
        })
        .returning();

      if (data.sponsor) {
        const sponsorUser = (
          await tx.select().from(users).where(eq(users.worklyid, data.sponsor))
        )[0];

        // Insert the referral into the referrals table
        await tx.insert(referrals).values({
          referrerid: sponsorUser.id,
          referredid: newUser[0].id,
        });
      }
    });
  } catch (error) {
    return { error: `Failed to Insert Data: ${error as string}` };
  }

  const credentials = {
    loginId: data.loginId,
    password: data.password,
  };

  const result = await signIn("credentials", {
    redirect: false,
    ...credentials,
  });

  if (result?.error) {
    if (result.error === "Invalid_Credentials.") {
      return { error: "Invalid credentials" };
    }

    if (result.error === "USER_NOT_FOUND") {
      return { error: "User not found" };
    }
  }

  return { success: true };
};
