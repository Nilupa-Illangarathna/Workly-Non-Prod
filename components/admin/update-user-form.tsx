// app/admin/users/[userId]/_components/update-user-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { updateUser } from "@/actions/admin/users";
import { useEffect } from "react";
import toast from "react-hot-toast";

const formSchema = z.object({
  firstname: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastname: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  district: z.string().min(2, {
    message: "District must be at least 2 characters.",
  }),
  whatsapp: z.string().min(10, {
    message: "WhatsApp number must be at least 10 digits.",
  }),
});

interface User {
  id: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  whatsapp: string;
}

export function UpdateUserForm({ user }: { user: User }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      email: user.email,
      address: user.address,
      district: user.district,
      whatsapp: user.whatsapp,
    },
  });

  useEffect(() => {
    form.reset({
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      email: user.email,
      address: user.address,
      district: user.district,
      whatsapp: user.whatsapp,
    });
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateUser(user.id, values);
      toast.success("User details updated successfully.");
    } catch (error) {
      toast.error("Failed to update user details: " + error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {/* First Name */}
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+94123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* WhatsApp */}
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp Number</FormLabel>
                <FormControl>
                  <Input placeholder="+94123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* District */}
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District</FormLabel>
                <FormControl>
                  <Input placeholder="Colombo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main Street, Colombo 05" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          Update Details
        </Button>
      </form>
    </Form>
  );
}
