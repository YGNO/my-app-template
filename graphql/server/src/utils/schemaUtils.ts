import type { FieldRef, GenericFieldRef, ObjectFieldThunk, QueryFieldsShape } from "@pothos/core";
import type { SchemaBuilderType, SchemaType } from "../schemaDefine.ts";

/** オブジェクトのクエリを定義する関数 */
type RegisterQueries<RtuenType> = (qb: Parameters<QueryFieldsShape<SchemaType>>[0]) => {
  [queryName: string]: FieldRef<SchemaType, RtuenType | null | undefined, "Query">;
};

/** オブジェクトの関連設定を定義する関数 */
type SetRelations<ParentType, ReturnType> = (
  object: ReturnType,
  relations: {
    [relationName: string]: (t: Parameters<ObjectFieldThunk<SchemaType, ParentType>>[0]) => GenericFieldRef;
  },
) => void;
type RegisterRelations<ParentType, ReturnType> = (set: SetRelations<ParentType, ReturnType>) => void;

/** スキーマ定義 */
export interface GqlSchema<ObjectType extends keyof SchemaType["Objects"] | { [k: string]: unknown }> {
  /** クエリ設定 */
  queries?: ObjectType extends keyof SchemaType["Objects"]
    ? RegisterQueries<SchemaType["Objects"][ObjectType] | readonly SchemaType["Objects"][ObjectType][]>
    : RegisterQueries<ObjectType | readonly ObjectType[]>;
  /** 関連設定 */
  relations?: ObjectType extends keyof SchemaType["Objects"]
    ? RegisterRelations<SchemaType["Objects"][ObjectType], ObjectType>
    : RegisterRelations<PothosSchemaTypes.ObjectRef<SchemaType, ObjectType, ObjectType>, ObjectType>;
}

/**
 * スキーマ情報を登録する
 * @param sb スキーマビルダー
 * @param objects 登録済みオブジェクト一覧
 * @param schemaList 登録対象のスキーマ一覧
 */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const registerSchema = (sb: SchemaBuilderType, schemaList: GqlSchema<any>[]) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const queries: RegisterQueries<any>[] = [];
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const relations: RegisterRelations<any, any>[] = [];
  for (const schema of schemaList) {
    schema.queries && queries.push(schema.queries);
    schema.relations && relations.push(schema.relations);
  }

  sb.queryType({
    fields: (qb) => {
      return Object.assign({}, ...queries.map((fn) => fn(qb)));
    },
  });

  relations.forEach((fn) =>
    fn((object, relations) => {
      Object.entries(relations).forEach(([relationName, relation]) => {
        sb.objectField(object, relationName, relation);
      });
    }),
  );
};
