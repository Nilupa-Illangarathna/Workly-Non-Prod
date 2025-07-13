import { auth } from "@/auth";
import DashBreadcrumbs from "@/components/admin/dash-breadcrumbs";
import { AppSidebar } from "@/components/partners/app-sidebar";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cache } from "react";

const getCachedAuth = cache(auth);
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Partner Dashboard",
  description: "Partner dashboard for Workly Academy",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCachedAuth();

  if (!session) redirect(`/login`);
  if (session.user.role !== "partner") redirect(`/${session.user.role}`);

  const userDetails = {
    name: `${session.user.firstname} ${session.user.lastname}`,
    phone: session.user.phone,
    avatar: session.user.avatar || "/avatars/shadcn.jpg",
  };

  return (
    <div className="min-w-screen min-h-screen md:h-screen overflow-y-auto">
      <SidebarProvider>
        <AppSidebar userDetails={userDetails} />
        <SidebarInset className="w-full overflow-x-hidden">
          <header className="flex h-14 md:h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
                <SidebarTrigger className="-ml-1 cursor-pointer scale-90 sm:scale-100" />
                <Separator
                  orientation="vertical"
                  className="mr-1 sm:mr-2 data-[orientation=vertical]:h-4"
                />
                <DashBreadcrumbs />
              </div>
              <Link
                href={`/student`}
                className={
                  buttonVariants({ variant: "outline" }) +
                  "!w-40 mr-10 text-sm sm:text-base"
                }>
                Go to LMS
              </Link>
            </div>
          </header>
          <div className="w-full overflow-x-hidden px-2 sm:px-4 md:px-6 lg:px-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
