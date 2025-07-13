"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { BadgeCheck, BadgeX, Banknote, Clipboard } from "lucide-react";
import { SignOut } from "../signout-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { Progress } from "../ui/progress";
import axios from "axios";

const paymentSchema = z.object({
  amount: z.string().nonempty().min(1, "Amount is required"),
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5_000_000,
      "File size must be less than 5MB"
    ),
});

export default function PaymentUploadModal({
  successMsg,
  userType,
}: {
  successMsg: string | null;
  userType: string;
}) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(successMsg);
  const [open, setOpen] = useState<boolean>(true);

  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: { amount: "0", file: undefined },
  });

  const handleUpload = async (values: z.infer<typeof paymentSchema>) => {
    if (!values.file) return toast.error("Please upload a file");

    const formData = new FormData();
    formData.append("amount", values.amount);
    formData.append("file", values.file);

    try {
      setIsUploading(true);
      setError(null);

      const response = await axios.post("/api/upload-payment", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percentCompleted);
        },
      });

      if (response.data.success) {
        setSuccess(response.data.success);
        toast.success("Payment uploaded successfully");
        form.reset();
        setOpen(false);
      }
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.error || "Upload failed"
        : "Unknown error occurred";
      setError(message);
      toast.error(message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md bg-background">
        <div className="z-50 absolute top-5 right-5 cursor-pointer">
          <SignOut buttonVariant={"outline"} className="w-32" />
        </div>
        <DialogHeader>
          <div className="flex items-center gap-2 mb-4">
            <DialogTitle className="text-left">Payment Required</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            You must complete your payment to access the dashboard. Please
            upload your payment slip with your NIC number as reference.
          </DialogDescription>
        </DialogHeader>

        {/* Payment Details Section */}
        <div className="border rounded-lg p-4 mb-6 space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Banknote className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Bank Transfer Details</h3>
          </div>

          <div className="space-y-1.5 text-xs md:text-sm">
            <div className="grid grid-cols-2 items-center">
              <span className="text-muted-foreground">Bank Name:</span>
              <div className="flex items-center justify-end text-right gap-2">
                <span>Sampath Bank</span>
                <Clipboard
                  className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-primary"
                  onClick={() => copyToClipboard("Sampath Bank")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 items-center">
              <span className="text-muted-foreground">Account Number:</span>
              <div className="flex items-center justify-end text-right gap-2">
                <span>0220 1000 1289</span>
                <Clipboard
                  className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-primary"
                  onClick={() => copyToClipboard("0220 1000 1289")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 items-center">
              <span className="text-muted-foreground">Account Holder:</span>
              <div className="flex items-center justify-end text-right gap-2">
                <span>Gainro Global Group (Pvt) Ltd</span>
                <Clipboard
                  className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-primary"
                  onClick={() =>
                    copyToClipboard("Gainro Global Group (Pvt) Ltd")
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 items-center">
              <span className="text-muted-foreground">Branch:</span>
              <div className="flex items-center justify-end text-right gap-2">
                <span>Heerassagala Branch</span>
                <Clipboard
                  className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-primary"
                  onClick={() => copyToClipboard("Heerassagala Branch")}
                />
              </div>
            </div>
          </div>
        </div>

        {!success && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpload)}
              className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Slip</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                          className="w-full cursor-pointer bg-white pl-0 py-0 file:h-full file:bg-highlight-yellow/40 file:text-[#333] file:px-4 file:ml-0 file:mr-4 hover:file:bg-highlight-yellow/80 transition-all duration-200 ease-in-out"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isUploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
              <Button
                type="submit"
                disabled={isUploading}
                className="w-full mt-4">
                {isUploading ? "Uploading..." : "Upload Payment Slip"}
              </Button>
              {userType === "partner" && (
                <Link
                  href={"/partner"}
                  className={
                    buttonVariants({ variant: "outline" }) +
                    " text-sm sm:text-base w-full"
                  }>
                  Go to Partner Dashboard
                </Link>
              )}
            </form>
          </Form>
        )}
        {error && (
          <Alert variant="destructive">
            <BadgeX className="h-4 w-4" />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert variant="default">
            <BadgeCheck className="h-4 w-4" />
            <AlertTitle className="text-green-700 font-semibold uppercase tracking-wide">
              Payment slip successfully uploaded!
            </AlertTitle>
            <AlertDescription className="text-primary">
              Payment uploaded successfully. Please wait until our admins
              approve your payment.
            </AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
}
