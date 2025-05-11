import { cn, useSidebar } from "@my-app/shadcn";

export function AppContent({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();
  return (
    <main
      className={cn(
        open ? "w-[calc(100vw-var(--sidebar-width))]" : "w-[calc(100vw-var(--sidebar-width-icon))]",
      )}
    >
      {children}
    </main>
  );
}
