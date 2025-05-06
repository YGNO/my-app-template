import { submitAction } from "@/components/form/formUtils.ts";
import { InputField } from "@/components/form/inputField.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardContent, CardFooter, CardHeader, Form } from "@my-app/shadcn";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().min(1, { message: "入力してください。" }),
  password: z.string().min(1, { message: "入力してください。" }),
});

export function LoginForm({ error }: { error?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const formObject = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...formObject}>
      <form ref={formRef} method="POST" onSubmit={submitAction({ formRef, formObject })}>
        <Card className="w-[350px]">
          <CardHeader>{error && <div className="text-destructive text-sm">{error}</div>}</CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <InputField form={formObject} name="email" label="メールアドレス" type="text" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <InputField form={formObject} name="password" label="パスワード" type="password" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">ログイン</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
