// components/partner-active.tsx (Partner)
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";

export function PartnerApprove({ userId }: { userId: string }) {
  const form = useForm({
    defaultValues: { commission: 0, companyname: "" },
  });

  const onSubmit = async (data: {
    commission: number;
    companyname: string;
  }) => {
    try {
      const result = await activatePartner(
        userId,
        data.commission,
        data.companyname
      );
      if (result.success) {
        toast.success(result.success);
      }
    } catch (error) {
      toast.error("Approval failed: " + error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"default"} size={"icon"}>
          <Check />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="companyname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name (Optional)</FormLabel>
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
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <Button type="submit" variant="default">
                  Approve Partner
                </Button>
                <Button type="button" variant="destructive">
                  Reject
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
