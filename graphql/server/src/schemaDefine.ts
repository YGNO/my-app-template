import { dbClient, dbSchema } from "@my-app/db-client";
import { buildSchema } from "drizzle-graphql";
import { printSchema } from "graphql";
import { type SchemaBuilderType, getSchemaBuilder } from "./schemaBuilder.ts";
import municipality from "./schemas/municipality.ts";
import prefecture from "./schemas/prefecture.ts";
import { registerSchema, toPothos } from "./utils/schemaUtils.ts";

const builder = getSchemaBuilder();

// graphql に登録するオブジェクトの一覧を定義
const objectMap = ((sb: SchemaBuilderType) => {
  const { entities } = buildSchema(dbClient);
  const t = entities.types;
  return {
    prefecture: toPothos(sb, dbSchema.prefecture, t.PrefectureItem),
    municipality: toPothos(sb, dbSchema.municipality, t.MunicipalityItem),
  };
})(builder);
export type ObjectMap = typeof objectMap;

// graphql に登録するスキーマの一覧を定義
((sb: SchemaBuilderType) => {
  registerSchema(sb, objectMap, [prefecture, municipality]);
})(builder);

const graphqlSchema = builder.toSchema();
export default graphqlSchema;
export const graphqlSchemaString = printSchema(graphqlSchema);
