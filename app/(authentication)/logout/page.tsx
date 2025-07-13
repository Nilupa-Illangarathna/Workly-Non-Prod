"use server";

import { signOut } from "@/auth";
import React from "react";

const LogoutPage = async () => {
  // sign out
  await signOut({ redirect: true, redirectTo: "/login" });

  return <div>LogoutPage</div>;
};

export default LogoutPage;
