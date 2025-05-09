import { dbClient, dbSchema } from "@my-app/db-client";
import SchemaBuilder from "@pothos/core";
import AddGraphQLPlugin from "@pothos/plugin-add-graphql";
import DataloaderPlugin from "@pothos/plugin-dataloader";
import { buildSchema } from "drizzle-graphql";
import { printSchema } from "graphql";
import municipality from "./schemas/municipality.ts";
import prefecture from "./schemas/prefecture.ts";
import { registerSchema, toPothos } from "./utils/schemaUtils.ts";

const builder = new SchemaBuilder({ plugins: [AddGraphQLPlugin, DataloaderPlugin] });
const { entities } = buildSchema(dbClient);
const t = entities.types;

// graphql に登録するオブジェクトの一覧を定義
const objectMap = {
  prefecture: toPothos(builder, dbSchema.prefecture, t.PrefectureItem),
  municipality: toPothos(builder, dbSchema.municipality, t.MunicipalityItem),
};
export type ObjectMap = typeof objectMap;

// graphql に登録するスキーマの一覧を定義
registerSchema(builder, objectMap, [prefecture, municipality]);

const graphqlSchema = builder.toSchema();
export default graphqlSchema;
export const graphqlSchemaString = printSchema(graphqlSchema);
