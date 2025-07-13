"use server";

import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { formSchema } from "@/components/upload-profile-pic";
import { eq } from "drizzle-orm";

export const uploadProfilePic = async (
  formData: z.infer<typeof formSchema>
): Promise<{ success?: string; error?: string }> => {
  const session = await auth();
  const user = session?.user;
  if (!user) return { error: "Unauthorized" };

  try {
    const fileExt = formData.file.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("profile-pic")
      .upload(fileName, formData.file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) return { error: "Failed to upload image" };

    await db
      .update(users)
      .set({ profilepic: fileName })
      .where(eq(users.id, user.id));

    if (user.role === "student") {
      revalidatePath("/student/profile");
    } else if (user.role === "partner") {
      revalidatePath("/partner/profile");
    }
    revalidatePath(`/admin/users/${user.id}`);

    return { success: "Profile picture uploaded successfully" };
  } catch {
    return { error: "Unexpected server error occurred" };
  }
};
