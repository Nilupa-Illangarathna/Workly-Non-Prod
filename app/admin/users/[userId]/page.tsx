import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { partners, referrals } from "@/drizzle/schema";
import { PromoteToPartner } from "@/components/admin/promote-to-partner";
import { getUserById } from "@/data/user";
import ApproveUser from "@/components/admin/approve-user";
import RejectUser from "@/components/admin/reject-user";
import KycCard from "@/components/admin/kyc-card";
import PaymentMethodListDialog from "@/components/admin/payment-method-list-dialog";
import PaymentMethodsList from "@/components/admin/payment-methods-list";
import PaymentUpload from "@/components/admin/payment-slip-upload";
import PaymentHistory from "@/components/admin/payment-slips-list";
import UserInfoCard from "@/components/admin/user-info-card";
import EditDetailsCard from "@/components/admin/edit-details-card";
import PartnerDashboardOverview from "@/components/admin/partner-overview";
import PartnerOverviewEarnings from "@/components/admin/partner-overview-earnings";
import PartnerOverviewWithdrawals from "@/components/admin/partner-overview-withdrawals";
import PartnerOverviewRegistry from "@/components/admin/partner-overview-registry";
import { AddSponsorDialog } from "@/components/admin/add-sponsor";

export default async function UserDetailPage(props: {
  params: Promise<{ userId: string }>;
}) {
  const params = await props.params;
  const userID = params.userId;
  const userData = await getUserById(userID);
  const referral = await db
    .select({ level: partners.level })
    .from(referrals)
    .where(eq(referrals.referredid, userID))
    .leftJoin(partners, eq(referrals.referrerid, partners.userid));
  console.log("Referral Data:", referral);

  if (!userData) return <div>User not found</div>;

  let partnerData = null;
  if (userData.role === "partner") {
    // Get partner data
    partnerData = (
      await db.select().from(partners).where(eq(partners.userid, userData.id))
    )[0];
  }

  return (
    <div className="w-full p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left Column - User Info */}
      <div className="lg:col-span-1">
        <UserInfoCard id={userID} />
      </div>

      {/* KYC & Actions Column */}
      <div className="lg:col-span-2 space-y-4">
        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="w-full grid grid-cols-1 md:grid-cols-3 gap-2 h-auto">
            <TabsTrigger
              value="documents"
              className="w-full text-sm md:text-base py-2">
              Documents
            </TabsTrigger>
            <TabsTrigger
              value="payment"
              className="w-full text-sm md:text-base py-2">
              Payment Methods
            </TabsTrigger>
            <TabsTrigger
              value="payment-history"
              className="w-full text-sm md:text-base py-2">
              Payment History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents">
            <Card className="relative border-2 border-muted">
              <CardHeader>
                <CardTitle>NIC Documents</CardTitle>
                <CardDescription>
                  Please upload your KYC documents for verification.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <KycCard id={userID} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card className="border-2 border-muted">
              <CardHeader className="w-full flex flex-col lg:flex-row justify-between items-center">
                <CardTitle>Payment Methods</CardTitle>
                <PaymentMethodListDialog id={userID} />
              </CardHeader>
              <CardContent>
                <PaymentMethodsList id={userID} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment-history">
            <Card className="border-2 border-muted">
              <CardHeader className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <CardTitle>Course Payments</CardTitle>
                <PaymentUpload id={userID} />
              </CardHeader>
              <CardContent>
                <PaymentHistory id={userID} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>User Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {userData.status === "pending" ? (
                <div className="flex gap-2 items-center">
                  <ApproveUser userID={userData.id} type="text" />
                  <RejectUser userID={userData.id} type="text" />
                </div>
              ) : (
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                      </Button>
                    </DialogTrigger>
                    {/* Add delete user logic here */}
                  </Dialog>
                  {userData.role === "student" &&
                    referral &&
                    referral[0]?.level === 0 && (
                      <PromoteToPartner
                        userId={userData.id}
                        type="text"
                        level={partnerData?.level ?? 0}
                      />
                    )}
                </>
              )}
              {userData.role === "student" && !referral.length && (
                <AddSponsorDialog studentId={userData.id} />
              )}

              <EditDetailsCard
                user={{ ...userData, fullname: userData.fullname ?? "" }}
                buttonStyle="!w-40"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partner Overview */}
      {userData.role === "partner" && (
        <Tabs defaultValue="dashboard" className="w-full col-span-3 mt-8">
          <TabsList
            className={`w-full grid grid-cols-1 ${
              userData.role === "partner" ? "lg:grid-cols-4" : "lg:grid-cols-3"
            } gap-2 h-auto`}>
            <TabsTrigger
              value="dashboard"
              className="w-full text-sm lg:text-base py-2">
              Dashboard
            </TabsTrigger>
            {userData.role === "partner" && (
              <TabsTrigger
                value="registry"
                className="w-full text-sm lg:text-base py-2">
                Registry
              </TabsTrigger>
            )}
            <TabsTrigger
              value="earnings"
              className="w-full text-sm lg:text-base py-2">
              Earnings
            </TabsTrigger>
            <TabsTrigger
              value="withdrawals"
              className="w-full text-sm lg:text-base py-2">
              Withdrawals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <PartnerDashboardOverview
              id={userID}
              worklyid={userData.worklyid}
            />
          </TabsContent>

          {userData.role === "partner" && (
            <TabsContent value="registry">
              <PartnerOverviewRegistry id={userID} />
            </TabsContent>
          )}
          <TabsContent value="earnings">
            <PartnerOverviewEarnings id={userID} />
          </TabsContent>
          <TabsContent value="withdrawals">
            <PartnerOverviewWithdrawals id={userID} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
