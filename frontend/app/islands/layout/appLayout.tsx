import { SidebarProvider, SidebarTrigger } from "@my-app/shadcn";
import { AppSidebar } from "@/islands/layout/sidber/appSidebar.tsx";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={{
        ["--sidebar-width" as string]: "8rem",
        ["--sidebar-width-mobile" as string]: "8rem",
      }}
    >
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
