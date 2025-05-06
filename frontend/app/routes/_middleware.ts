import { AUTH_CLIENT, setAuthClient } from "@/middleware/setAuthClient.ts";
import { createRoute } from "honox/factory";

export default createRoute(setAuthClient, async (c, next) => {
  if (c.req.path.startsWith("/login")) {
    await c.get(AUTH_CLIENT).signOut();
    return next();
  }

  const user = await c.get(AUTH_CLIENT).getUser();
  if (user.error) {
    return c.redirect("/login");
  }
  return next();
});
