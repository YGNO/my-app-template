import type { FieldErrors, FieldValues, UseFormReturn } from "react-hook-form";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type FormType<F extends FieldValues> = UseFormReturn<F, any, F>;

type ActionProps<F extends FieldValues> = {
  formObject: FormType<F>;
  formRef: React.RefObject<HTMLFormElement | null>;
  onValid?: (data: F, event?: React.BaseSyntheticEvent) => Promise<boolean> | boolean;
  onInvalid?: (data: FieldErrors<F>, event?: React.BaseSyntheticEvent) => Promise<void> | void;
};

export const submitAction = <F extends FieldValues>({
  formObject,
  formRef,
  onValid = () => true,
  onInvalid = () => {},
}: ActionProps<F>) => {
  return async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await formObject.handleSubmit(
      async (data, e) => {
        e?.preventDefault();
        if (!(await onValid(data, e))) {
          return;
        }
        formRef.current?.submit();
      },
      async (error, e) => {
        await onInvalid(error, e);
      },
    )();
  };
};
