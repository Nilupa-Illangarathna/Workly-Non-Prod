"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/app/partner/registry/data-table";
import { columns } from "@/app/partner/registry/columns";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const getLevelTabs = (partnerLevel: number) => {
  return [
    {
      name: "Sub Company",
      value: "sub-company",
      level: 1,
      color:
        "data-[state=active]:!bg-primary data-[state=active]:text-white hover:bg-[#999]/20",
    },
    {
      name: "Sub C1",
      value: "sub-1",
      level: 2,
      color:
        "data-[state=active]:!bg-primary data-[state=active]:text-white hover:bg-[#999]/20",
    },
    {
      name: "Sub C2",
      value: "sub-2",
      level: 3,
      color:
        "data-[state=active]:!bg-primary data-[state=active]:text-white hover:bg-[#999]/20",
    },
    {
      name: "Sub C3",
      value: "sub-3",
      level: 4,
      color:
        "data-[state=active]:!bg-primary data-[state=active]:text-white hover:bg-[#999]/20",
    },
    {
      name: "Sub S4",
      value: "sub-4",
      level: 5,
      color:
        "data-[state=active]:!bg-primary data-[state=active]:text-white hover:bg-[#999]/20",
    },
  ].filter((tab) => tab.level > partnerLevel && tab.level <= partnerLevel + 5);
};

interface referralsTypes {
  currentUserId: string | null;
  currentPartnerLevel: number;
  currentPartnerCommission: string;
  referrals: Array<{
    id: string;
    worklyid: string;
    firstname: string;
    lastname: string;
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
    commissionrate: string;
  }>;
}

const ReferralsTable = ({ data }: { data: referralsTypes }) => {
  const tabs = getLevelTabs(data.currentPartnerLevel);
  const [type, setType] = useState<string>("student");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted)
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );

  return (
    <Tabs defaultValue={"all"}>
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 h-24 sm:h-12">
        <TabsList className="w-full sm:w-auto overflow-x-auto min-h-10">
          <TabsTrigger
            key={10}
            value={"all"}
            className="min-h-8 text-xs sm:text-sm w-32 mr-1 cursor-pointer !bg-[#777] text-white/80 data-[state=active]:!bg-primary data-[state=active]:text-white">
            All
          </TabsTrigger>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "min-h-8 text-xs sm:text-sm w-32 mr-1 cursor-pointer",
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

      <TabsContent key={10} value={"all"}>
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={data.referrals
              .filter(
                (user) =>
                  user.level >= data.currentPartnerLevel && user.role === type
              )
              .map((user) => ({
                ...user,
                name: `${user.firstname} ${user.lastname}`,
                sponsor: `${user.sponsor_firstname} ${user.sponsor_lastname}`,
                currentPartnerLevel: data.currentPartnerLevel,
                currentPartnerCommission: data.currentPartnerCommission,
              }))}
            tableTitle={"All Referrals - " + type}
          />
        </div>
      </TabsContent>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={data.referrals
                .filter(
                  (user) => user.level === tab.level && user.role === type
                )
                .map((user) => ({
                  ...user,
                  name: `${user.firstname} ${user.lastname}`,
                  sponsor: `${user.sponsor_firstname} ${user.sponsor_lastname}`,
                  currentPartnerLevel: data.currentPartnerLevel,
                  currentPartnerCommission: data.currentPartnerCommission,
                }))}
              tableTitle={`${tab.name} - ${type}`}
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ReferralsTable;
