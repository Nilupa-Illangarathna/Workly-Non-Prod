"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import axios from "axios";
import { Progress } from "../ui/progress";

const paymentSchema = z.object({
  amount: z
    .number({ message: "Only numbers can be accepted" })
    .min(1, "Amount is required"),
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5_000_000,
      "File size must be less than 5MB"
    ),
});

export default function PaymentUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: { amount: 0, file: undefined },
  });

  const handleUpload = async (values: z.infer<typeof paymentSchema>) => {
    if (!values.file) return toast.error("Please upload a file");

    const formData = new FormData();
    formData.append("amount", values.amount.toString());
    formData.append("file", values.file);

    try {
      setIsUploading(true);

      const response = await axios.post("/api/upload-payment", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percentCompleted);
        },
      });

      if (response.data.success) {
        toast.success("Payment uploaded successfully");
        form.reset();
        setOpen(false);
      }
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.error || "Upload failed"
        : "Unknown error occurred";
      toast.error(message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Upload Payment Slip</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Payment Slip</DialogTitle>
          <DialogDescription>
            Please upload your payment slip here. The file size should be less
            than 5MB.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpload)}
              className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (LKR)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
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
                      <Input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        className="w-full cursor-pointer bg-white pl-0 py-0 file:h-full file:bg-highlight-yellow/40 file:text-[#333] file:px-4 file:ml-0 file:mr-4 hover:file:bg-highlight-yellow/80 transition-all duration-200 ease-in-out"
                      />
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

              <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Payment"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
