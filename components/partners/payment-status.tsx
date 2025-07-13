// components/payment-status.tsx
"use client";

import { Badge } from "@/components/ui/badge";

export function PaymentStatus({ totalPaid }: { totalPaid: number }) {
  const COURSE_FEE = 17500; // Should come from system config

  const getStatus = () => {
    if (totalPaid >= COURSE_FEE) {
      return {
        text: `Paid $${COURSE_FEE}`,
        style: "bg-green-100 text-green-800",
      };
    }

    if (totalPaid > 0) {
      return {
        text: `Paid $${totalPaid}, Pending $${COURSE_FEE - totalPaid}`,
        style: "bg-yellow-100 text-yellow-800",
      };
    }

    return {
      text: `Pending $${COURSE_FEE}`,
      style: "bg-muted text-muted-foreground",
    };
  };

  const status = getStatus();

  return <Badge className={status.style}>{status.text}</Badge>;
}
