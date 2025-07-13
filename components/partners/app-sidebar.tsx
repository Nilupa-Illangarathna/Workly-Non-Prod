"use client";

import * as React from "react";
import {
  ChartLine,
  Coins,
  HandCoins,
  LayoutDashboard,
  NotebookPen,
  UserRound,
} from "lucide-react";

import { NavUser } from "@/components/partners/nav-user";
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
  students: [
    {
      title: "Registry",
      url: "/partner/registry",
      icon: NotebookPen,
    },
    // {
    //   title: "Users",
    //   url: "/partner/users",
    //   icon: UsersRound,
    // },
    {
      title: "Earnings",
      url: "/partner/earnings",
      icon: Coins,
    },
    {
      title: "Withdrawals",
      url: "/partner/withdrawals",
      icon: HandCoins,
    },
  ],
  platform: [
    {
      title: "Analytics",
      url: "/partner/analytics",
      icon: ChartLine,
    },
    {
      title: "Profile",
      url: "/partner/profile",
      icon: UserRound,
    },
  ],
};

// Types for pros
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
              onClick={() => router.push("/partner")}
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
              asChild
              isActive={pathname === "/partner"}>
              <Link href="/partner" className="w-full items-center gap-x-2.5">
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
                    isActive={pathname === item.url}
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
                    isActive={pathname === item.url}
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
