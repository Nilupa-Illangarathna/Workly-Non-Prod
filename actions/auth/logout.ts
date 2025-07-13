"use server";

import { signOut } from "@/auth";
import { revalidatePath } from "next/cache";

export const signout = async () => {
  revalidatePath("/login");
  revalidatePath("/register");
  revalidatePath("/");

  await signOut({
    redirect: true,
    redirectTo: "/",
  });
};
