import { type CookieOptions, createServerClient } from "@supabase/ssr";
import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import type { AuthClient } from "../authClient.ts";
import { getVariable } from "./getVariable.ts";

export const createSupabaseAuthClient = (c: Context) => {
  const { url, anonKey } = getVariable();

  const client = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        const cookieMap = getCookie(c);
        return Object.entries(cookieMap).map(([name, value]) => ({
          name,
          value,
        }));
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            setCookie(c, name, value, toHonoCookieOption(options));
          });
        } catch (error) {
          console.error(error);
        }
      },
    },
  });

  return client.auth as AuthClient;
};

// Hono と Supabase で CookieOptions の型が違うので、吸収するためのメソッド
const toHonoCookieOption = (options: CookieOptions) => {
  type HonoCookieOption = Omit<typeof options, "sameSite" | "priority"> & {
    sameSite: "lax" | "strict" | "none" | undefined;
    priority: "Low" | "Medium" | "High";
  };
  const sameSite = () => {
    if (options.sameSite === true) {
      return "lax";
    }
    if (options.sameSite === false) {
      return "none";
    }
    return options.sameSite;
  };

  const priority = () => {
    switch (options.priority) {
      case "low":
        return "Low";
      case "medium":
        return "Medium";
      case "high":
        return "High";
      default:
        return options.priority;
    }
  };

  return {
    ...options,
    sameSite: sameSite(),
    priority: priority(),
  } as HonoCookieOption;
};
