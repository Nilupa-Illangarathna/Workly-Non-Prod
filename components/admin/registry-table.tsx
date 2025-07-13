"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/app/admin/registry/data-table";
import { adminColumns } from "@/app/admin/registry/columns";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const getLevelTabs = () => {
  return [
    {
      name: "Top Managers",
      value: "top-managers",
      level: 0,
      color: "data-[state=active]:!bg-primary data-[state=active]:text-white",
    },
    {
      name: "Sub Companies",
      value: "sub-companies",
      level: 1,
      color: "data-[state=active]:!bg-primary data-[state=active]:text-white",
    },
    {
      name: "Sub C1",
      value: "sub-c1",
      level: 2,
      color: "data-[state=active]:!bg-primary data-[state=active]:text-white",
    },
    {
      name: "Sub C2",
      value: "sub-c2",
      level: 3,
      color: "data-[state=active]:!bg-primary data-[state=active]:text-white",
    },
    {
      name: "Sub C3",
      value: "sub-c3",
      level: 4,
      color: "data-[state=active]:!bg-primary data-[state=active]:text-white",
    },
    {
      name: "Sub S4",
      value: "sub-s4",
      level: 5,
      color: "data-[state=active]:!bg-primary data-[state=active]:text-white",
    },
  ];
};

interface AdminRegistryTableProps {
  data: {
    id: string;
    loginid: string;
    nicnumber: string;
    worklyid: string;
    name: string;
    district: string;
    phone: string;
    whatsapp: string;
    email: string;
    createdat: Date;
    status: string;
    role: string;
    level: number;
    totalpaid: number;
    sponsor_worklyid: string;
    sponsor_firstname: string;
    sponsor_lastname: string;
    sponsor: string;
    commissionrate: string;
    registration_method: string;
    kyc_status: string;
    referrals: number;
    balance: number;
  }[];
}

const AdminRegistryTable = ({ data }: AdminRegistryTableProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [type, setType] = useState<string>("student");
  const tabs = getLevelTabs();

  useEffect(() => setIsMounted(true), []);

  if (!isMounted)
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );

  return (
    <Tabs defaultValue="all">
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 h-24 sm:h-12">
        <TabsList className="w-full sm:w-auto overflow-x-auto h-10">
          <TabsTrigger
            key="all"
            value="all"
            className={cn(
              "h-8 text-xs sm:text-sm w-32 cursor-pointer",
              "min-h-8 !bg-[#777] text-white/80 data-[state=active]:!bg-primary data-[state=active]:text-white"
            )}>
            All
          </TabsTrigger>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "h-8 text-xs sm:text-sm w-32 cursor-pointer",
                tab.color
              )}>
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="w-11/12 mx-auto sm:mx-0 sm:w-auto flex items-center gap-2">
          <Button
            onClick={() => setType("student")}
            className="w-1/2 sm:w-auto !bg-[#00b894]">
            Students
          </Button>
          <Button
            onClick={() => setType("partner")}
            className="w-1/2 sm:w-auto !bg-[#0984e3]">
            Partners
          </Button>
        </div>
      </div>

      <TabsContent key="all" value="all">
        <div className="overflow-x-auto">
          <DataTable
            columns={adminColumns}
            data={data.filter((user) => user.role === type)}
            type={type}
            tableTitle={`All Registry - ${type}`}
          />
        </div>
      </TabsContent>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="overflow-x-auto">
            <DataTable
              columns={adminColumns}
              data={data.filter(
                (user) => user.level === tab.level && user.role === type
              )}
              type={type}
              tableTitle={`${tab.name} Registry - ${type}`}
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default AdminRegistryTable;
