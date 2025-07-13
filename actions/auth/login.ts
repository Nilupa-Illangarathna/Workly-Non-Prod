"use server";

import { signIn } from "@/auth";
import { loginSchema } from "@/schemas";
import * as z from "zod";

export const loginUser = async (credentials: z.infer<typeof loginSchema>) => {
  try {
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
  } catch (error) {
    if (error == "Invalid_Credentials.") {
      return { error: "Invalid credentials" };
    }

    if (error === "USER_NOT_FOUND") {
      return { error: "User not found" };
    }
    return { error: "Something went wrong! check your credentials" };
  }
};
