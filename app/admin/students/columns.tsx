"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Student } from "./page";
import { ArrowUpDown } from "lucide-react";
import UpdateStudentPayments from "@/components/admin/update-student-payment";
import { PromoteToPartner } from "@/components/admin/promote-to-partner";
import ProfileViewBtn from "@/components/admin/profile-view-button";

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Reg Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      // parse the date type to readable format
      const date = new Date(row.getValue("createdAt")).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return <p>{date}</p>;
    },
  },
  {
    accessorKey: "loginId",
    header: "Login ID",
  },
  {
    accessorKey: "worklyId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Workly ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "nic",
    header: "NIC",
  },
  // {
  //   accessorKey: "courseFee",
  //   header: "Course Fee",
  //   cell: ({ row }) => `${parseFloat(row.getValue("courseFee")).toFixed(2)}`,
  // },
  {
    accessorKey: "amountPaid",
    header: "Amount Paid",
    cell: ({ row }) => `${parseFloat(row.getValue("amountPaid")).toFixed(2)}`,
  },
  // {
  //   accessorKey: "remainingBalance",
  //   header: "Remaining Balance",
  //   cell: ({ row }) =>
  //     `${parseFloat(row.getValue("remainingBalance")).toFixed(2)}`,
  // },
  {
    accessorKey: "regMethod",
    header: "Reg. Method",
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => {
      const levels = [
        "Top Manager",
        "Sub Company",
        "Sub 1",
        "Sub 2",
        "Sub 3",
        "Student",
      ];
      return row.original.level !== null
        ? levels[Number(row.original.level) + 1]
        : "N/A";
    },
  },
  {
    accessorKey: "kycStatus",
    header: "KYC Approval",
    cell: ({ row }) => (
      <Badge
        variant={
          row.getValue("kycStatus") === "Approved" ? "default" : "destructive"
        }>
        {row.getValue("kycStatus")}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <TooltipProvider key={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <UpdateStudentPayments studentid={row.original.id} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Update Payment</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {row.getValue("level") === -1 && (
          <TooltipProvider key={1}>
            <Tooltip>
              <TooltipTrigger asChild>
                <PromoteToPartner
                  userId={row.original.id}
                  type="icon"
                  level={Number(row.getValue("level")) + 1}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Promote to a Partner</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <ProfileViewBtn id={row.original.id} />
      </div>
    ),
  },
];
