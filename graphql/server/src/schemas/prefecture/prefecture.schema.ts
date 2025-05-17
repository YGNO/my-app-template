import { dbClient, dbSchema } from "@my-app/db-client";
import { eq, inArray } from "drizzle-orm";
import z from "zod";
import { gqlDomain } from "../../utils/gqlDomain.ts";
import { MutationInput } from "../../utils/mutationInput.ts";
import { groupByIds } from "../../utils/sqlUtils.ts";
import { prefectureZod } from "./prefectureZod.ts";

export default gqlDomain<"prefecture">((sb) => ({
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

  mutations: (mb) => ({
    updatePrefecture: mb.boolean({
      args: {
        input: mb.arg({
          type: MutationInput.from(sb, "updatePrefectureInput", prefectureZod),
          required: true,
        }),
      },
      validate: {
        schema: z.object({ input: prefectureZod }),
      },
      resolve: async (_, { input }) => {
        return await updatePrefecture(input as updatePrefectureInput);
      },
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

type updatePrefectureInput = typeof prefectureZod._input;
const updatePrefecture = async (input: updatePrefectureInput) => {
  const prefecture = await findSingle(input.code);
  if (!prefecture) {
    await dbClient.insert(dbSchema.prefecture).values({
      ...input,
    });
    return true;
  }

  await dbClient
    .update(dbSchema.prefecture)
    .set({
      ...input,
    })
    .where(eq(dbSchema.prefecture.code, input.code));
  return true;
};
