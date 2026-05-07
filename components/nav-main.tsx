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

  const activeClasses =
    "bg-Bamboo-500 hover:bg-Bamboo-500 hover:text-Bamboo-100 text-Bamboo-100 font-medium";

  return (
    <SidebarGroup className="px-1 sm:px-2">
      <SidebarMenu className="gap-1">
        {items.map((item) => {
          const itemIsActive =
            isActive(item.url) ||
            item.items?.some((subItem) => isActive(subItem.url));

          return item.items ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={itemIsActive}
              className="group/collapsible pt-2 sm:pt-4"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`
                      rounded-md flex items-center gap-2 mb-1
                      text-sm sm:text-base font-medium
                      px-2 sm:px-3 py-2
                      min-h-[40px] sm:min-h-[44px]
                      ${itemIsActive ? activeClasses : ""}
                    `}
                  >
                    {item.icon && (
                      <item.icon
                        className={`
                          flex-shrink-0
                          h-4 w-4 sm:h-5 sm:w-5
                          ${itemIsActive ? "text-Bamboo-100 stroke-2" : ""}
                        `}
                      />
                    )}
                    <span className="truncate">{item.title}</span>
                    <ChevronRight
                      className="ml-auto flex-shrink-0 h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub className="ml-3 sm:ml-4 border-l border-border/50 pl-2 sm:pl-3">
                    {item.items.map((subItem) => {
                      const subItemIsActive = isActive(subItem.url);
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className={`
                              rounded-md font-medium
                              text-sm sm:text-base
                              min-h-[36px] sm:min-h-[40px]
                              px-2 sm:px-3
                              ${subItemIsActive ? activeClasses : ""}
                            `}
                          >
                            <Link href={subItem.url}>
                              <span className="truncate">{subItem.title}</span>
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
                className={`
                  rounded-md flex items-center gap-2
                  text-sm sm:text-base font-medium
                  px-2 sm:px-3 py-2
                  min-h-[40px] sm:min-h-[44px]
                  ${itemIsActive ? activeClasses : ""}
                `}
              >
                <Link href={item.url} className="flex items-center gap-2 w-full">
                  {item.icon && (
                    <item.icon
                      className={`
                        flex-shrink-0
                        h-4 w-4 sm:h-5 sm:w-5
                        ${itemIsActive ? "text-Bamboo-100 stroke-2" : ""}
                      `}
                    />
                  )}
                  <span className="truncate">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
