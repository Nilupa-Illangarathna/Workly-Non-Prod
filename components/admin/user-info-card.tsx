import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cache } from "react";
import { getUserById } from "@/data/user";
import Image from "next/image";
import { CircleCheckBig, X } from "lucide-react";
import UploadProfilePic from "./upload-profile-pic";
import { getPartnerById } from "@/data/partners";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Partner } from "@/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";

interface UserType {
  id: string;
  firstname: string;
  lastname: string;
  worklyid: string;
  loginid: string;
  fullname: string;
  nicnumber: string;
  dateofbirth: Date;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  district: string;
  postalcode: string;
  country: string;
  createdat: string;
  profilepic?: string | null;
  role: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  status: string;
}

const getCachedUser = cache(async (userId: string) => {
  const userData = await getUserById(userId);

  let partnerData: Partner | null = null;
  if (userData?.role === "partner") {
    partnerData = (await getPartnerById(userId)) as Partner;
  }

  return [userData, partnerData];
});

export default async function UserInfoCard({ id }: { id: string }) {
  const [userData, partnerData] = await getCachedUser(id);
  const partnerLevels = [
    "Developer",
    "Top Manager",
    "Sub Company",
    "Sub 1",
    "Sub 2",
    "Sub 3",
  ];

  const user = userData as UserType | null;
  const partner = partnerData as Partner | null;

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
        <Badge
          variant="outline"
          className="bg-highlight-yellow text-[#333] absolute top-0 left-4 capitalize">
          {user.role}
        </Badge>
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <Dialog>
              <DialogTrigger>
                <div className="h-32 w-32 rounded-full overflow-hidden ring-4 ring-offset-4 ring-primary bg-accent ring-offset-background">
                  <Image
                    src={user.profilepic || "/default-profile.png"}
                    alt="Profile"
                    width={200}
                    height={200}
                    className="rounded-full h-32 w-32 object-cover object-top"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="bg-transparent border-none">
                <DialogClose className="absolute top-2 right-2 cursor-pointer">
                  <X color="#fff" />
                </DialogClose>
                <Image
                  src={user.profilepic || "/default-profile.png"}
                  alt="Profile"
                  width={200}
                  height={200}
                  className="rounded-full h-full w-full object-cover object-top"
                />
              </DialogContent>
            </Dialog>
            <UploadProfilePic
              profilepic={user.profilepic || "/default-profile.png"}
              id={user.id}
              role={user.role || ""}
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
        <DetailItem label="Full Name" value={user.fullname} />

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
        <DetailItem label="District" value={user.district} />
        <DetailItem label="Postal Code" value={user.postalcode} />
        <DetailItem label="Country" value={user.country} />
        <DetailItem
          label="Registered Date"
          value={new Date(user.createdat).toLocaleString()}
          className="md:col-span-2"
        />
        {user.role === "partner" && partnerData && (
          <div className="w-full">
            <Separator />
            <div className="w-full space-y-4 mt-4">
              <Label className="underline font-semibold text-lg">
                Partner Details
              </Label>
              <div className="flex flex-row-reverse items-center justify-between w-full">
                <div>
                  <p className="text-sm font-medium">Commission Rate</p>
                  <p className={"text-sm text-gray-600"}>
                    {Number(partner?.commissionrate) < 100
                      ? `${partner?.commissionrate}%`
                      : partner?.commissionrate}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Partner Type</p>
                  <p className={"text-sm text-gray-600"}>
                    {partner?.level
                      ? partnerLevels[partner?.level + 1]
                      : "Undefined"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
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
