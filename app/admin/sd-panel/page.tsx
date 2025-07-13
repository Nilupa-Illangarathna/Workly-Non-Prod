"use server";

import { db } from "@/drizzle/db";
import { eq, sql } from "drizzle-orm";
import { commission_distributions, partners, users } from "@/drizzle/schema";
import SDPanelClient from "@/components/admin/sd-plan-page";

export default async function SDPanelPage() {
  // Fetch all commission distributions
  const commissionDistribution = await db
    .select()
    .from(commission_distributions);

  // Fetch top managers (level 0 partners)
  const topmanagers = await db
    .select({
      userId: users.id,
      name: sql<string>`CONCAT(${users.firstname}, ' ', ${users.lastname})`.as(
        "full_name"
      ),
      worklyId: users.worklyid,
      commissionRate: partners.commissionrate,
      level: partners.level,
    })
    .from(partners)
    .leftJoin(users, eq(partners.userid, users.id))
    .where(eq(partners.level, 0));

  // Get commission values from database
  const getCommissionValue = (category: string) => {
    return (
      Number(
        commissionDistribution.find((d) => d.category === category)?.amount
      ) || 0
    );
  };

  const data = {
    courseFee: getCommissionValue("course_payment"),
    expenses: getCommissionValue("expenses"),
    development: getCommissionValue("development"),
    totalCommission: getCommissionValue("total_commission"),
    topManagersPool: getCommissionValue("top_managers"),
    subCompanyPool: getCommissionValue("sub_company"),
    managerBreakdown: topmanagers.map((manager) => {
      const commissionRate = Number(manager.commissionRate);
      return {
        name: manager.name,
        directPercent: commissionRate,
        directAmount: Math.round(
          getCommissionValue("total_commission") * (commissionRate / 100)
        ),
        teamPercent: commissionRate,
        teamAmount: Math.round(
          getCommissionValue("top_managers") * (commissionRate / 100)
        ),
      };
    }),
  };

  return <SDPanelClient {...data} />;
}
