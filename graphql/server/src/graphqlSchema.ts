import { dbClient, dbSchema } from "@my-app/db-client";
import SchemaBuilder from "@pothos/core";
import AddGraphQLPlugin from "@pothos/plugin-add-graphql";
import { eq } from "drizzle-orm";
import { printSchema } from "graphql";
import { registerObjectType } from "./object/graphqlObject.ts";
import type { GraphqlObject } from "./object/graphqlObject.ts";

// Note: pothos には drizzle プラグインが存在するが、試験的なもののようなので使用しない
// https://pothos-graphql.dev/docs/plugins/drizzle
const builder = new SchemaBuilder({ plugins: [AddGraphQLPlugin] });
const objectMap = registerObjectType(builder);

const t: GraphqlObject<typeof objectMap.prefecture, typeof objectMap.prefecture.$inferType> = {
  queries(type, qb) {
    return {
      prefectures: qb.field({
        type: [type],
        resolve: async () => {
          const prefs = await dbClient.select().from(dbSchema.prefecture);
          return prefs || [];
        },
      }),
      prefecture: qb.field({
        type: type,
        args: {
          code: qb.arg.int({ required: true }),
        },
        resolve: async (_, { code }) => {
          const [pref] = await dbClient.select().from(dbSchema.prefecture).where(eq(dbSchema.prefecture.code, code));
          return pref || null;
        },
      }),
    };
  },
};

builder.queryType({
  fields: (t) => ({
    prefectures: t.field({
      type: [objectMap.prefecture],
      resolve: async () => {
        const prefs = await dbClient.select().from(dbSchema.prefecture);
        return prefs || [];
      },
    }),
    prefecture: t.field({
      type: objectMap.prefecture,
      args: {
        code: t.arg.int({ required: true }),
      },
      resolve: async (_, { code }) => {
        const [pref] = await dbClient.select().from(dbSchema.prefecture).where(eq(dbSchema.prefecture.code, code));
        return pref || null;
      },
    }),
    municipalites: t.field({
      type: [objectMap.municipality],
      resolve: async () => {
        const prefs = await dbClient.select().from(dbSchema.municipality);
        return prefs || [];
      },
    }),
    municipality: t.field({
      type: objectMap.municipality,
      args: {
        code: t.arg.int({ required: true }),
      },
      resolve: async (_, { code }) => {
        const [pref] = await dbClient.select().from(dbSchema.municipality).where(eq(dbSchema.municipality.code, code));
        return pref || null;
      },
    }),
  }),
});

// 都道府県の下に市区町村を結びつける
// FIXME: N+1 の解決
builder.objectField(objectMap.prefecture, "municipalities", (t) =>
  t.field({
    type: [objectMap.municipality],
    resolve: async (parent) => {
      return await dbClient
        .select()
        .from(dbSchema.municipality)
        .where(eq(dbSchema.municipality.prefectureCode, parent.code));
    },
  }),
);

const graphqlSchema = builder.toSchema();

export default graphqlSchema;

export const graphqlSchemaString = printSchema(graphqlSchema);
