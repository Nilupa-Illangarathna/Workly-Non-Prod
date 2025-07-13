import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Wallet, Clock, CheckCircle } from "lucide-react";
import { getWithdrawalHistory, getPartnerBalance } from "@/data/partners";
import { DataTable } from "@/app/partner/withdrawals/data-table";
import { columns } from "@/app/partner/withdrawals/columns";
import { cache } from "react";

const getCachedData = cache(async (partnerUserId: string) => {
  const [withdrawals, balanceData] = await Promise.all([
    getWithdrawalHistory(partnerUserId),
    getPartnerBalance(partnerUserId),
  ]);

  const pending = withdrawals.filter((w) => w.status === "pending");
  const completed = withdrawals.filter((w) => w.status === "approved");

  return {
    withdrawals,
    pendingAmount: pending.reduce((sum, w) => sum + Number(w.amount), 0),
    completedAmount: completed.reduce((sum, w) => sum + Number(w.amount), 0),
    withdrawable:
      Number(balanceData) -
      pending.reduce((sum, w) => sum + Number(w.amount), 0),
  };
});

export const revalidate = 3600;

export default async function PartnerOverviewWithdrawals({
  id,
}: {
  id: string;
}) {
  const { withdrawals, withdrawable, pendingAmount, completedAmount } =
    await getCachedData(id);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <h1 className="text-xl sm:text-3xl font-bold underline">
        Withdrawals Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
        <StatCard
          title="Withdrawable Amount"
          value={withdrawable}
          description="Available balance minus pending withdrawals"
          icon={Wallet}
          className="bg-accent text-accent-foreground"
        />
        <StatCard
          title="Pending Withdrawals"
          value={pendingAmount}
          description="Awaiting admin approval"
          icon={Clock}
          className="bg-accent text-accent-foreground"
        />
        <StatCard
          title="Completed Withdrawals"
          value={completedAmount}
          description="Successfully processed"
          icon={CheckCircle}
          className="bg-accent text-accent-foreground"
        />
      </div>

      {/* Withdrawals Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Withdrawal History</h2>
        <DataTable
          columns={columns}
          data={withdrawals}
          tableTitle="Withdrawal History"
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
