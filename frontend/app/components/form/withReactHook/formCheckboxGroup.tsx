import { FormControl, FormField, FormItem, FormMessage } from "@my-app/shadcn";
import { type ComponentProps, useCallback, useEffect, useState } from "react";
import type { FieldPath, FieldPathValue, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { CheckboxGroup } from "../checkboxGroup.tsx";

type CheckboxItem<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
};

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  label?: string;
  layout?: "horizontal" | "vertical";
  items: CheckboxItem<T>[];
  root: Path<T>;
} & Omit<ComponentProps<typeof CheckboxGroup>, "items" | "values" | "onCheckedChange">;

/**
 * フォーム入力用のチェックボックスグループコンポーネント
 */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const FormCheckboxGroup = <T extends Record<string, any>>({
  form,
  label,
  layout = "horizontal",
  items,
  root,
  ...props
}: Props<T>) => {
  const { values: _values, formItems: _formItems } = getInitdata(form, items);
  const [formItems, setFormItems] = useState<{ id: string; label: string }[]>(_formItems);
  const [values, setValues] = useState<Record<string, boolean>>(_values);

  useEffect(() => {
    // Note: チェックボックスの選択肢が変更された場合は、値も含めて親の定義で初期化する
    const { values, formItems } = getInitdata(form, items);
    setValues(values);
    setFormItems(formItems);
  }, [items]);

  // 値変更時のハンドリング処理
  const setFormValues = useCallback(
    (selected: Record<string, boolean>, form: UseFormReturn<T>) => {
      Object.entries(selected).forEach(([fieldPath, value]) => {
        const path = fieldPath as FieldPath<T>;

        type FieldValue = FieldPathValue<T, typeof path>;
        const typedValue = value as unknown as FieldValue;

        form.clearErrors(root);
        form.setValue(path, typedValue, {
          shouldValidate: true,
          shouldDirty: true,
        });
      });
    },
    [root],
  );

  return (
    <FormField
      control={form.control}
      name={root}
      render={() => {
        return (
          <FormItem>
            <FormControl>
              <CheckboxGroup
                label={label}
                layout={layout}
                items={formItems}
                values={values}
                onCheckedChange={(selected) => setFormValues(selected, form)}
                {...props}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

const getInitdata = <T extends FieldValues>(form: UseFormReturn<T>, items: CheckboxItem<T>[]) => {
  const values: Record<string, boolean> = {};
  const formItems: { id: string; label: string }[] = [];
  for (const { name, label } of items) {
    const fieldPath = name as string;
    const fieldValue = !!form.getValues(name);

    values[fieldPath] = fieldValue;
    formItems.push({ id: fieldPath, label });
  }

  return { values, formItems };
};
