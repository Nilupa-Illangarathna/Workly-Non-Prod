"use client";

import { useForm } from "react-hook-form";
import React, { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle, HandCoins, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
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
import { handleStudentPayment } from "@/actions/admin/students";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const UpdateStudentPayments = ({ studentid }: { studentid: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const form = useForm({
    defaultValues: { amount: 0 },
  });

  const onSubmit = async (data: { amount: number }) => {
    startTransition(async () => {
      const result = await handleStudentPayment(studentid, data.amount);
      if (result.success) {
        toast.success(result.message);
        setSuccess(result.message);
        setError(null);
      } else {
        toast.error(result.message);
        setError(result.message);
        setSuccess(null);
      }
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"outline"}>
          <HandCoins />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Student Fee Payment</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (LKR)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" variant="default" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStudentPayments;
