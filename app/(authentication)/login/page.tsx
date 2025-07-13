import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";
import { auth } from "@/auth";
import ThemedLogoLink from "@/components/themed-logo-link";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect(session.user.role);
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <ThemedLogoLink href="/" />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          width={1000}
          height={700}
          src="/register_bg.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
