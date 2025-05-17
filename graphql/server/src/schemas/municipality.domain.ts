import { dbClient, dbSchema } from "@my-app/db-client";
import { eq } from "drizzle-orm";
import { gqlDomain } from "../utils/gqlDomain.ts";

export default gqlDomain<"municipality">(() => ({
  queries: (qb) => ({
    municipalities: qb.field({
      type: ["municipality"],
      resolve: findMany,
    }),

    municipality: qb.field({
      type: "municipality",
      args: {
        code: qb.arg.int({ required: true }),
      },
      resolve: (_, { code }) => findSingle(code),
    }),
  }),
}));

const findMany = async () => {
  const prefs = await dbClient.select().from(dbSchema.municipality);
  return prefs || [];
};

const findSingle = async (code: number) => {
  const [pref] = await dbClient.select().from(dbSchema.municipality).where(eq(dbSchema.municipality.code, code));
  return pref || null;
};
