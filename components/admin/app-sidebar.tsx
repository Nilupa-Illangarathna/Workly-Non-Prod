"use client";

import * as React from "react";
import {
  BadgePercent,
  ChartLine,
  ChevronDown,
  ChevronRight,
  Coins,
  GraduationCap,
  HandCoins,
  LayoutDashboard,
  NotebookPen,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { NavUser } from "@/components/admin/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useTransitionRouter } from "next-view-transitions";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import Link from "next/link";

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
  const router = useTransitionRouter();

  const handleRoute = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    link: string
  ) => {
    e.preventDefault();
    router.push(link, { onTransitionReady: pageAnimation });
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarHeader>
          <Image
            src={open ? "/Logo_for_dark_theme.png" : "/small_logo.png"}
            alt="Workly Logo"
            onClick={() =>
              router.push("/admin", { onTransitionReady: pageAnimation })
            }
            className="cursor-pointer transition-all duration-200 ease-in-out my-4"
            width={open ? 100 : 200}
            height={open ? 50 : 200}
          />
        </SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="space-y-2 w-11/12 mx-auto">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setOpenMobile(false)}
              asChild
              isActive={pathname === "/admin"}>
              <Link
                href="/admin"
                onClick={(e) => handleRoute(e, "/admin")}
                className="w-full items-center gap-x-2.5">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Collapsible className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <div className="flex items-center gap-x-2.5">
                    <NotebookPen size={16} />
                    <span>Pending Approvals</span>
                  </div>
                  <ChevronRight className="ml-auto group-data-[state=open]/collapsible:hidden" />
                  <ChevronDown className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {data.pendings.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={pathname === item.url}
                        onClick={() => setOpenMobile(false)}>
                        <Link
                          href={item.url}
                          onClick={(e) => handleRoute(e, item.url)}
                          className="w-full items-center gap-x-2.5">
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          {data.sidebarmenu.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                tooltip={item.title}
                onClick={() => setOpenMobile(false)}>
                <Link
                  href={item.url}
                  onClick={(e) => handleRoute(e, item.url)}
                  className="w-full items-center gap-x-2.5">
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userDetails} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

// This is sample data.
const data = {
  user: {
    name: "Workly Admin",
    email: "info@workly.com",
    avatar: "/avatars/shadcn.jpg",
  },
  pendings: [
    {
      title: "Users",
      url: "/admin/registrations",
      icon: UserRound,
    },
    { title: "Payments", url: "/admin/payments", icon: Coins },
    { title: "KYC", url: "/admin/kyc", icon: ShieldCheck },
    {
      title: "Withdrawals",
      url: "/admin/withdrawals",
      icon: HandCoins,
    },
  ],
  sidebarmenu: [
    {
      title: "Registry",
      url: "/admin/registry",
      icon: NotebookPen,
    },
    {
      title: "LMS",
      url: "/admin/lms",
      icon: GraduationCap,
    },
    {
      title: "Payment History",
      url: "/admin/payment-history",
      icon: Coins,
    },
    {
      title: "Withdrawal History",
      url: "/admin/withdrawal-history",
      icon: HandCoins,
    },
    {
      title: "SD Panel",
      url: "/admin/sd-panel",
      icon: BadgePercent,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: ChartLine,
    },
  ],
};

const pageAnimation = () => {
  document.documentElement.animate(
    [
      { opacity: 1, scale: 1, transform: "translateX(0)" },
      { opacity: 0.5, scale: 0.9, transform: "translateX(100px)" },
    ],
    {
      duration: 1000,
      easing: "cubic-bezier(0.76, 0, 0.24, 1)",
      fill: "forwards",
      pseudoElement: "::view-transition-old(root)",
    }
  );

  document.documentElement.animate(
    [{ transform: "translateX(-100%)" }, { transform: "translateX(0)" }],
    {
      duration: 1000,
      easing: "cubic-bezier(0.76, 0, 0.24, 1)",
      fill: "forwards",
      pseudoElement: "::view-transition-new(root)",
    }
  );
};
