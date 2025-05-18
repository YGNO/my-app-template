import { Label, cn } from "@my-app/shadcn";
import type { ComponentProps } from "react";

export const ViewonlyField = ({
  label,
  value,
  className,
  ...props
}: { label: string; value?: string | number } & ComponentProps<"div">) => {
  return (
    <div className={cn("pr-2 pb-2", className)} {...props}>
      <Label className="text-sm text-(--muted-foreground)">{label}</Label>
      <span className="text-xl pl-1">{value ?? ""}</span>
    </div>
  );
};
