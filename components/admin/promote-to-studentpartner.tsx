"use client";

import { useForm } from "react-hook-form";
import { activateStudentPartner } from "@/actions/admin/users";
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
import { useTransition } from "react";

export function PromoteToStudnetPartner({
  userId,
  type,
  label,
}: {
  userId: string;
  type: string;
  label?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    defaultValues: { commission: 0, companyname: "" },
  });

  const onSubmit = async (data: {
    commission: number;
    companyname: string;
  }) => {
    try {
      startTransition(async () => {
        const result = await activateStudentPartner(
          userId,
          data.commission,
          data.companyname
        );
        if (result.success) {
          toast.success(result.success);
        }
      });
    } catch (error) {
      toast.error("Approval failed: " + error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {type === "icon" ? (
          <Button variant={"outline"} size={"icon"}>
            <Boxes />
          </Button>
        ) : (
          <Button variant={"outline"}>
            {label ? label : "Promote Student Partner"}
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
                    <Input type="text" min="0" {...field} />
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
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                "Promote to Student-Partner"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
