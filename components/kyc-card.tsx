import React, { cache } from "react";
import KycUpload from "./kyc-upload";
import Image from "next/image";
import { getKycById } from "@/data/user";
import { auth } from "@/auth";
import { Badge } from "./ui/badge";

const getCachedKYC = cache(async (userId?: string) => {
  if (!userId) return null;
  return await getKycById(userId);
});

const KycCard = async () => {
  const session = await auth();
  const kycData = await getCachedKYC(session?.user.id);

  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full grid grid-rows-2 grid-cols-none lg:grid-rows-none lg:grid-cols-2 gap-4 items-center">
        <div className="w-full h-40 lg:h-64">
          <Image
            src={kycData?.idfront || "/ID_front_template.png"}
            alt="ID Front"
            width={400}
            height={200}
            className="w-full h-full object-cover object-center rounded-lg"
          />
        </div>
        <div className="w-full h-40 lg:h-64">
          <Image
            src={kycData?.idback || "/ID_back_template.png"}
            alt="ID Back"
            width={400}
            height={200}
            className="w-full h-full object-cover object-center rounded-lg"
          />
        </div>
      </div>
      {kycData && (
        <Badge
          variant={
            kycData?.status === "approved"
              ? "default"
              : kycData?.status === "pending"
              ? "outline"
              : "destructive"
          }
          className={`absolute top-4 right-4 ${
            kycData?.status === "pending" && "bg-highlight-yellow"
          }`}>
          {kycData?.status}
        </Badge>
      )}
      {kycData?.status !== "approved" && <KycUpload kyc={kycData} />}
    </div>
  );
};

export default KycCard;
