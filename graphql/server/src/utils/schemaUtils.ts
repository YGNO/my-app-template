import type { FieldRef, GenericFieldRef, ObjectFieldThunk, QueryFieldsShape } from "@pothos/core";
import type { TableConfig } from "drizzle-orm";
import type { PgTableWithColumns } from "drizzle-orm/pg-core/table";
import type { GraphQLObjectType } from "graphql";
import type { SchemaBuilderType, SchemaType } from "../schemaBuilder.ts";
import type { ObjectMap } from "../schemaDefine.ts";

/**
 * drizzle で生成したスキーマ情報を pothos のオブジェクトに変換する
 *
 * Note: pothos には drizzle プラグインが存在するが、試験的なもののようなので使用しない
 * https://pothos-graphql.dev/docs/plugins/drizzle
 */
export const toPothos = <DbTable extends TableConfig>(
  sb: SchemaBuilderType,
  table: PgTableWithColumns<DbTable>,
  objectType: GraphQLObjectType,
) => {
  return sb.addGraphQLObject<typeof table.$inferSelect>(objectType);
};

/** オブジェクトのクエリを定義する関数 */
type RegisterQueries<RtuenType> = (
  objects: ObjectMap,
  qb: Parameters<QueryFieldsShape<SchemaType>>[0],
) => { [queryName: string]: FieldRef<SchemaType, RtuenType | null | undefined, "Query"> };

/** オブジェクトの関連設定を定義する関数 */
type SetRelations<ParentType> = (
  object: PothosSchemaTypes.ObjectRef<SchemaType, ParentType, ParentType>,
  relations: {
    [relationName: string]: (t: Parameters<ObjectFieldThunk<SchemaType, ParentType>>[0]) => GenericFieldRef;
  },
) => void;

type RegisterRelations<ObjectType> = (objects: ObjectMap, set: SetRelations<ObjectType>) => void;

/** スキーマ定義 */
export interface GqlSchema<ObjectType> {
  /** クエリ設定 */
  queries?: RegisterQueries<ObjectType | readonly ObjectType[]>;
  /** 関連設定 */
  relations?: RegisterRelations<ObjectType>;
}

/**
 * スキーマ情報を登録する
 * @param sb スキーマビルダー
 * @param objects 登録済みオブジェクト一覧
 * @param schemaList 登録対象のスキーマ一覧
 */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const registerSchema = (sb: SchemaBuilderType, objects: ObjectMap, schemaList: GqlSchema<any>[]) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const queries: RegisterQueries<any>[] = [];
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const relations: RegisterRelations<any>[] = [];
  for (const schema of schemaList) {
    schema.queries && queries.push(schema.queries);
    schema.relations && relations.push(schema.relations);
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
