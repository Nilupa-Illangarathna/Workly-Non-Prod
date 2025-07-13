// components/sd-panel/commission-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateCommissions } from "@/actions/admin/update-commissions";
import { toast } from "react-hot-toast";

const formSchema = z.object({
  course_payment: z.string().min(1, "Required"),
  expenses: z.string().min(1, "Required"),
  development: z.string().min(1, "Required"),
  total_commission: z.string().min(1, "Required"),
  top_managers: z.string().min(1, "Required"),
  sub_company: z.string().min(1, "Required"),
});

export function CommissionForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      course_payment: "",
      expenses: "",
      development: "",
      total_commission: "",
      top_managers: "",
      sub_company: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateCommissions({
        course_payment: values.course_payment,
        expenses: values.expenses,
        development: values.development,
        total_commission: values.total_commission,
        top_managers: values.top_managers,
        sub_company: values.sub_company,
      });
      toast.success("Commissions updated successfully!");
    } catch (error) {
      toast.error("Failed to update commissions: " + String(error));
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="course_payment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Payment (LKR)</FormLabel>
              <FormControl>
                <Input {...field} type="string" step="0.01" />
              </FormControl>
              <FormDescription>Total course fee amount</FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expenses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expenses (LKR)</FormLabel>
              <FormControl>
                <Input {...field} type="string" step="0.01" />
              </FormControl>
              <FormDescription>
                Percentage of course payment allocated for expenses
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="development"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Development (LKR)</FormLabel>
              <FormControl>
                <Input {...field} type="string" step="0.01" />
              </FormControl>
              <FormDescription>
                Percentage allocated for development costs
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="total_commission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Commission (LKR)</FormLabel>
              <FormControl>
                <Input {...field} type="string" step="0.01" />
              </FormControl>
              <FormDescription>
                Total commission pool for distribution
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="top_managers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Top Managers Pool (LKR)</FormLabel>
              <FormControl>
                <Input {...field} type="string" step="0.01" />
              </FormControl>
              <FormDescription>
                Commission pool for top managers
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sub_company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sub Company Pool (LKR)</FormLabel>
              <FormControl>
                <Input {...field} type="string" step="0.01" />
              </FormControl>
              <FormDescription>
                Commission pool for sub companies
              </FormDescription>
            </FormItem>
          )}
        />

        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}
