"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ThemedLogoLink = ({
  href,
  className,
  imgWidth = 100,
  imgHeight = 24,
}: {
  href: string;
  className?: string;
  imgWidth?: number;
  imgHeight?: number;
}) => {
  const { theme, resolvedTheme } = useTheme();

  return (
    <Link href={href} className={className}>
      {theme === "light" && (
        <Image
          src="/Logo_for_light_theme.png"
          alt="Logo"
          width={imgWidth}
          height={imgHeight}
        />
      )}
      {theme === "dark" && (
        <Image
          src="/Logo_for_dark_theme.png"
          alt="Logo"
          width={imgWidth}
          height={imgHeight}
        />
      )}
      {theme === "system" && resolvedTheme === "light" && (
        <Image
          src="/Logo_for_light_theme.png"
          alt="Logo"
          width={imgWidth}
          height={imgHeight}
        />
      )}
      {theme === "system" && resolvedTheme === "dark" && (
        <Image
          src="/Logo_for_dark_theme.png"
          alt="Logo"
          width={imgWidth}
          height={imgHeight}
        />
      )}
    </Link>
  );
};

export default ThemedLogoLink;
