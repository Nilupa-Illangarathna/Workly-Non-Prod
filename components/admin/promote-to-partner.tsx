"use client";

import { useForm } from "react-hook-form";
import { activatePartner } from "@/actions/admin/users";
import { toast } from "react-hot-toast";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Boxes, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

export function PromoteToPartner({
  userId,
  type,
  label,
  level,
  partnerCommission,
}: {
  userId: string;
  type: string;
  label?: string;
  level: number;
  partnerCommission?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      commission: level === 1 ? 4800 : 0,
      companyname: "",
    },
  });

  const onSubmit = async (data: {
    commission: number;
    companyname: string;
  }) => {
    try {
      startTransition(async () => {
        const result = await activatePartner(
          userId,
          data.commission,
          data.companyname
        );
        if (result.success) {
          toast.success(result.success);
        }
      });
      setOpen(false);
    } catch (error) {
      toast.error("Approval failed: " + error);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "icon" ? (
          <Button variant={"outline"} size={"icon"}>
            <Boxes />
          </Button>
        ) : (
          <Button variant={"outline"}>
            {label ? label : "Promote to Partner"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Promote to a Partner?</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="companyname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="commission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commission Amount (LKR)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max={level === 1 ? 4800 : partnerCommission}
                      disabled={level === 1}
                      {...field}
                      value={field.value === 0 ? "" : field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      onFocus={(e) => e.target.select()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="default">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Promote to Partner"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
