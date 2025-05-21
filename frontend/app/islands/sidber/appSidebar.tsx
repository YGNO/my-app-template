import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "@my-app/shadcn";
import { Calendar, IdCard, Inbox, Search, Settings } from "lucide-react";
import { AppSidebarMenuButton } from "./appSidebarMenuButton.tsx";
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
    <SidebarProvider
      style={{
        ["--sidebar-width" as string]: "8rem",
        ["--sidebar-width-mobile" as string]: "8rem",
      }}
      className="w-fit"
    >
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
    </SidebarProvider>
  );
}
