"use server";

import { getReferralChain } from "@/data/partners";
import { auth } from "@/auth";
import ReferralsTable from "@/components/partners/referrals-table";
import { cache } from "react";

const getCachedReferralChain = cache(getReferralChain);

export default async function PartnerUsersPage() {
  const session = await auth();
  const currentPartner = await getCachedReferralChain(session?.user?.id);

  if (!currentPartner) return <div className="p-6">Partner not found</div>;

  return (
    <div className="w-full space-y-4 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl font-bold">Registry</h1>
      <ReferralsTable data={currentPartner} />
    </div>
  );
}
