"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PartnerTypes } from "@/types";

const PartnerProfile = ({ partner }: { partner: PartnerTypes }) => {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Referrals</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="w-full h-full grid grid-cols-2 gap-3">
          {/* loop through the columns and print inside a div with a title and content */}
          {Object.entries(partner).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <div className="text-sm font-semibold">{key}</div>
              <div className="text-lg">{value}</div>
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  );
};

export default PartnerProfile;
