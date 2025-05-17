import { dbClient, dbSchema } from "@my-app/db-client";
import { eq, inArray } from "drizzle-orm";
import { gqlDomain } from "../utils/gqlDomain.ts";
import { groupByIds } from "../utils/sqlUtils.ts";

export default gqlDomain<"prefecture">(() => ({
  queries: (qb) => ({
    prefectures: qb.field({
      type: ["prefecture"],
      resolve: findMany,
    }),

    prefecture: qb.field({
      type: "prefecture",
      args: {
        code: qb.arg.int({ required: true }),
      },
      resolve: (_, { code }) => findSingle(code),
    }),
  }),

  relations: (set) => {
    set("prefecture", {
      municipalitis: (fb) =>
        fb.loadableList({
          type: "municipality",
          resolve: (prefecture) => prefecture.code,
          load: findMunicipalities,
        }),
    });
  },
}));

const findMany = async () => {
  const prefs = await dbClient.select().from(dbSchema.prefecture);
  return prefs || [];
};

const findSingle = async (code: number) => {
  const [pref] = await dbClient.select().from(dbSchema.prefecture).where(eq(dbSchema.prefecture.code, code));
  return pref || null;
};

const findMunicipalities = async (prefectureCodes: number[]) => {
  const municipalitis = await dbClient
    .select()
    .from(dbSchema.municipality)
    .where(inArray(dbSchema.municipality.prefectureCode, prefectureCodes));
  return groupByIds(municipalitis, "prefectureCode", prefectureCodes);
};
