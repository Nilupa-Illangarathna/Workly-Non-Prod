"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
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
import { toast } from "react-hot-toast";
import { z } from "zod";
import React, { useState, useTransition } from "react";
import { createWithdrawalRequest } from "@/actions/partners/withdrawal";
import Link from "next/link";
import { PaymentMethods } from "@/types";
import { Loader2 } from "lucide-react";

export function WithdrawalDialog({
  balance,
  paymentMethods,
  buttonStyles,
  buttonType,
}: {
  balance: number;
  paymentMethods: PaymentMethods[];
  buttonStyles?: string;
  buttonType?: "default" | "secondary" | "outline" | "link";
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const formSchema = z.object({
    amount: z.coerce
      .number()
      .min(1, "Amount must be at least LKR 1")
      .max(balance),
    method: z.string().min(1, "Method is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const result = await createWithdrawalRequest(values);
        if (result?.error) {
          toast.error(result.error);
          return;
        }

        toast.success("Withdrawal request submitted!");
        form.reset();
        setOpen(false);
      } catch (error) {
        toast.error(`Something went wrong: ${error}`);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonType || "default"} className={buttonStyles}>
          Withdraw Money
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
        </DialogHeader>
        {paymentMethods.length === 0 ? (
          <div className="space-y-4">
            <p className="text-red-500">
              No payment methods found. Please add a payment method first.
            </p>
            <Button asChild className="w-full">
              <Link href="/partner/profile">Add Payment Method</Link>
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            {method.type === "bank"
                              ? `${method.bank} - ****${method.number?.slice(
                                  -4
                                )}`
                              : `${method.type} - ${method.email}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      You can manage payment methods in your{" "}
                      <Link href="/partner/profile" className="underline">
                        profile settings
                      </Link>
                      .
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        min="1"
                        max={balance}
                        step="1"
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormDescription>
                      Available Balance: LKR {balance.toLocaleString()}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Withdraw"
                )}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
