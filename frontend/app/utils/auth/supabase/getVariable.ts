const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

export const getVariable = () => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("SUPABASE_URL, SUPABASE_ANON_KEY is not exist.");
  }
  return {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
  };
};
