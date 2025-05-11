import { AppSidebarMenuButton } from "@/islands/layout/sidber/appSidebarMenuButton.tsx";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@my-app/shadcn";
import { Calendar, IdCard, Inbox, Search, Settings } from "lucide-react";
import { AppSidebarTrigger } from "./appSidebarTrigger.tsx";

// Menu items.
const items = [
  {
    title: "都道府県",
    url: "/app/prefecture",
    icon: IdCard,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <AppSidebarTrigger />
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <AppSidebarMenuButton title={item.title} href={item.url}>
                    <item.icon />
                  </AppSidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
