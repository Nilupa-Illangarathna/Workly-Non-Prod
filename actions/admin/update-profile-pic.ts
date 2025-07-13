"use server";

import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { formSchema } from "@/components/upload-profile-pic";
import { eq } from "drizzle-orm";

export const uploadProfilePic = async (
  formData: z.infer<typeof formSchema>,
  id: string,
  role: string
): Promise<{ success?: string; error?: string }> => {
  try {
    const fileExt = formData.file.name.split(".").pop();
    const fileName = `${id}.${fileExt}`;

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
      .where(eq(users.id, id));

    if (role === "student") {
      revalidatePath("/student/profile");
    } else if (role === "partner") {
      revalidatePath("/partner/profile");
    }
    revalidatePath(`/admin/users/${id}`);

    return { success: "Profile picture uploaded successfully" };
  } catch {
    return { error: "Unexpected server error occurred" };
  }
};
