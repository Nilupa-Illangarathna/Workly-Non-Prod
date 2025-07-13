"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

function DashBreadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  // first one will have "/route". then second one should be "/route/second" not "/second"
  const combinedPathNames = pathSegments.map((_, index) =>
    pathSegments.slice(0, index + 1).join("/")
  );

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {pathSegments &&
          pathSegments.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={`/${combinedPathNames[index]}`}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </div>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default DashBreadcrumbs;
