import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { prefecture } from "../_shared/schema.ts";
import { drizzleClient } from "../_shared/drizzleClient.ts";

Deno.serve(async () => {
  const prefectures = await drizzleClient.select().from(prefecture);
  return new Response(
    JSON.stringify(prefectures),
  );
});
