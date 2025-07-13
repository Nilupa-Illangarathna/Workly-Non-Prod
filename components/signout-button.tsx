"use client";

import { signout } from "@/actions/auth/logout";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function SignOut({
  className,
  buttonVariant,
}: {
  className?: string;
  buttonVariant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}) {
  async function handleSignOut() {
    await signout();
  }

  return (
    <Button
      className={cn("w-full", className)}
      onClick={handleSignOut}
      variant={buttonVariant || "ghost"}
      type="submit">
      <LogOut />
      <span>Sign out</span>
    </Button>
  );
}
