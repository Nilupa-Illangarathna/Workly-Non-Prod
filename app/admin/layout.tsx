import DashBreadcrumbs from "@/components/admin/dash-breadcrumbs";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ThemeToggler } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for Workly LMS",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect(`/${session.user.role}`);
  }

  // Create the userDetails object
  const userDetails = {
    name: session.user.firstname + " " + session.user.lastname,
    phone: session.user.phone,
    avatar: session.user.avatar ? session.user.avatar : "/avatars/shadcn.jpg",
  };

  return (
    <div className="min-w-screen min-h-screen h-screen overflow-y-auto">
      <SidebarProvider>
        <AppSidebar userDetails={userDetails} />
        <SidebarInset className="w-full overflow-x-hidden">
          <header className="flex h-16 px-4 shrink-0 items-center justify-between transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 cursor-pointer" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <DashBreadcrumbs />
            </div>
            <ThemeToggler />
          </header>
          <div className="w-full overflow-x-hidden px-2 sm:px-4 md:px-6 lg:px-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
