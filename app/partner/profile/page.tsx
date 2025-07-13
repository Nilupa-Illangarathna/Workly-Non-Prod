import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PaymentMethodDialog from "@/components/payment-method-dialog";
import ChangePasswordForm from "@/components/change-password-form";
import PaymentMethodsList from "@/components/payment-methods-list";
import UserInfoCard from "@/components/user-info-card";
import KycCard from "@/components/kyc-card";

export default function ProfilePage() {
  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              className="w-full text-sm md:text-base py-2">
              Documents
            </TabsTrigger>
            <TabsTrigger
              value="payment"
              className="w-full text-sm md:text-base py-2">
              Payment Methods
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="w-full text-sm md:text-base py-2">
              Change Password
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
                <KycCard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card className="border-2 border-muted">
              <CardHeader className="w-full flex flex-col lg:flex-row justify-between items-center">
                <CardTitle>Payment Methods</CardTitle>
                <PaymentMethodDialog />
              </CardHeader>
              <CardContent>
                <PaymentMethodsList />
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
