"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { sendRegisterOTP } from "@/lib/notify";
import toast from "react-hot-toast";

const phoneSchema = z.object({
  phone: z.string().min(10, "Invalid phone number"),
});

const otpSchema = z.object({
  otp: z.string().min(6, "Must be 6 digits"),
});

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmpassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
  });

export function ForgotPasswordForm() {
  const [step, setStep] = useState<"phone" | "otp" | "reset">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });

  const handlePhoneSubmit = async (values: z.infer<typeof phoneSchema>) => {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000);
      const response = await fetch("/api/auth/generate-otp", {
        method: "POST",
        body: JSON.stringify({ phone: values.phone, otp }),
      });

      if (response.ok) {
        setError("");
        setSuccess("OTP sent successfully");
        setPhoneNumber(values.phone);
        await sendRegisterOTP(values.phone, otp);
        setStep("otp");
      } else {
        setSuccess("");
        setError("Phone number not found");
        toast.error("Phone number not found");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to send OTP");
      toast.error("Failed to send OTP");
    }
  };

  const handleOtpSubmit = async (values: z.infer<typeof otpSchema>) => {
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ phone: phoneNumber, otp: values.otp }),
      });

      if (response.ok) {
        setError("");
        setSuccess("OTP verified successfully");
        setStep("reset");
      } else {
        setSuccess("");
        setError("Invalid OTP");
      }
    } catch (error) {
      console.log(error);
      setError("Verification failed");
    }
  };

  const handlePasswordSubmit = async (
    values: z.infer<typeof passwordSchema>
  ) => {
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          phone: phoneNumber,
          password: values.password,
        }),
      });

      if (response.ok) {
        toast.success("Password reset successfully");
        setSuccess("Password reset successfully");
        window.location.href = "/login";
      } else {
        setError("Password reset failed");
      }
    } catch (error) {
      console.log(error);
      setError("Reset failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Chanage the title according to the ui */}
      {step === "phone" && (
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold">Forgot Password</h2>
          <p className="text-muted-foreground text-sm">
            Enter your phone and we will send you a OTP to verify your phone
            number.
          </p>
        </div>
      )}
      {step === "otp" && (
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-center">Verify OTP</h2>
          <p className="text-muted-foreground text-sm text-center">
            We have sent a 6-digit OTP to your phone number. Please enter the
            OTP to verify your phone number.
          </p>
        </div>
      )}
      {step === "reset" && (
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-center">Reset Password</h2>
          <p className="text-muted-foreground text-sm text-center">
            Enter a new password to reset your account password.
          </p>
        </div>
      )}

      {step === "phone" && (
        <Form {...phoneForm}>
          <form
            onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)}
            className="space-y-4">
            <FormField
              control={phoneForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <p className="text-red-500 text-sm w-full text-center my-3">
                {error}
              </p>
            )}
            {success && (
              <p className="text-green-500 text-sm w-full text-center my-3">
                {success}
              </p>
            )}
            <Button type="submit" className="w-full">
              Send OTP
            </Button>
          </form>
        </Form>
      )}

      {step === "otp" && (
        <Form {...otpForm}>
          <form
            onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
            className="space-y-4">
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter 6-digit OTP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Verify OTP
            </Button>
          </form>
        </Form>
      )}

      {step === "reset" && (
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
            className="space-y-4">
            <FormField
              control={passwordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="confirmpassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="confirmpassword"
                      placeholder="Enter new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Reset Password
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
