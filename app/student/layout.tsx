import { auth } from "@/auth";
import DashBreadcrumbs from "@/components/admin/dash-breadcrumbs";
import { AppSidebar } from "@/components/students/app-sidebar";
import PaymentUploadModal from "@/components/students/payment-blocker";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getPendingPaymentslip, getStudentBalance } from "@/data/student";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "Student dashboard for Workly Academy",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    redirect(`/login`);
  }

  if (session.user.role === "admin") {
    redirect(`/${session.user.role}`);
  }

  // Create the userDetails object
  const userDetails = {
    name: session.user.firstname + " " + session.user.lastname,
    phone: session.user.phone,
    avatar: session.user.avatar ? session.user.avatar : "/avatars/shadcn.jpg",
  };

  const studentBalance = await getStudentBalance(session.user.id);
  const paymentSlip = await getPendingPaymentslip(session.user.id);
  const isPaid = Number(studentBalance) > 0;

  return (
    <div className="min-h-screen md:h-screen overflow-y-auto">
      <SidebarProvider>
        <AppSidebar userDetails={userDetails} />
        <SidebarInset>
          <header className="flex h-14 md:h-16 shrink-0 items-center gap-1 sm:gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            {session.user.role === "partner" && (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
                  <SidebarTrigger className="-ml-1 cursor-pointer scale-90 sm:scale-100" />
                  <Separator
                    orientation="vertical"
                    className="mr-1 sm:mr-2 data-[orientation=vertical]:h-4"
                  />
                  <DashBreadcrumbs className="text-sm sm:text-base" />
                </div>
                <Link
                  href={"/partner"}
                  className={
                    buttonVariants({ variant: "outline" }) +
                    " mr-10 text-sm sm:text-base"
                  }>
                  Go to Partner Dashboard
                </Link>
              </div>
            )}
            {session.user.role === "student" && (
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
                <SidebarTrigger className="-ml-1 cursor-pointer scale-90 sm:scale-100" />
                <Separator
                  orientation="vertical"
                  className="mr-1 sm:mr-2 data-[orientation=vertical]:h-4"
                />
                <DashBreadcrumbs className="text-sm sm:text-base" />
              </div>
            )}
          </header>
          <div className="px-4 sm:px-6 md:px-8 lg:px-10">
            {!isPaid && (
              <PaymentUploadModal
                successMsg={paymentSlip}
                userType={session?.user.role}
              />
            )}
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
