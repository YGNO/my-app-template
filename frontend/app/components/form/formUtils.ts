import type { FieldErrors, FieldValues, UseFormReturn } from "react-hook-form";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type FormType<F extends FieldValues> = UseFormReturn<F, any, F>;

type ActionProps<F extends FieldValues> = {
  form: FormType<F>;
  method?: "GET" | "POST";
  path: string;
  onValid?: (data: F, event?: React.BaseSyntheticEvent) => Promise<boolean> | boolean;
  onInvalid?: (data: FieldErrors<F>, event?: React.BaseSyntheticEvent) => Promise<void> | void;
  afterPost?: (data: F, event?: React.BaseSyntheticEvent) => Promise<void> | void;
};

export const submitAction = <F extends FieldValues>({
  form,
  method = "POST",
  path,
  onValid = () => true,
  onInvalid = () => {},
  afterPost = () => {},
}: ActionProps<F>) => {
  return (formData: FormData) => {
    return new Promise<void>((resolve) => {
      form.handleSubmit(
        async (data, e) => {
          if (!(await onValid(data, e))) {
            resolve();
            return;
          }
          await fetch(path, { method, body: formData });
          await afterPost(data, e);
          resolve();
        },
        async (error, e) => {
          await onInvalid(error, e);
          resolve();
        },
      )();
    });
  };
};
