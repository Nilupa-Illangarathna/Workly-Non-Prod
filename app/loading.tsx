"use client";

import ThemedLogoLink from "@/components/themed-logo-link";
import { PropagateLoader } from "react-spinners";

export default function GlobalLoading() {
  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center gap-y-8 overflow-hidden bg-background">
      <ThemedLogoLink href="/" className="" imgHeight={80} imgWidth={120} />
      <PropagateLoader color="#4fa94d" size={12} speedMultiplier={1} />
    </div>
  );
}
