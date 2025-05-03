import { buildSchema } from "drizzle-graphql";
import { printSchema } from "graphql";
import AddGraphQLPlugin from "@pothos/plugin-add-graphql";
import SchemaBuilder from "@pothos/core";
import { drizzleClient } from "./drizzle/drizzleClient.ts";
import * as dbSchema from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

// Note: pothos には drizzle プラグインが存在するが、試験的なもののようなので使用しない
// https://pothos-graphql.dev/docs/plugins/drizzle
const { entities } = buildSchema(drizzleClient);
const builder = new SchemaBuilder({ plugins: [AddGraphQLPlugin] });

const PrefectureItem = builder.addGraphQLObject<
  typeof dbSchema.prefecture._.inferSelect
>(entities.types.PrefectureItem);

const Municipality = builder.addGraphQLObject<
  typeof dbSchema.municipality._.inferSelect
>(entities.types.MunicipalityItem);

builder.queryType({
  fields: (t) => ({
    prefectures: t.field({
      type: [PrefectureItem],
      resolve: async () => {
        const prefs = await drizzleClient.select().from(dbSchema.prefecture);
        return prefs || [];
      },
    }),
    prefecture: t.field({
      type: PrefectureItem,
      args: {
        code: t.arg.int({ required: true }),
      },
      resolve: async (_, { code }) => {
        const [pref] = await drizzleClient.select().from(dbSchema.prefecture)
          .where(
            eq(dbSchema.prefecture.code, code),
          );
        return pref || null;
      },
    }),
    municipalites: t.field({
      type: [Municipality],
      resolve: async () => {
        const prefs = await drizzleClient.select().from(dbSchema.municipality);
        return prefs || [];
      },
    }),
    municipality: t.field({
      type: Municipality,
      args: {
        code: t.arg.int({ required: true }),
      },
      resolve: async (_, { code }) => {
        const [pref] = await drizzleClient.select().from(dbSchema.municipality)
          .where(
            eq(dbSchema.municipality.code, code),
          );
        return pref || null;
      },
    }),
  }),
});

// 都道府県の下に市区町村を結びつける
// FIXME: N+1 の解決
builder.objectField(PrefectureItem, "municipalities", (t) =>
  t.field({
    type: [Municipality],
    resolve: async (parent) => {
      return await drizzleClient
        .select()
        .from(dbSchema.municipality)
        .where(eq(dbSchema.municipality.prefectureCode, parent.code));
    },
  }));

const graphqlSchema = builder.toSchema();

export default graphqlSchema;

export const graphqlSchemaString = printSchema(graphqlSchema);
