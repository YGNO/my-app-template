import { dbClient, dbSchema } from "@my-app/db-client";
import SchemaBuilder from "@pothos/core";
import AddGraphQLPlugin from "@pothos/plugin-add-graphql";
import DataloaderPlugin from "@pothos/plugin-dataloader";
import { buildSchema } from "drizzle-graphql";
import { printSchema } from "graphql";
import { DateResolver, JSONResolver } from "graphql-scalars";
import municipality from "./schemas/municipality.ts";
import prefecture from "./schemas/prefecture.ts";
import { prefectureTable } from "./schemas/slickgrid/prefectureTable.ts";
import type { SlickgridFilterValue } from "./schemas/slickgrid/slickgridQueryUtils.ts";
import { SLICKGRID_FILTER_VALUE, SlickgridFilterResolver } from "./schemas/slickgrid/slickgridQueryUtils.ts";
import { registerSchema, toPothos } from "./utils/schemaUtils.ts";

type SchemaBuilderOption = {
  Scalars: SlickgridFilterValue & {
    JSON: { Input: unknown; Output: unknown };
    Date: { Input: Date; Output: Date };
  };
};
export type SchemaType = PothosSchemaTypes.ExtendDefaultTypes<SchemaBuilderOption>;
export type SchemaBuilderType = PothosSchemaTypes.SchemaBuilder<SchemaType>;
const builder = new SchemaBuilder<SchemaBuilderOption>({
  plugins: [AddGraphQLPlugin, DataloaderPlugin],
});

((sb) => {
  // graphql に登録する Scalar の一覧を定義
  sb.addScalarType("JSON", JSONResolver);
  sb.addScalarType("Date", DateResolver);
  sb.scalarType(SLICKGRID_FILTER_VALUE, SlickgridFilterResolver);
})(builder);

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
    prefectureTable(sb),
  ]);
})(builder, objectMap);

const graphqlSchema = builder.toSchema();
export default graphqlSchema;
export const graphqlSchemaString = printSchema(graphqlSchema);
