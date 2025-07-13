"use server";

import { auth } from "@/auth";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { updateUserSchema } from "@/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const updateUserDetails = async (
  data: z.infer<typeof updateUserSchema>
) => {
  // Logic to update user details in the database
  // This function should be called from the client-side component when the form is submitted
  // It should handle the API call to update user details and return the response
  // Example:
  // const response = await fetch('/api/update-user', {
  //   method: 'POST',
  //   body: JSON.stringify(userDetails),
  // });
  // return response;

  try {
    const session = await auth();
    const user = session?.user;
    if (!user) return { error: "Unauthorized" };

    const {
      firstname,
      lastname,
      fullname,
      email,
      phone,
      whatsapp,
      address,
      district,
      postalcode,
    } = data;

    await db
      .update(users)
      .set({
        firstname,
        lastname,
        fullname,
        email,
        phone,
        whatsapp,
        address,
        district,
        postalcode,
        updatedat: new Date(),
      })
      .where(eq(users.id, user.id));

    if (user.role === "student") {
      revalidatePath("/student/profile");
    }
    if (user.role === "partner") {
      revalidatePath("/partner/profile");
    }

    return { success: "User details updated successfully" };
  } catch (error) {
    console.error("Error updating user details:", error);
    return { error: "Failed to update user details" };
  }
};
