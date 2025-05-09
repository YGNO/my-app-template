import type { GenericFieldRef } from "@pothos/core";
import type { TableConfig } from "drizzle-orm";
import type { PgTableWithColumns } from "drizzle-orm/pg-core/table";
import type { GraphQLObjectType } from "graphql";
import type { GqlObject, GqlQuery, ObjectFieldBuilder, QueryFieldBuilder, SchemaBuilder } from "../pothosTypes.d.ts";
import type { ObjectMap } from "../schemaDefine.ts";

/**
 * drizzle で生成したスキーマ情報を pothos のオブジェクトに変換する
 *
 * Note: pothos には drizzle プラグインが存在するが、試験的なもののようなので使用しない
 * https://pothos-graphql.dev/docs/plugins/drizzle
 */
export const toPothos = <T extends TableConfig>(
  sb: SchemaBuilder,
  table: PgTableWithColumns<T>,
  objectType: GraphQLObjectType,
) => {
  return sb.addGraphQLObject<typeof table.$inferSelect>(objectType);
};

type RegisterQueries<T> = (
  objects: ObjectMap,
  qb: QueryFieldBuilder,
) => { [queryName: string]: GqlQuery<T | null | undefined> };

type SetRelations<T> = (
  object: GqlObject<T>,
  relations: {
    [relationName: string]: (t: ObjectFieldBuilder<T>) => GenericFieldRef;
  },
) => void;

type RegisterRelations<T> = (objects: ObjectMap, set: SetRelations<T>) => void;

/** スキーマ定義 */
export interface GqlSchema<T> {
  /** クエリ設定 */
  queries: RegisterQueries<T | readonly T[]>;
  /** 関連設定 */
  relations: RegisterRelations<T>;
}

/**
 * スキーマ情報を登録する
 * @param sb スキーマビルダー
 * @param objects 登録済みオブジェクト一覧
 * @param schemaList 登録対象のスキーマ一覧
 */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const registerSchema = (sb: SchemaBuilder, objects: ObjectMap, schemaList: GqlSchema<any>[]) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const queries: RegisterQueries<any>[] = [];
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const relations: RegisterRelations<any>[] = [];
  for (const schema of schemaList) {
    queries.push(schema.queries);
    relations.push(schema.relations);
  }

  sb.queryType({
    fields: (qb) => {
      return Object.assign({}, ...queries.map((fn) => fn(objects, qb)));
    },
  });

  relations.forEach((fn) =>
    fn(objects, (object, relations) => {
      Object.entries(relations).forEach(([relationName, relation]) => {
        sb.objectField(object, relationName, relation);
      });
    }),
  );
};
