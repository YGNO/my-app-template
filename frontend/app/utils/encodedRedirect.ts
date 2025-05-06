import type { Context } from "hono";

export function encodedRedirect(c: Context, type: "error" | "success", path: string, message: string) {
  return c.redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}
