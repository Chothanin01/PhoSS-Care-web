"use client";

import * as React from "react";
import { House, ClipboardCheck, User, LogOut } from "lucide-react";
import { NavMain } from "./nav-main";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from "@/shadcn/ui/sidebar";
import Link from "next/link";

export function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  const navMain = React.useMemo(
    () => [
      {
        url: "/patient",
        icon: House,
      },
      {
        url: "/approve",
        icon: ClipboardCheck,
      },
    ],
    []
  );

  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
      className="text-black p-2"
      {...props}
    >
      <SidebarHeader className="flex items-center justify-center py-4">
        <div
          className="
            flex h-10 w-10 items-center justify-center
            rounded-full border-2 border-Bamboo-100
          "
        >
          <User className="h-5 w-5 text-Bamboo-100 opacity-30" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter className="flex items-center justify-center py-2">
        <Link
          href="/login"
          className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-Bamboo-300"
        >
          <LogOut className="h-5 w-5 text-black" />
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
