import { ChevronsLeft, ChevronsRight } from "lucide-react";

import { cn, useSidebar } from "@my-app/shadcn";

export function AppSidebarTrigger() {
  const { open, toggleSidebar } = useSidebar();
  return (
    <div className="h-7 w-full z-10 relative">
      <div
        className={cn(
          " mt-1 rounded-full absolute transition-all duration-200",
          open ? "right-0 translate-x-0" : "left-1/2 -translate-x-1/2",
        )}
      >
        <div role="button" className="w-6 h-6 inline" onClick={toggleSidebar}>
          {open ? <ChevronsLeft className="w-6 h-6" /> : <ChevronsRight className="w-6 h-6" />}
        </div>
      </div>
    </div>
  );
}
