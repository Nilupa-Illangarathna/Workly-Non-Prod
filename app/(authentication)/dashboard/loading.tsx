"use client";

import Image from "next/image";
import { InfinitySpin } from "react-loader-spinner";

export default function GlobalLoading() {
  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-background">
      <Image
        src="/Logo_for_dark_theme.png"
        alt="Workly.cloud logo"
        className="absolute top-10 left-10"
        width={150}
        height={150}
        priority
      />
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <InfinitySpin width="200" color="#4fa94d" />
      </div>
    </div>
  );
}
