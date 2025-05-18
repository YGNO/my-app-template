import { Checkbox, FormItem, FormLabel, cn } from "@my-app/shadcn";
import { type ComponentProps, useEffect, useState } from "react";

type ValuType = Record<string, boolean>;

type Props<VALUE extends ValuType> = {
  label?: string;
  layout?: "horizontal" | "vertical";
  items: { id: keyof VALUE; label: string }[];
  values?: VALUE;
  onCheckedChange?: (selected: Record<keyof VALUE, boolean>) => void;
} & ComponentProps<"div">;

export const CheckboxGroup = <VALUE extends ValuType>({
  label,
  layout = "horizontal",
  items,
  values,
  onCheckedChange,
  className,
  ...props
}: Props<VALUE>) => {
  const defaultValues = {} as Record<keyof VALUE, boolean>;
  items.forEach((item) => {
    defaultValues[item.id] = false;
  });
  const initialValues: Record<keyof VALUE, boolean> = { ...defaultValues, ...values };
  const [checkboxValues, setCheckboxValues] = useState<Record<keyof VALUE, boolean>>(initialValues);

  useEffect(() => {
    onCheckedChange?.(checkboxValues);
  }, [checkboxValues]);

  return (
    <div className={cn(className, "select-none")} {...props}>
      {label && <FormLabel className="mb-1">{label}</FormLabel>}
      <div
        className={cn(
          "flex gap-4 flex-wrap py-2 select-none",
          layout === "vertical" ? "flex-col" : "flex-row",
        )}
        {...props}
      >
        {items.map(({ id, label }, index) => {
          return (
            <FormItem key={`${id.toString}-${index.toString()}`} className="flex flex-row gap-1">
              <Checkbox
                id={`${id.toString}-${index.toString()}`}
                checked={checkboxValues[id] ?? false}
                onCheckedChange={(checked) => {
                  setCheckboxValues((prev) => {
                    return {
                      ...prev,
                      [id]: checked === true,
                    };
                  });
                }}
              />
              <FormLabel htmlFor={`${id.toString}-${index.toString()}`}>{label}</FormLabel>
            </FormItem>
          );
        })}
      </div>
    </div>
  );
};
