import { dbClient, dbSchema } from "@my-app/db-client";
import { buildSchema } from "drizzle-graphql";
import { printSchema } from "graphql";
import { getSchemaBuilder } from "./schemaBuilder.ts";
import municipality from "./schemas/municipality.ts";
import prefecture from "./schemas/prefecture.ts";
import { registerSchema, toPothos } from "./utils/schemaUtils.ts";

const builder = getSchemaBuilder();

const objectMap = ((sb) => {
  const { entities } = buildSchema(dbClient);
  const t = entities.types;
  return {
    // graphql に登録するオブジェクトの一覧を定義
    prefecture: toPothos(sb, dbSchema.prefecture, t.PrefectureItem),
    municipality: toPothos(sb, dbSchema.municipality, t.MunicipalityItem),
  };
})(builder);
export type ObjectMap = typeof objectMap;

((sb, objects) => {
  registerSchema(sb, objects, [
    // graphql に登録するスキーマの一覧を定義
    prefecture,
    municipality,
  ]);
})(builder, objectMap);

const graphqlSchema = builder.toSchema();
export default graphqlSchema;
export const graphqlSchemaString = printSchema(graphqlSchema);
