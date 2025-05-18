import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
  cn,
} from "@my-app/shadcn";
import type { ComponentProps } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

type Props<F extends FieldValues> = {
  label?: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  form: UseFormReturn<F, any, F>;
  name: Path<F>;
  row?: React.TextareaHTMLAttributes<HTMLTextAreaElement>["rows"];
  cols?: React.TextareaHTMLAttributes<HTMLTextAreaElement>["cols"];
} & ComponentProps<"div">;

export const FormTextArea = <F extends FieldValues>({
  label,
  form,
  name,
  row,
  cols,
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
                <Textarea rows={row} cols={cols} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};
