import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../_shared/schema.ts";

// Note: postgres.js を使うと CONNECT_TIMEOUT が発生するので、node-postgres を利用する
// see: https://github.com/orgs/supabase/discussions/21789
const connectionString = Deno.env.get("SUPABASE_DB_URL")!;
const pool = new Pool({ connectionString });
export const drizzleClient = drizzle({ client: pool, schema });
