"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { addSponsor } from "@/actions/admin/users";

// Define the schema for the form
const addSponsorFormSchema = z.object({
  sponsorWorklyId: z
    .string()
    .min(1, { message: "Sponsor Workly ID is required." }),
});

type AddSponsorFormValues = z.infer<typeof addSponsorFormSchema>;

export function AddSponsorDialog({ studentId }: { studentId: string }) {
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);

  const form = useForm<AddSponsorFormValues>({
    resolver: zodResolver(addSponsorFormSchema),
    defaultValues: {
      sponsorWorklyId: "",
    },
  });

  const onSubmit = (data: AddSponsorFormValues) => {
    startTransition(async () => {
      const result = await addSponsor(studentId, data.sponsorWorklyId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(result?.success || "Sponsor added successfully!");
        setOpen(false);
        form.reset();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Sponsor</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:w-1/2">
        <DialogHeader>
          <DialogTitle>Add Sponsor</DialogTitle>
          <DialogDescription>
            Enter the Workly ID of the sponsor to associate them with this
            student.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="sponsorWorklyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sponsor Workly ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter sponsor Workly ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add Sponsor"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
