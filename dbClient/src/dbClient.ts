import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as dbRelations from "./__generated__/relations.ts";
import * as dbSchema from "./__generated__/schema.ts";

// Note: postgres.js を使うと CONNECT_TIMEOUT が発生するので、node-postgres を利用する
// see: https://github.com/orgs/supabase/discussions/21789
const connectionString = Deno.env.get("SUPABASE_DB_URL");
const pool = new Pool({ connectionString });
const dbClient = drizzle({ client: pool, schema: dbSchema });

export { dbClient, dbRelations, dbSchema };
