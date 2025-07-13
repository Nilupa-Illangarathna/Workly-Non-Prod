import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { getEarningsHistory } from "@/data/partners";
import { cache } from "react";
import { DataTable } from "@/app/partner/earnings/data-table";
import { columns } from "@/app/partner/earnings/columns";

const getCachedData = cache(async (partnerUserId: string) => {
  const earnings = await getEarningsHistory(partnerUserId);

  return {
    earnings,
    total_earnings: earnings.reduce(
      (acc, earning) => acc + Number(earning.amount || 0),
      0
    ),
  };
});

export const revalidate = 3600;

export default async function PartnerOverviewEarnings({ id }: { id: string }) {
  const { earnings, total_earnings } = await getCachedData(id);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <h1 className="text-xl sm:text-3xl font-bold underline">
        Earnings Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid gap-3 lg:gap-4 lg:grid-cols-3">
        <StatCard
          title="Total Earnings"
          value={total_earnings}
          description="Lifetime earnings"
          icon={TrendingUp}
          className="lg:col-span-1 bg-accent text-accent-foreground"
        />
      </div>

      {/* Earnings Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Earnings History</h2>
        <DataTable
          columns={columns}
          data={earnings}
          tableTitle="Earnings History"
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  className,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-xl sm:text-2xl font-extrabold">
          LKR {value.toLocaleString()}
        </div>
        <p className="text-xs opacity-70 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
