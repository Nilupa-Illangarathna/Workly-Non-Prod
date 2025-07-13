"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerSchema } from "@/schemas";
import { CountryDropdown } from "../ui/country-dropdown";
import { registerUser } from "@/actions/auth/register";
import { useEffect, useState, useTransition } from "react";
import AuthError from "./auth-error";
import toast from "react-hot-toast";
import AuthSuccess from "./auth-success";
import { Eye, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type FormValues = z.infer<typeof registerSchema>;

export function RegistrationForm({ sponsorID }: { sponsorID?: string | null }) {
  const router = useRouter();
  const [errors, setErrors] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isMount, setIsMount] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    setIsMount(true);
  }, [isMount]);

  const form = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      terms: false,
      sponsor: sponsorID || "",
    },
  });

  function createLoginID(phone: string) {
    const loginID = phone.replace(/[^0-9]/g, "");
    form.setValue("loginId", loginID);
  }

  function onSubmit(data: FormValues) {
    startTransition(() => {
      registerUser(data).then((result) => {
        if (result?.error) {
          setSuccess("");
          setErrors(result.error);
          toast.error(result.error);
        }
        if (result?.success) {
          setErrors("");
          setSuccess(
            "You registered successfully! You will receive a notification once you have been approved. Thank You!"
          );
          toast.success(
            "You registered successfully! You will receive a notification once you have been approved. Thank You!"
          );
          form.reset();
          router.push("/dashboard");
        }
      });
    });
  }

  if (!isMount) {
    return null;
  }

  return (
    <div className="w-full h-full bg-background p-8 xl:px-12">
      <h1 className="text-2xl font-bold text-center text-dark dark:text-light mb-10 uppercase">
        Registration
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 pb-10">
          <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your First Name"
                      className="bg-light dark:bg-dark"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your Last Name"
                      className="bg-light dark:bg-dark"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nicNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIC / DL / Passport Number *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="NIC / DL / Passport Number"
                      className="bg-light dark:bg-dark"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="07xxxxxxxx"
                      className="bg-light dark:bg-dark"
                      onChangeCapture={(e) => {
                        createLoginID((e.target as HTMLInputElement).value);
                      }}
                      {...field}
                    />
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
                  <FormLabel>WhatsApp Number *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="07xxxxxxxx"
                      className="bg-light dark:bg-dark"
                      {...field}
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
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your Email Address"
                      className="bg-light dark:bg-dark"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-light dark:bg-dark">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="si">Sinhala</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="lg:col-span-2">
                  <FormLabel>Address *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your Address"
                      className="bg-light dark:bg-dark"
                      {...field}
                    />
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

            <FormField
              control={form.control}
              name="sponsor"
              render={({ field }) => (
                <FormItem className="lg:col-span-2">
                  <FormLabel>Sponsor</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your Sponsor"
                      className="bg-light dark:bg-dark"
                      {...field}
                      disabled={!!sponsorID}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="lg:col-span-2 p-6 border border-primary rounded-lg space-y-4 bg-muted/50">
              <FormField
                control={form.control}
                name="loginId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Login ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Login ID"
                        className="bg-light dark:bg-dark"
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={passwordVisible ? "text" : "password"}
                          placeholder="Enter your password"
                          className="bg-light dark:bg-dark"
                          {...field}
                        />
                        <div
                          onClick={() => {
                            setPasswordVisible(!passwordVisible);
                          }}
                          className="absolute top-1/2 right-2 -translate-y-1/2 hover:bg-transparent cursor-pointer p-2 bg-background text-gray-500 text-sm">
                          <Eye size={16} />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={passwordVisible ? "text" : "password"}
                          placeholder="Enter your password"
                          className="bg-light dark:bg-dark"
                          {...field}
                        />
                        <div
                          onClick={() => {
                            setPasswordVisible(!passwordVisible);
                          }}
                          className="absolute top-1/2 right-2 -translate-y-1/2 hover:bg-transparent cursor-pointer p-2 bg-background text-gray-500 text-sm">
                          <Eye size={16} />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="lg:col-span-2 flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-primary text-primary data-[state=checked]:bg-primary"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal">
                      I accept{" "}
                      <Link
                        href="#"
                        className="text-primary hover:text-secondary">
                        Terms and Conditions
                      </Link>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {errors && <AuthError message={errors} />}
            {success && <AuthSuccess message={success} />}

            <div
              className={
                "w-full h-10 flex items-center justify-center gap-x-5 lg:col-span-2"
              }>
              {!success && (
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              )}
              {success && (
                <Link
                  href={"/student"}
                  className={buttonVariants({ variant: "outline" })}>
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
