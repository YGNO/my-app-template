import { submitAction } from "@/components/form/formUtils.ts";
import { InputField } from "@/components/form/inputField.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardContent, CardFooter, CardHeader, Form } from "@my-app/shadcn";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().min(1, { message: "入力してください。" }),
  password: z.string().min(1, { message: "入力してください。" }),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form action={submitAction({ form, path: "/login" })}>
        <Card className="w-[350px]">
          <CardHeader />
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <InputField form={form} name="email" label="メールアドレス" type="text" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <InputField form={form} name="password" label="パスワード" type="password" />
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
