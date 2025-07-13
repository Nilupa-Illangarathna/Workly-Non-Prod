"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CloudUpload, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { uploadProfilePic } from "@/actions/update-profile-pic";
import toast from "react-hot-toast";

export const formSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5_000_000, {
      message: "File size must be less than 5MB",
    })
    .refine(
      (file) => {
        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/svg",
          "image/gif",
        ];
        return validTypes.includes(file.type);
      },
      {
        message:
          "Invalid file type. Only JPEG, JPG, PNG, SVG, and GIF are allowed.",
      }
    ),
});

const UploadProfilePic = ({
  className,
  profilepic,
}: {
  className: string;
  profilepic: string;
}) => {
  const [previewUrl, setPreviewUrl] = React.useState<string>(profilepic);
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const res = await uploadProfilePic(values);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success!);
      }

      form.reset();
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn("", className)} asChild>
        <Button variant="default" size={"icon"} className="rounded-full">
          <CloudUpload className="font-bold" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogDescription>
            Select a new profile picture to update your account.
          </DialogDescription>
        </DialogHeader>
        {/* Form to upload the picture to the storage bucket */}
        <div className="w-full grid grid-cols-3 items-center justify-center space-y-4">
          <Image
            src={previewUrl}
            width={128}
            height={128}
            alt="Profile Preview"
            className="h-32 w-32 rounded-full object-cover object-center"
          />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 col-span-2">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          field.onChange(file);
                          setPreviewUrl(
                            URL.createObjectURL((file as File) || new Blob())
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
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadProfilePic;
