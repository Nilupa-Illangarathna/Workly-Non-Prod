"use server";

import { auth } from "@/auth";
import { db } from "@/drizzle/db";
import { kyc } from "@/drizzle/schema";
import { supabase } from "@/lib/supabase";
import { kycSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const uploadKYC = async (formData: z.infer<typeof kycSchema>) => {
  const session = await auth();
  const user = session?.user;
  if (!user) return { error: "Unauthorized" };

  try {
    kycSchema.parse(formData);
    const paths = { front: "", back: "" };

    if (formData.type === "passport") {
      const fileExt = formData.idfront.name.split(".").pop();
      const path = `${user.id}/${new Date()}/passport.${fileExt}`;
      paths.front = path;
      paths.back = path;

      const { error } = await supabase.storage
        .from("kyc-documents")
        .upload(path, formData.idfront);

      if (error) throw error;
    } else {
      const fileExtFront = formData.idfront.name.split(".").pop();
      const pathFront = `${user.id}/${new Date()}/${
        formData.type
      }-front.${fileExtFront}`;
      paths.front = pathFront;

      const fileExtBack = formData.idfront.name.split(".").pop();
      const pathBack = `${user.id}/${new Date()}/${
        formData.type
      }-back.${fileExtBack}`;
      paths.back = pathBack;

      const { error: fronterror } = await supabase.storage
        .from("kyc-documents")
        .upload(pathFront, formData.idfront);

      const { error: backerror } = await supabase.storage
        .from("kyc-documents")
        .upload(pathBack, formData.idback as File);

      if (fronterror) throw fronterror;
      if (backerror) throw backerror;
    }

    // Create KYC record
    await db.insert(kyc).values({
      userid: user.id,
      type: formData.type,
      status: "pending",
      idfront: paths.front,
      idback: paths.back,
    });

    if (user.role === "student") {
      revalidatePath("/student/profile");
    } else if (user.role === "partner") {
      revalidatePath("/partner/profile");
    }
    revalidatePath("/admin/kyc");
    return { success: "KYC documents uploaded successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: error instanceof Error ? error.message : "Upload failed" };
  }
};
