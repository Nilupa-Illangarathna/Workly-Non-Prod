"use client";

import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "../ui/button";
import { Download, SquareArrowOutUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function PaymentSlipsActions(props: { path: string }) {
  return (
    <div className="flex items-center gap-x-3">
      <Link
        href={getPaymentSlipUrl(props.path)}
        target="_blank"
        className={buttonVariants({ variant: "outline", size: "icon" })}>
        <SquareArrowOutUpRight />
      </Link>
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={() => downloadFile(props.path)}>
        <Download />
      </Button>
    </div>
  );
}

const getPaymentSlipUrl = (filename: string) => {
  return supabase.storage.from("payment-slips").getPublicUrl(filename).data
    .publicUrl;
};

const downloadFile = async (filename: string) => {
  const { data, error } = await supabase.storage
    .from("payment-slips")
    .download(filename);

  if (error) {
    toast.error("Download failed");
    return;
  }

  const url = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.split("/").pop() || "payment-slip";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
