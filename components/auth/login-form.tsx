"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { loginSchema } from "@/schemas";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Label } from "../ui/label";
import { AlertCircle, Eye } from "lucide-react";
import { loginUser } from "@/actions/auth/login";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

type FormValues = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      loginId: "",
      password: "",
    },
  });

  function onSubmit(data: FormValues) {
    startTransition(() => {
      loginUser(data)
        .then((result) => {
          if (result?.error) {
            setError(result.error);
            toast.error(result.error);
            return;
          }
          if (result?.success) {
            toast.success("Login successful");
            router.push("/dashboard");
          }
        })
        .catch((error) => {
          setError(error.message);
          toast.error(error.message);
        });
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold ">Login to your account</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle size={30} />
              <AlertTitle>Login Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="loginId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Login ID *</FormLabel>
                  <FormControl>
                    <Input placeholder="07xxxxxxxx" className="" {...field} />
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
                  <FormLabel>
                    <div className="w-full flex justify-between items-center">
                      <Label>Password *</Label>
                      <Link href="/forgot-password" className="text-balance">
                        Forgot Password?
                      </Link>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Enter your password"
                        className=""
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
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
      </Form>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </div>
  );
}
