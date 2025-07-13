import { auth } from "@/auth";
import { ThemeToggler } from "@/components/theme-toggle";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (session) {
    if (session.user.role === "student") {
      redirect(`/${session.user.role}`);
    } else if (session.user.role === "admin") {
      redirect(`/${session.user.role}`);
    } else if (session.user.role === "partner") {
      redirect(`/${session.user.role}`);
    }
  }

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          Loading...
        </div>
      }>
      <SessionProvider>
        <div className="absolute top-0 left-0 w-full h-screen bg-background overflow-hidden">
          <div className="relative w-full">
            <ThemeToggler className="absolute top-4 right-4 z-50" />
            {children}
          </div>
        </div>
      </SessionProvider>
    </Suspense>
  );
}
