"use client";

import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadKYC } from "@/actions/kyc";
import { kycSchema } from "@/schemas";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { KYCData } from "@/types";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const KycUpload = ({ kyc }: { kyc: KYCData | null }) => {
  const [previewUrlFront, setPreviewUrlFront] = React.useState<string>(
    kyc?.idfront ?? "/ID_front_template.png"
  );
  const [previewUrlBack, setPreviewUrlBack] = React.useState<string>(
    kyc?.idback ?? "/ID_back_template.png"
  );
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);
  const [kycType, setKycType] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof kycSchema>>({
    resolver: zodResolver(kycSchema),
  });

  function onSubmit(values: z.infer<typeof kycSchema>) {
    startTransition(async () => {
      const res = await uploadKYC(values);

      if (res.error) {
        toast.error(res.error);
        setPreviewUrlFront("/ID_front_template.png");
        setPreviewUrlBack("/ID_back_template.png");
      } else {
        toast.success(res.success!);
        setPreviewUrlFront("/ID_front_template.png");
        setPreviewUrlBack("/ID_back_template.png");
      }

      form.reset();
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="w-full"
          disabled={kyc?.status === "pending"}>
          {kyc ? "Update KYC" : "Upload KYC"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2/3 h-2/3 lg:h-fit overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Identity Document</DialogTitle>
          <DialogDescription>
            Please upload your NIC documents for verification. Make sure the
            images are clear and readable and in the correct format.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full mt-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-8">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>KYC Type</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setKycType(value);
                      }}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-light dark:bg-dark w-full lg:w-96">
                          <SelectValue placeholder="Select a KYC type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="nic">NIC</SelectItem>
                        <SelectItem value="driving">Driving License</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {kycType === "passport" ? (
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-center justify-center ">
                  <div className="relative w-full flex flex-col  items-start justify-center">
                    <FormLabel className="text-left mb-1 font-semibold">
                      Passport:
                    </FormLabel>
                    <Image
                      src={previewUrlFront || "/ID_front_template.png"}
                      width={128}
                      height={128}
                      alt="Profile Preview"
                      className={`h-64 w-full rounded-lg object-cover object-center ${
                        kyc?.idfront ? "" : "opacity-50 backdrop-blur-sm"
                      }`}
                    />
                    <FormField
                      control={form.control}
                      name="idfront"
                      render={({ field }) => (
                        <FormItem className="w-2/3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <FormControl>
                            <Input
                              type="file"
                              className="w-full bg-white/60 pl-0 py-0 file:h-full file:bg-primary/50 file:text-white file:px-4 file:ml-0 file:mr-4 hover:file:bg-primary/80"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                field.onChange(file);
                                setPreviewUrlFront(
                                  URL.createObjectURL(
                                    (file as File) || new Blob()
                                  )
                                );
                              }}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-center justify-center ">
                  <div className="relative w-full flex flex-col  items-start justify-center">
                    <FormLabel className="text-left mb-1 font-semibold">
                      {kycType === "nic"
                        ? "NIC Front:"
                        : "Driving License Front:"}
                    </FormLabel>
                    <Image
                      src={previewUrlFront || "/ID_front_template.png"}
                      width={128}
                      height={128}
                      alt="Profile Preview"
                      className={`h-64 w-full rounded-lg object-cover object-center ${
                        kyc?.idfront ? "" : "opacity-50 backdrop-blur-sm"
                      }`}
                    />
                    <FormField
                      control={form.control}
                      name="idfront"
                      render={({ field }) => (
                        <FormItem className="w-2/3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <FormControl>
                            <Input
                              type="file"
                              className="w-full bg-white/60 pl-0 py-0 file:h-full file:bg-primary/50 file:text-white file:px-4 file:ml-0 file:mr-4 hover:file:bg-primary/80"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                field.onChange(file);
                                setPreviewUrlFront(
                                  URL.createObjectURL(
                                    (file as File) || new Blob()
                                  )
                                );
                              }}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="relative w-full flex flex-col  items-start justify-center">
                    <FormLabel className="text-left mb-1 font-semibold">
                      {kycType === "nic"
                        ? "NIC Back:"
                        : "Driving License Back:"}
                    </FormLabel>
                    <Image
                      src={previewUrlBack || "/ID_back_template.png"}
                      width={128}
                      height={128}
                      alt="Profile Preview"
                      className={`h-64 w-full rounded-lg object-cover object-center ${
                        kyc?.idback ? "" : "opacity-50 backdrop-blur-sm"
                      }`}
                    />
                    <FormField
                      control={form.control}
                      name="idback"
                      render={({ field }) => (
                        <FormItem className="w-2/3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <FormControl>
                            <Input
                              type="file"
                              className="w-full bg-white/60 pl-0 py-0 file:h-full file:bg-primary/50 file:text-white file:px-4 file:ml-0 file:mr-4 hover:file:bg-primary/80"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                field.onChange(file);
                                setPreviewUrlBack(
                                  URL.createObjectURL(
                                    (file as File) || new Blob()
                                  )
                                );
                              }}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                              disabled={kycType === "passport"}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="col-span-2 w-full lg:w-96"
                disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Identity Document"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KycUpload;
