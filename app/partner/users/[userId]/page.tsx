import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, UserPlus } from "lucide-react";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { partners, kyc, referrals } from "@/drizzle/schema";
import { UpdateUserForm } from "@/components/admin/update-user-form";
import { PromoteToPartner } from "@/components/admin/promote-to-partner";
import Image from "next/image";
import { getUserById } from "@/data/user";
import ApproveUser from "@/components/admin/approve-user";
import RejectUser from "@/components/admin/reject-user";
import { AdminPasswordVerification } from "@/components/admin/show-password";
import { PromoteToStudnetPartner } from "@/components/admin/promote-to-studentpartner";
import { DemotePartnerToStudent } from "@/components/partners/demote-partner-to-student";
import { DemoteToStudentPartner } from "@/components/partners/demote-to-student-partner";
import { auth } from "@/auth";

export default async function UserDetailPage(props: {
  params: Promise<{ userId: string }>;
}) {
  const session = await auth();
  const params = await props.params;
  const userID = params.userId;
  const userData = await getUserById(userID);
  const referral = await db
    .select({ level: partners.level })
    .from(referrals)
    .where(eq(referrals.referredid, userID))
    .leftJoin(partners, eq(referrals.referrerid, partners.userid));

  if (!userData) return <div>User not found</div>;

  let partnerData = null;
  if (userData.role === "partner") {
    // Get partner data
    partnerData = (
      await db.select().from(partners).where(eq(partners.userid, userData.id))
    )[0];
  }

  // Get KYC data
  const kycData = (
    await db.select().from(kyc).where(eq(kyc.userid, userData.id))
  )[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* User Details Column */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>User Details</span>
            <div className="flex gap-2">
              <Badge variant="outline">{userData.role}</Badge>
              <Badge
                variant={
                  userData.status === "approved" ? "default" : "destructive"
                }>
                {userData.status}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Label className="underline font-semibold text-lg">
              Basic Information
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Workly ID</p>
                <p className={"text-sm text-gray-600"}>{userData.worklyid}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Login ID</p>
                <p className={"text-sm text-gray-600"}>{userData.loginid}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className={"text-sm text-gray-600"}>
                  {userData.firstname} {userData.lastname}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">NIC Number</p>
                <p className={"text-sm text-gray-600"}>{userData.nicnumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className={"text-sm text-gray-600"}>{userData.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className={"text-sm text-gray-600"}>{userData.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium">WhatsApp</p>
                <p className={"text-sm text-gray-600"}>{userData.whatsapp}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Date of Birth</p>
                <p className={"text-sm text-gray-600"}>{userData.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Language</p>
                <p className={"text-sm text-gray-600"}>{userData.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className={"text-sm text-gray-600"}>{userData.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium">District</p>
                <p className={"text-sm text-gray-600"}>{userData.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Country</p>
                <p className={"text-sm text-gray-600"}>{userData.phone}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="underline font-semibold text-lg">
              Authentication
            </Label>
            <div className="grid grid-cols-2">
              <div>
                <p className="text-sm font-medium">Login ID</p>
                <p className={"text-sm text-gray-600"}>{userData.loginid}</p>
              </div>
              <AdminPasswordVerification userPassword={userData.password} />
            </div>
          </div>

          {userData.role === "partner" && partnerData && (
            <>
              <Separator />
              <div className="space-y-4">
                <Label className="underline font-semibold text-lg">
                  Partner Details
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Commission Rate</p>
                    <p className={"text-sm text-gray-600"}>
                      {partnerData.commissionrate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Partner Level</p>
                    <p className={"text-sm text-gray-600"}>
                      Level {partnerData.level}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* KYC & Actions Column */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>KYC Verification</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Image
                src={kycData?.idfront || "/ID_front_template.png"}
                width={300}
                height={300}
                alt="Front ID"
                className="rounded-md border"
              />
              <p className="text-sm text-center">Front Side</p>
            </div>
            <div className="space-y-2">
              <Image
                src={kycData?.idback || "/ID_back_template.png"}
                width={300}
                height={300}
                alt="Back ID"
                className="rounded-md border"
              />
              <p className="text-sm text-center">Back Side</p>
            </div>
          </CardContent>
        </Card>

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
                    referral[0].level === session?.user.level && (
                      <>
                        <PromoteToPartner
                          userId={userData.id}
                          type="text"
                          level={partnerData?.level as number}
                        />
                        <PromoteToStudnetPartner
                          userId={userData.id}
                          type="text"
                          label="Student Partner"
                        />
                      </>
                    )}
                  {userData.role === "partner" &&
                    referral[0].level === session?.user.level && (
                      <>
                        <DemotePartnerToStudent
                          userId={userData.id}
                          label="Student"
                        />
                        <DemoteToStudentPartner
                          userId={userData.id}
                          label="Student Partner"
                        />
                      </>
                    )}
                  {userData.role === "student_partner" &&
                    referral[0].level === session?.user.level && (
                      <>
                        <DemotePartnerToStudent
                          userId={userData.id}
                          label="Student"
                        />
                        <PromoteToPartner
                          userId={userData.id}
                          type="text"
                          label="Partner"
                          level={partnerData?.level as number}
                        />
                      </>
                    )}
                </>
              )}

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Update Details
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update User Details</DialogTitle>
                  </DialogHeader>
                  <UpdateUserForm user={userData} />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
