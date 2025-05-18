import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@my-app/shadcn";
import type { ComponentProps } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

type SelectItemType = {
  label: string;
  value: string;
};

type Props<F extends FieldValues> = {
  label?: string;
  placeholder?: string;
  items: SelectItemType[];
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  form: UseFormReturn<F, any, F>;
  name: Path<F>;
} & ComponentProps<"div">;

export const SelectField = <F extends FieldValues>({
  label,
  form,
  name,
  placeholder,
  items,
  className,
  ...props
}: Props<F>) => {
  return (
    <div className={cn(className, "select-none")} {...props}>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => {
          return (
            <FormItem>
              {label && <FormLabel>{label}</FormLabel>}
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {items.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};
