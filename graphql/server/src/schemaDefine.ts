import { dbClient, dbSchema } from "@my-app/db-client";
import SchemaBuilder from "@pothos/core";
import AddGraphQLPlugin from "@pothos/plugin-add-graphql";
import DataloaderPlugin from "@pothos/plugin-dataloader";
import { buildSchema } from "drizzle-graphql";
import { printSchema } from "graphql";
import { DateResolver, JSONResolver } from "graphql-scalars";
import {
  SLICKGRID_FILTER_VALUE,
  SlickgridFilterResolver,
  type SlickgridFilterValue,
} from "./schemas/slickgrid/slickgridQueryUtils.ts";
import { SlickgridEnum } from "./schemas/slickgrid/slickgridQueryUtils.ts";
import { buildGqlDomain } from "./utils/gqlDomain.ts";

const { entities } = buildSchema(dbClient);
type ObjectKey = keyof typeof dbSchema;
export type SchemaType = PothosSchemaTypes.ExtendDefaultTypes<{
  // 共通で利用する型をグローバルに登録しておく
  Scalars: SlickgridFilterValue & {
    JSON: { Input: unknown; Output: unknown };
    Date: { Input: Date; Output: Date };
  };
  Inputs: {
    [K in keyof typeof SlickgridEnum]: (typeof SlickgridEnum)[K][number];
  };
  /**
   * drizzle で生成したスキーマ情報を pothos のオブジェクトにとして定義し、後続処理で実態の追加を行う
   *
   * Note: pothos には drizzle プラグインが存在するが、クエリビルダーとしての独立性を重視したいので、このプラグインは使用しない
   * https://pothos-graphql.dev/docs/plugins/drizzle
   */
  Objects: { [K in ObjectKey]: (typeof dbSchema)[K]["$inferInsert"] };
}>;
const schemaBuilder = new SchemaBuilder<SchemaType>({
  plugins: [AddGraphQLPlugin, DataloaderPlugin],
});

export type SchemaBuilderType = typeof schemaBuilder;

// 共通 Scalar を定義
schemaBuilder.addScalarType("JSON", JSONResolver);
schemaBuilder.addScalarType("Date", DateResolver);
schemaBuilder.scalarType(SLICKGRID_FILTER_VALUE, SlickgridFilterResolver);

// 共通 Enum を登録
for (const [name, values] of Object.entries(SlickgridEnum)) {
  schemaBuilder.enumType(name, { values });
}

// SchemaType で定義したオブジェクトを実装する
// Note: drizzle-graphql が生成したオブジェクトを実装として利用する
// const { entities } = buildSchema(dbClient);
const tabeleNameList = Object.keys(dbSchema) as ObjectKey[];
for (const tableName of tabeleNameList) {
  // drizzle-graphql のプロパティ名でオブジェクトを取得する
  const itemName =
    `${tableName.charAt(0).toUpperCase()}${tableName.slice(1)}Item` as `${Capitalize<typeof tableName>}Item`;
  schemaBuilder.addGraphQLObject(entities.types[itemName], {
    name: tableName, // SchemaType で定義した型と名前を合わせる
  });
}

// 必ず schemaBuilder に共通オブジェクトを定義してから実行すること
await buildGqlDomain(schemaBuilder);

const graphqlSchema = schemaBuilder.toSchema();
export default graphqlSchema;
export const graphqlSchemaString = printSchema(graphqlSchema);
