import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { dbclient, dbSchema } from "../_shared/dbClient/dbClient.ts";

Deno.serve(async () => {
  const prefectures = await dbclient.select().from(dbSchema.prefecture);
  return new Response(
    JSON.stringify(prefectures),
  );
});
