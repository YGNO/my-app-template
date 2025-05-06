import type { AuthClient } from "@/utils/auth/authClient.ts";
import { createSupabaseAuthClient } from "@/utils/auth/supabase/supabaseAuthClient.ts";
import type { MiddlewareHandler } from "hono";

export const AUTH_CLIENT = "auth";

declare module "hono" {
  interface ContextVariableMap {
    auth: AuthClient;
  }
}

export const setAuthClient: MiddlewareHandler = async (c, next) => {
  c.set(AUTH_CLIENT, createSupabaseAuthClient(c));
  await next();
};
