"use client";

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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema } from "@/schemas";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2, UserRoundPen } from "lucide-react";
import { dbUser } from "@/types";
import toast from "react-hot-toast";
import { updateUserDetails } from "@/actions/admin/update-user-details";
import { CountryDropdown } from "../ui/country-dropdown";
import { cn } from "@/lib/utils";

type FormData = z.infer<typeof updateUserSchema>;

export default function EditDetailsCard({
  user,
  buttonStyle,
}: {
  user: dbUser;
  buttonStyle?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      fullname: user.fullname || "",
      nicnumber: user.nicnumber || "",
      dateofbirth: user.dateofbirth || "",
      email: user.email || "",
      phone: user.phone || "",
      whatsapp: user.whatsapp || "",
      address: user.address || "",
      district: user.district || "",
      postalcode: user.postalcode || undefined,
      country: user.country || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    startTransition(async () => {
      const res = await updateUserDetails(data, user.id, user.role);
      if (res.success) {
        toast.success("Profile updated successfully");
        router.refresh();
        setOpen(false);
      } else {
        toast.error("Failed to update profile");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn("w-full", buttonStyle)}>
          <UserRoundPen />
          Edit Details
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-2xl w-2/3">
        <DialogHeader>
          <DialogTitle>Edit Profile Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name: </FormLabel>
                  <FormControl>
                    <Input placeholder="Your First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name: </FormLabel>
                  <FormControl>
                    <Input placeholder="Your Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name: </FormLabel>
                  <FormControl>
                    <Input placeholder="Your Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nicnumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIC Number: </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your NIC Number"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateofbirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Select your Birthdate"
                      className="bg-light dark:bg-dark"
                      type="date"
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      value={
                        field.value
                          ? field.value.toISOString().split("T")[0]
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email: </FormLabel>
                  <FormControl>
                    <Input placeholder="Your Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone: </FormLabel>
                  <FormControl>
                    <Input placeholder="Your Phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp: </FormLabel>
                  <FormControl>
                    <Input placeholder="Your WhatsApp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address: </FormLabel>
                  <FormControl>
                    <Input placeholder="Your Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-light dark:bg-dark">
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="colombo">Colombo</SelectItem>
                      <SelectItem value="gampaha">Gampaha</SelectItem>
                      <SelectItem value="kalutara">Kalutara</SelectItem>
                      <SelectItem value="kandy">Kandy</SelectItem>
                      <SelectItem value="matale">Matale</SelectItem>
                      <SelectItem value="nuwara-eliya">Nuwara Eliya</SelectItem>
                      <SelectItem value="galle">Galle</SelectItem>
                      <SelectItem value="matara">Matara</SelectItem>
                      <SelectItem value="hambantota">Hambantota</SelectItem>
                      <SelectItem value="jaffna">Jaffna</SelectItem>
                      <SelectItem value="kilinochchi">Kilinochchi</SelectItem>
                      <SelectItem value="mannar">Mannar</SelectItem>
                      <SelectItem value="vavuniya">Vavuniya</SelectItem>
                      <SelectItem value="mullaitivu">Mullaitivu</SelectItem>
                      <SelectItem value="batticaloa">Batticaloa</SelectItem>
                      <SelectItem value="ampara">Ampara</SelectItem>
                      <SelectItem value="trincomalee">Trincomalee</SelectItem>
                      <SelectItem value="kurunegala">Kurunegala</SelectItem>
                      <SelectItem value="puttalam">Puttalam</SelectItem>
                      <SelectItem value="anuradhapura">Anuradhapura</SelectItem>
                      <SelectItem value="polonnaruwa">Polonnaruwa</SelectItem>
                      <SelectItem value="badulla">Badulla</SelectItem>
                      <SelectItem value="moneragala">Moneragala</SelectItem>
                      <SelectItem value="ratnapura">Ratnapura</SelectItem>
                      <SelectItem value="kegalle">Kegalle</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code: </FormLabel>
                  <FormControl>
                    <Input placeholder="Your Postal Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              defaultValue="LKA"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country *</FormLabel>
                  <CountryDropdown
                    defaultValue={field.value || "LKA"}
                    placeholder="Select country"
                    onChange={(country) => {
                      field.onChange(country.alpha3);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full col-span-2 mt-4"
              disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
