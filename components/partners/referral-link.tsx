"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

const ReferralLink: React.FC<{ worklyid: string }> = ({ worklyid }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return <div className="h-10 w-full bg-accent" />;

  return (
    <div className="w-full md:w-1/2">
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <Input
          value={`https://lms.workly.cloud/register?ref=${worklyid}`}
          readOnly
          className="text-xs sm:text-sm"
        />
        <Button
          onClick={() => {
            navigator.clipboard.writeText(
              `https://lms.workly.cloud/register?ref=${worklyid}`
            );
            toast.success("Copied to clipboard!");
          }}
          size="sm"
          className="text-xs sm:text-sm w-full sm:w-auto">
          Copy Link
        </Button>
      </div>
    </div>
  );
};

export default ReferralLink;
