"use client";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shadcn/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/shadcn/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  const isActive = (url: string) => pathname === url;

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const itemIsActive =
            isActive(item.url) ||
            item.items?.some((subItem) => isActive(subItem.url));

          const activeClasses =
            "bg-Bamboo-500 hover:bg-Bamboo-500 hover:text-Bamboo-100 text-Bamboo-100 font-medium text-md";

          return item.items ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={itemIsActive}
              className="group/collapsible pt-4"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`rounded-md flex items-center gap-2 font-medium text-md mb-1 ${
                      itemIsActive ? activeClasses : ""
                    }`}
                  >
                    {item.icon && (
                      <item.icon
                        className={`h-5 w-5 ${
                          itemIsActive ? "text-Bamboo-100 stroke-2" : ""
                        }`}
                      />
                    )}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => {
                      const subItemIsActive = isActive(subItem.url);
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className={`rounded-md font-medium ${
                              subItemIsActive ? activeClasses : ""
                            }`}
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                className={`rounded-md flex items-center gap-2 ${
                  itemIsActive ? activeClasses : ""
                }`}
              >
                <Link href={item.url} className="flex items-center gap-2">
                  {item.icon && (
                    <item.icon
                      className={`h-5 w-5 ${
                        itemIsActive ? "text-Bamboo-100 stroke-2" : ""
                      }`}
                    />
                  )}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
