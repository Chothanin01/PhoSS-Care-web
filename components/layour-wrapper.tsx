"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/shadcn/ui/sidebar";

export function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const withSidebar = /(view|edit)/.test(pathname);

  if (!withSidebar) {
    return <main className="pt-28 px-6">{children}</main>;
  }

  return (
    <SidebarProvider>
      <div>
        <AppSidebar />
        <SidebarInset>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
