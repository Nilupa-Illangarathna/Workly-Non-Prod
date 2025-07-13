import React, { cache } from "react";
import Image from "next/image";
import { getKycById } from "@/data/user";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { X } from "lucide-react";

const getCachedKYC = cache(async (userId?: string) => {
  if (!userId) return null;
  return await getKycById(userId);
});

const KycCard = async ({ id }: { id: string }) => {
  const kycData = await getCachedKYC(id);

  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full grid grid-cols-2 gap-x-4 items-center">
        <Dialog>
          <DialogTrigger className="cursor-pointer">
            <div className="w-full h-64">
              <Image
                src={kycData?.idfront || "/ID_front_template.png"}
                alt="ID Front"
                width={400}
                height={200}
                className="w-full h-full object-cover object-center rounded-lg"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="bg-transparent border-none w-2/3">
            <DialogClose className="absolute top-2 right-2 cursor-pointer">
              <X color="#fff" />
            </DialogClose>
            <Image
              src={kycData?.idfront || "/ID_front_template.png"}
              alt="ID Front"
              width={400}
              height={200}
              className="w-full h-full object-cover object-center rounded-lg"
            />
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger className="cursor-pointer">
            <div className="w-full h-64">
              <Image
                src={kycData?.idback || "/ID_back_template.png"}
                alt="ID Back"
                width={400}
                height={200}
                className="w-full h-full object-cover object-center rounded-lg"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="bg-transparent border-none w-2/3">
            <DialogClose className="absolute top-2 right-2 cursor-pointer">
              <X color="#fff" />
            </DialogClose>
            <Image
              src={kycData?.idback || "/ID_back_template.png"}
              alt="ID Back"
              width={400}
              height={200}
              className="w-full h-full object-cover object-center rounded-lg"
            />
          </DialogContent>
        </Dialog>
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
    </div>
  );
};

export default KycCard;
