"use client";

import * as React from "react";
import { useTransition, useState } from "react";
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
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { editPayment } from "@/actions/admin/payments";

// Define the props for the component
interface EditPaymentDialogProps {
  paymentId: string;
  userId: string;
  currentAmount: number;
}

// Define the Zod schema for form validation
const formSchema = z.object({
  amount: z.coerce // Use coerce to convert string input to number
    .number({ invalid_type_error: "Amount must be a number." })
    .positive({ message: "Amount must be a positive number." }),
});

export function EditPaymentDialog({
  paymentId,
  userId,
  currentAmount,
}: EditPaymentDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: currentAmount,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const result = await editPayment(paymentId, userId, values.amount);
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success(result?.success || "Payment updated successfully!");
          setTimeout(() => setIsOpen(false), 2000);
        }
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={"outline"}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Payment</DialogTitle>
          <DialogDescription>
            Update the amount for payment ID: {paymentId}. <br />
            Current amount: ${currentAmount.toFixed(2)}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="amount">New Amount</FormLabel>
                  <FormControl>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01" // Allows decimal input for currency
                      placeholder="Enter new amount"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
