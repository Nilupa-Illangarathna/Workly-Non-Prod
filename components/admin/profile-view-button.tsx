"use client";

import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { useTransitionRouter } from "next-view-transitions";
import { Eye } from "lucide-react";

const ProfileViewBtn = ({ id }: { id: string }) => {
  const router = useTransitionRouter();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Link
            href={`/admin/users/${id}`}
            className={buttonVariants({
              variant: "outline",
              size: "icon",
            })}
            onClick={(e) => {
              e.preventDefault();
              router.push(`/admin/users/${id}`, {
                onTransitionReady: pageAnimation,
              });
            }}>
            <Eye />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>View Profile</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const pageAnimation = () => {
  document.documentElement.animate(
    [
      { opacity: 1, scale: 1, transform: "translateX(0)" },
      { opacity: 0.5, scale: 0.9, transform: "translateX(100px)" },
    ],
    {
      duration: 1000,
      easing: "cubic-bezier(0.76, 0, 0.24, 1)",
      fill: "forwards",
      pseudoElement: "::view-transition-old(root)",
    }
  );

  document.documentElement.animate(
    [{ transform: "translateX(-100%)" }, { transform: "translateX(0)" }],
    {
      duration: 1000,
      easing: "cubic-bezier(0.76, 0, 0.24, 1)",
      fill: "forwards",
      pseudoElement: "::view-transition-new(root)",
    }
  );
};

export default ProfileViewBtn;
