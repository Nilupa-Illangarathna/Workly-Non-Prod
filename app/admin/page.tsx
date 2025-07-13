"use server";

import { getAdminDashboardData } from "@/actions/admin/dashboard";
import { ApprovalCards } from "@/components/admin/approval-cards";
import { StatCards } from "@/components/admin/stat-cards";

export default async function AdminDashboardPage() {
  const dashboardData = await getAdminDashboardData();

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 space-y-6 w-11/12 mx-auto pt-5">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your platform statistics and approvals
          </p>
        </div>

        <div className="space-y-6">
          <ApprovalCards
            pendingKyc={dashboardData.kycApprovals}
            pendingPayments={dashboardData.coursePaymentApprovals}
            pendingUsers={dashboardData.pendingUserApprovals}
            pendingWithdrawals={dashboardData.pendingWithdrawalApprovals}
          />
          <StatCards
            partnersOverview={{
              title: "Partners Overview",
              totalValue: dashboardData.partnersOverview?.totalValue ?? 0,
              categorizedValues:
                dashboardData.partnersOverview?.categorizedValues,
            }}
            studentPaymentOverview={{
              title: "Student Payment Overview",
              totalValue: dashboardData.studentPaymentOverview?.totalValue ?? 0,
              categorizedValues:
                dashboardData.studentPaymentOverview?.categorizedValues,
            }}
            studentPaymentSummary={{
              title: "Student Payment Summary",
              totalValue: dashboardData.studentPaymentSummary?.totalValue ?? 0,
              categorizedValues:
                dashboardData.studentPaymentSummary?.categorizedValues,
            }}
            partnerEarningsWithdrawals={{
              title: "Partner Earnings & Withdrawals",
              totalValue:
                dashboardData.partnerEarningsAndWithdrawals?.totalValue ?? 0,
              categorizedValues:
                dashboardData.partnerEarningsAndWithdrawals?.categorizedValues,
            }}
          />

          {/* Charts section - To be implemented */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Investment Growth</h3>
              {/* Add chart component here */}
            </div>
            <div className="rounded-xl border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">
                Monthly Deposit VS Withdraw
              </h3>
              {/* Add chart component here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
