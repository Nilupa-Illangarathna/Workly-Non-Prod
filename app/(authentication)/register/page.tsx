"use client";

import { RegistrationForm } from "@/components/auth/register-form";
import ThemedLogoLink from "@/components/themed-logo-link";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const [isMount, setIsMount] = useState(false);

  useEffect(() => {
    setIsMount(true);
  }, []);

  if (!isMount) {
    return null;
  }

  return (
    <div className="w-full h-screen max-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background overflow-y-hidden">
      <div className="h-screen w-full overflow-y-scroll">
        <div className="w-11/12 flex items-center justify-between mx-auto mt-5">
          <ThemedLogoLink href="/" />
          <p className="text-muted-foreground hover:text-primary hover:underline ">
            <Link href="/login" className="underline">
              Already have an Account?
            </Link>
          </p>
        </div>
        <RegistrationForm sponsorID={ref} />
      </div>
      <div className="relative hidden bg-muted lg:block h-screen">
        <Image
          src="/register_bg.jpg"
          width={1000}
          height={700}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover object-center dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
