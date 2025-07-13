"use client";

import * as React from "react";
import {
  ChartLine,
  CircleCheckBig,
  Coins,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";

import { NavUser } from "@/components/students/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { ThemeToggler } from "../theme-toggle";
import { Link } from "next-view-transitions";
import { usePathname, useRouter } from "next/navigation";

// This is sample data.
const data = {
  user: {
    name: "Workly Admin",
    email: "info@workly.com",
    avatar: "/avatars/shadcn.jpg",
  },
  students: [
    {
      title: "Courses",
      url: "/student/courses",
      icon: GraduationCap,
    },
    {
      title: "Exams",
      url: "/student/exams",
      icon: ListChecks,
    },
    {
      title: "Results",
      url: "/student/results",
      icon: CircleCheckBig,
    },
  ],
  platform: [
    {
      title: "Invoice",
      url: "/student/invoice",
      icon: Coins,
    },
    {
      title: "Profile",
      url: "/student/profile",
      icon: ChartLine,
    },
  ],
};

interface AppSidebarProps {
  props?: React.ComponentProps<typeof Sidebar>;
  userDetails: {
    name: string;
    phone: string;
    avatar: string;
  };
}

export function AppSidebar({ userDetails, ...props }: AppSidebarProps) {
  const { open, setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarHeader>
          <div
            className={`flex items-center ${
              open ? "justify-between mx-3 mt-3" : ""
            }`}>
            <Image
              src={open ? "/Logo_for_dark_theme.png" : "/small_logo.png"}
              alt="Workly Logo"
              onClick={() => router.push("/student")}
              className="cursor-pointer transition-all duration-200 ease-in-out"
              width={open ? 100 : 200}
              height={open ? 50 : 200}
            />
            {open && <ThemeToggler />}
          </div>
        </SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup key={0}>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuButton
              onClick={() => setOpenMobile(false)}
              isActive={pathname === "/partner"}
              asChild>
              <Link href="/student" className="w-full items-center gap-x-2.5">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup key={1}>
          <SidebarGroupLabel>Referrals</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.students.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/partner"}
                    tooltip={item.title}
                    onClick={() => setOpenMobile(false)}>
                    <Link
                      href={item.url}
                      className="w-full items-center gap-x-2.5">
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup key={3}>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.platform.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/partner"}
                    tooltip={item.title}
                    onClick={() => setOpenMobile(false)}>
                    <Link
                      href={item.url}
                      className="w-full items-center gap-x-2.5">
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="w-full">
          <NavUser user={userDetails} />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
