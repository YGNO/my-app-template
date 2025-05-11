import { AUTH_CLIENT } from "@/middleware/setAuthClient.ts";
import { encodedRedirect } from "@/utils/encodedRedirect.ts";
import { createRoute } from "honox/factory";
import { zfd } from "zod-form-data";
import { LoginForm, loginFormSchema } from "./$loginForm.tsx";

const ERROR_PARAM_KEY = "error";

export const POST = createRoute(async (c) => {
  const formData = await c.req.formData();
  const result = zfd.formData(loginFormSchema).safeParse(formData);
  if (!result.success) {
    // Note: FEで入力チェックをしているので、BEでは詳細なメッセージは返さない
    return encodedRedirect(c, ERROR_PARAM_KEY, "/login", "入力された値に誤りがあります。");
  }

  const { error } = await c.get(AUTH_CLIENT).signInWithPassword(result.data);
  if (error) {
    return encodedRedirect(c, ERROR_PARAM_KEY, "/login", "入力された値に誤りがあります。");
  }

  // FIXME: トップ画面に遷移させる
  return c.redirect("/app/prefecture");
});

export default createRoute((c) => {
  const error = c.req.query(ERROR_PARAM_KEY);
  return c.render(
    <div className="flex h-full w-full justify-center items-center-safe">
      <LoginForm error={error} />
    </div>,
  );
});
