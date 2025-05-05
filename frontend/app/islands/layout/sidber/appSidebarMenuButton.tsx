import { cn, SidebarMenuButton, useSidebar } from "@my-app/shadcn";

type Props = {
  title: string;
  children: React.ReactNode;
  href?: string;
} & React.ComponentProps<typeof SidebarMenuButton>;

export function AppSidebarMenuButton({
  title,
  children,
  href,
  className,
  size,
  ...props
}: Props) {
  const { open } = useSidebar();
  const parentHeight = size === undefined || size === null || size === "default"
    ? "h-8"
    : size === "lg"
    ? "h-12"
    : "h-4";
  return (
    <div className={cn(parentHeight, "w-full relative")}>
      <SidebarMenuButton
        asChild
        size={size}
        className={cn(
          className,
          "[&>svg]:size-6 absolute transition-all duration-400", // 移動距離が短いので、少し長めに時間を取る
          open ? "" : "-left-1 translate-x-0",
        )}
        {...props}
      >
        <a className="p-0" href={href}>
          {children}
          <span className={!open ? "hidden" : ""}>{title}</span>
        </a>
      </SidebarMenuButton>
    </div>
  );
}
