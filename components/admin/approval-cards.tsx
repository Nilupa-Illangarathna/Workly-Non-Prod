"use client";

import type React from "react";

import {
  UserCheck,
  Receipt,
  Shield,
  Wallet2,
  HeadphonesIcon,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

interface ApprovalCard {
  title: string;
  count: number;
  href: string;
  icon: React.ElementType;
}

const approvalCards: ApprovalCard[] = [
  {
    title: "Pending User Approvals",
    count: 0,
    href: "/admin/registrations",
    icon: UserCheck,
  },
  {
    title: "Course Payment Slip Approvals",
    count: 0,
    href: "/admin/payments",
    icon: Receipt,
  },
  {
    title: "KYC Approvals",
    count: 0,
    href: "/admin/kyc",
    icon: Shield,
  },
  {
    title: "Pending Withdraw Approvals",
    count: 0,
    href: "/admin/withdrawals",
    icon: Wallet2,
  },
  {
    title: "Active Support Tickets",
    count: 0,
    href: "/admin/support",
    icon: HeadphonesIcon,
  },
];

export function ApprovalCards({
  pendingUsers,
  pendingPayments,
  pendingWithdrawals,
  pendingKyc,
}: {
  pendingUsers: number;
  pendingPayments: number;
  pendingWithdrawals: number;
  pendingKyc: number;
}) {
  approvalCards[0].count = pendingUsers;
  approvalCards[1].count = pendingPayments;
  approvalCards[2].count = pendingKyc;
  approvalCards[3].count = pendingWithdrawals;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {approvalCards.map((card, index) => (
        <Card
          key={index}
          className="relative transition-all duration-300 hover:shadow-md bg-card border border-border/50 cursor-pointer">
          <CardContent>
            <div className="h-24 w-full flex flex-col !justify-between">
              <div className="flex items-start gap-x-3">
                <div className="p-2 rounded-sm bg-muted w-fit">
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
              </div>
              <div className="w-full flex items-end justify-between">
                <p className="text-2xl font-bold text-accent-foreground">
                  {card.count}
                </p>
                <Link
                  href={card.href}
                  className="flex gap-x-1 items-center text-sm text-primary hover:underline hover:text-primary/80 transition-all font-medium">
                  View <ChevronRight width={16} />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
