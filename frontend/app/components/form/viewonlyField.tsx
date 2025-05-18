import { Label } from "@my-app/shadcn";
import type { ComponentProps } from "react";

export const ViewonlyField = ({
  label,
  value,
  ...props
}: { label: string; value?: string | number } & ComponentProps<"div">) => {
  return (
    <div {...props}>
      <Label className="text-sm">{label}</Label>
      <span className="text-xl">{value ?? ""}</span>
    </div>
  );
};
