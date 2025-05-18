import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  cn,
} from "@my-app/shadcn";
import type { ComponentProps } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

type Props<F extends FieldValues> = {
  label?: string;
  type?: React.HTMLInputTypeAttribute;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  form: UseFormReturn<F, any, F>;
  name: Path<F>;
} & ComponentProps<"div">;

export const FormInput = <F extends FieldValues>({
  label,
  form,
  name,
  type,
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
                <Input type={type} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};
