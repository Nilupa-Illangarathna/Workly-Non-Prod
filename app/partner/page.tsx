"use server";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/auth";
import ReferralLink from "@/components/partners/referral-link";
import { getPartnerOverview, getPartnerPaymentMethods } from "@/data/partners";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WithdrawalDialog } from "@/components/partners/withdrawal-dialog";
import { Separator } from "@/components/ui/separator";

export default async function PartnerDashboard() {
  const session = await auth();
  const partnerId = session?.user.id;

  if (!partnerId) return <div className="p-6">Partner not found</div>;

  const [data, paymentMethods] = await Promise.all([
    getPartnerOverview(partnerId),
    getPartnerPaymentMethods(partnerId),
  ]);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Partner Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Overview of your earnings and referrals
          </p>
        </div>
        <ReferralLink worklyid={session?.user.worklyid} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {/* Total Earnings Card */}
        <Card className="bg-gradient-to-br from-[#2E1A47] to-[#582C83] text-white dark:from-[#3B235A] dark:to-[#6D3BAA]">
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {(
                Number(data.totalEarnings) - Number(data.pendingWithdrawals)
              ).toLocaleString()}{" "}
              LKR
            </p>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <WithdrawalDialog
              balance={
                Number(data.totalEarnings) - Number(data.pendingWithdrawals)
              }
              paymentMethods={paymentMethods}
              buttonType="outline"
              buttonStyles="bg-transparent hover:text-white hover:bg-[#2E1A47] border-white"
            />
            <Button
              asChild
              variant="outline"
              className="bg-transparent hover:text-white hover:bg-[#2E1A47] border-white">
              <Link href="/partner/earnings">View</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Withdrawals Card */}
        <Card className="bg-gradient-to-br from-[#01579B] to-[#0288D1] text-white dark:from-[#0277BD] dark:to-[#039BE5]">
          <CardHeader>
            <CardTitle>Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-y-2">
              <div className="w-full flex justify-between">
                <p>Pending</p>
                <p className="text-xl font-semibold">
                  {Number(data.pendingWithdrawals).toLocaleString()} LKR
                </p>
              </div>
              <Separator className="!bg-white/50 my-2" />
              <div className="w-full flex justify-between">
                <p>Completed</p>
                <p className="text-xl font-semibold">
                  {Number(data.completeWithdrawals).toLocaleString()} LKR
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex items-end justify-end">
            <Button
              asChild
              variant="outline"
              className="bg-transparent hover:text-white hover:bg-[#01579B] border-white">
              <Link href="/partner/withdrawals">View</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Total Referrals Card */}
        <Card className="bg-gradient-to-br from-[#004D40] to-[#00796B] text-white dark:from-[#00695C] dark:to-[#009688]">
          <CardHeader className="w-full flex flex-row items-center justify-between">
            <CardTitle>Total Referrals</CardTitle>
            <p className="text-xl font-semibold">{data.totalReferrals.total}</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-2">
            <Separator className="!bg-white/50 mb-2" />
            <div className="w-full flex justify-between">
              <p>Partners</p>
              <p className="text-xl font-semibold">
                {data.totalReferrals.partners}
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p>Students</p>
              <p className="text-xl font-semibold">
                {data.totalReferrals.students}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex items-end justify-end">
            <Button
              asChild
              variant="outline"
              className="bg-transparent hover:text-white hover:bg-[#004D40] dark:hover:bg-[#00695C] border-white">
              <Link href="/partner/referrals">View</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Total Referrals Card */}
        <Card className="bg-gradient-to-br from-[#880E4F] to-[#C2185B] text-white dark:from-[#AD1457] dark:to-[#E91E63]">
          <CardHeader className="w-full flex flex-row items-center justify-between">
            <CardTitle>Paid Completed</CardTitle>
            <p className="text-xl font-semibold">{data.payments.completed}</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-2">
            <Separator className="!bg-white/50 mb-2" />
            <div className="w-full flex justify-between">
              <p>Pending</p>
              <p className="text-xl font-semibold">{data.payments.pending}</p>
            </div>
            <div className="w-full flex justify-between">
              <p>Not Paid</p>
              <p className="text-xl font-semibold">
                {data.payments.notCompleted}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex items-end justify-end">
            <Button
              asChild
              variant="outline"
              className="bg-transparent hover:text-white hover:bg-[#880E4F] dark:hover:bg-[#AD1457] border-white">
              <Link href="/partner/referrals">View</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Direct Referrals Card */}
        <Card className="bg-gradient-to-br from-[#1A237E] to-[#3F51B5] text-white dark:from-[#303F9F] dark:to-[#5C6BC0]">
          <CardHeader className="w-full flex flex-row items-center justify-between">
            <CardTitle>Direct Referrals</CardTitle>
            <p className="text-3xl font-bold">{data.directReferrals.count}</p>
          </CardHeader>
          <CardContent>
            <Separator className="!bg-white/50 mb-4" />
            <p className="text-xl">
              {Number(data.directReferrals.earnings).toLocaleString()} LKR
            </p>
          </CardContent>
          <CardFooter className="flex items-end justify-end">
            <Button
              asChild
              variant="outline"
              className="bg-transparent hover:text-white hover:bg-[#303F9F] border-white">
              <Link href="/partner/referrals">View</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Sub Referrals Card */}
        <Card className="bg-gradient-to-br from-[#1B5E20] to-[#388E3C] text-white dark:from-[#2E7D32] dark:to-[#43A047]">
          <CardHeader className="w-full flex flex-row items-center justify-between">
            <CardTitle>Sub Referrals</CardTitle>
            <p className="text-3xl font-bold">{data.subReferrals.count}</p>
          </CardHeader>
          <CardContent>
            <Separator className="!bg-white/50 mb-4" />
            <p className="text-xl">
              {Number(data.subReferrals.earnings).toLocaleString()} LKR
            </p>
          </CardContent>

          <CardFooter className="flex items-end justify-end">
            <Button
              asChild
              variant="outline"
              className="bg-transparent hover:text-white hover:bg-[#2E7D32] border-white">
              <Link href="/partner/referrals">View</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Dummy Cards */}
        <Card className="bg-gradient-to-br from-[#F57F17] to-[#FFA000] text-white dark:from-[#F9A825] dark:to-[#FFB300]">
          <CardHeader className="space-y-4">
            <CardTitle>Currently Training</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#BF360C] to-[#D84315] text-white dark:from-[#E64A19] dark:to-[#FF5722]">
          <CardHeader className="space-y-4">
            <CardTitle>Training Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6">
          <h3 className="font-semibold text-lg sm:text-xl mb-3 sm:mb-4">
            Earnings Overview
          </h3>
          <div className="h-[200px] sm:h-[300px] flex items-center justify-center text-muted-foreground">
            Earnings chart will be rendered here
          </div>
        </Card>
        <Card className="p-4 sm:p-6">
          <h3 className="font-semibold text-lg sm:text-xl mb-3 sm:mb-4">
            Referral Growth
          </h3>
          <div className="h-[200px] sm:h-[300px] flex items-center justify-center text-muted-foreground">
            Referral growth chart will be rendered here
          </div>
        </Card>
      </div>
    </div>
  );
}
