import { AppSidebar } from "@/islands/layout/sidber/appSidebar.tsx";
import { SidebarProvider } from "@my-app/shadcn";
import { AppContent } from "./sidber/appContent.tsx";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={{
        ["--sidebar-width" as string]: "8rem",
        ["--sidebar-width-mobile" as string]: "8rem",
      }}
    >
      <AppSidebar />
      <AppContent>{children}</AppContent>
    </SidebarProvider>
  );
}
