import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cache } from "react";
import { auth } from "@/auth";
import { getKycById, getUserById } from "@/data/user";
import Image from "next/image";
import UploadProfilePic from "./upload-profile-pic";
import EditDetailsCard from "./edit-details-card";
import { CircleCheckBig } from "lucide-react";

const getCachedUser = cache(async (userId?: string) => {
  if (!userId) return null;
  return await getUserById(userId);
});

export default async function UserInfoCard() {
  const session = await auth();
  const user = await getCachedUser(session?.user.id);
  const kyc = await getKycById(session?.user.id);

  if (!user) return <div>User not found</div>;

  return (
    <Card className="border-2 border-muted h-fit">
      <CardHeader className="relative">
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 absolute top-0 right-4">
          <CircleCheckBig size={20} />
          Verified
        </Badge>
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="h-32 w-32 rounded-full overflow-hidden ring-4 ring-offset-4 ring-primary bg-accent ring-offset-background">
              <Image
                src={user.profilepic || "/default-profile.png"}
                alt="Profile"
                width={200}
                height={200}
                className="rounded-full h-32 w-32 object-cover object-top"
              />
            </div>
            <UploadProfilePic
              profilepic={user.profilepic || "/default-profile.png"}
              className="absolute bottom-0 right-0 !z-40"
            />
          </div>
          <h2 className="text-xl md:text-2xl font-semibold mt-4">
            {user.firstname} {user.lastname}
          </h2>

          <p className="text-muted-foreground text-sm">
            User ID: {user.worklyid}
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-start gap-y-4 text-sm">
        {/* Responsive grid for user details */}
        <DetailItem label="Login ID" value={user.loginid} />
        <DetailItem label="Full Name" value={user.fullname || ""} />
        <DetailItem label="NIC Number" value={user.nicnumber} />
        <DetailItem
          label="Date of Birth"
          value={new Date(user.dateofbirth).toLocaleDateString()}
        />
        <DetailItem label="Email" value={user.email} />
        <DetailItem label="Phone" value={user.phone} />
        <DetailItem label="WhatsApp" value={user.whatsapp} />
        <DetailItem
          label="Address"
          value={user.address}
          className="md:col-span-2"
        />
        <DetailItem
          label="District"
          className="capitalize"
          value={user.district}
        />
        <DetailItem label="Postal Code" value={user.postalcode || ""} />
        <DetailItem label="Country" value={user.country} />
        <DetailItem
          label="Registered Date"
          value={new Date(user.createdat).toLocaleString()}
          className="md:col-span-2"
        />
        <EditDetailsCard user={user} kyc={kyc} />
      </CardContent>
    </Card>
  );
}

function DetailItem({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      <span className="text-muted-foreground font-medium">{label}:</span>
      <p className="break-words">{value || "-"}</p>
    </div>
  );
}
