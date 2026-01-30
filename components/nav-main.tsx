"use client";

import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
} from "@/shadcn/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu className="gap-3">
        {items.map((item) => {
          const isActive =
            pathname === item.url ||
            pathname.startsWith(item.url + "/");

          return (
            <SidebarMenuItem key={item.url} className="relative">
              {isActive && (
                <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-Bamboo-100" />
              )}

              <Link
                href={item.url}
                className="flex h-10 w-10 items-center justify-center rounded-xl"
              >
                <item.icon
                  className={`h-5 w-5 transition-colors ${
                    isActive
                      ? "text-Bamboo-100"
                      : "text-black"
                  }`}
                />
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
