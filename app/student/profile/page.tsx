import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserInfoCard from "@/components/user-info-card";
import ChangePasswordForm from "@/components/change-password-form";
import PaymentUpload from "@/components/students/payment-slip-upload";
import PaymentHistory from "@/components/students/payment-slips-list";
import KycCard from "@/components/kyc-card";

export default function ProfilePage() {
  return (
    <div className="mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      {/* Left Column - User Info */}
      <div className="lg:col-span-1">
        <UserInfoCard />
      </div>

      {/* Right Column - Tabs */}
      <div className="lg:col-span-2">
        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="w-full grid grid-cols-1 md:grid-cols-3 gap-2 h-auto">
            <TabsTrigger
              value="documents"
              className="text-sm md:text-base py-2">
              Documents
            </TabsTrigger>
            <TabsTrigger value="payment" className="text-sm md:text-base py-2">
              Course Payments
            </TabsTrigger>
            <TabsTrigger value="password" className="text-sm md:text-base py-2">
              Change Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents">
            <Card className="border-2 border-muted">
              <CardHeader>
                <CardTitle>NIC Documents</CardTitle>
                <CardDescription>
                  Please upload your KYC documents for verification.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <KycCard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card className="border-2 border-muted">
              <CardHeader className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="w-full flex flex-col gap-y-2">
                  <CardTitle>Course Payments</CardTitle>
                  <CardDescription>
                    Add your payment reciept (bank slip/ screenshot of online
                    transfer) here.
                  </CardDescription>
                </div>
                <PaymentUpload />
              </CardHeader>
              <CardContent>
                <PaymentHistory />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card className="border-2 border-muted">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <ChangePasswordForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
