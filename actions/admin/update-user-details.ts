"use server";

import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { updateUserSchema } from "@/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const updateUserDetails = async (
  data: z.infer<typeof updateUserSchema>,
  userId: string,
  role: string
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
    const {
      firstname,
      lastname,
      fullname,
      nicnumber,
      dateofbirth,
      email,
      phone,
      whatsapp,
      address,
      district,
      postalcode,
      country,
    } = data;

    await db
      .update(users)
      .set({
        firstname,
        lastname,
        fullname,
        nicnumber,
        dateofbirth,
        email,
        phone,
        whatsapp,
        address,
        district,
        postalcode,
        country,
        updatedat: new Date(),
      })
      .where(eq(users.id, userId));

    if (role === "student") {
      revalidatePath("/student/profile");
    }
    if (role === "partner") {
      revalidatePath("/partner/profile");
    }
    revalidatePath("/admin/users/" + userId);

    return { success: "User details updated successfully" };
  } catch (error) {
    console.error("Error updating user details:", error);
    return { error: "Failed to update user details" };
  }
};
