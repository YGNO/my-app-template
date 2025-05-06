import { createRoute } from "honox/factory";
import { zfd } from "zod-form-data";
import { LoginForm, loginFormSchema } from "./$loginForm.tsx";

export const POST = createRoute(async (c) => {
  const formData = await c.req.formData();
  console.log("フォームデータ", formData);
  const result = zfd.formData(loginFormSchema).safeParse(formData);
  console.log("検証結果", result);
  console.log("エラー", result.error?.issues);
  return c.redirect("/login");
});

export default createRoute((c) => {
  return c.render(
    <div className="flex h-full w-full justify-center items-center-safe">
      <LoginForm />
    </div>,
  );
});
