import type { FieldRef, GenericFieldRef } from "@pothos/core";
import type { SchemaBuilderType, SchemaType } from "../schemaDefine.ts";

type ObjectRef = SchemaType["Objects"];
type ObjectRefKey = keyof SchemaType["Objects"];
type AnyObject = { [k: string]: unknown };

type SetQueries<RtuenType> = (qb: PothosSchemaTypes.QueryFieldBuilder<SchemaType, SchemaType["Root"]>) => {
  [queryName: string]: FieldRef<SchemaType, RtuenType | null | undefined, "Query">;
};
type AnySetQueries =
  | SetQueries<ObjectRef[ObjectRefKey] | readonly ObjectRef[ObjectRefKey][]>
  | SetQueries<AnyObject | readonly AnyObject[]>;

type SetMutations<RtuenType> = (mb: PothosSchemaTypes.MutationFieldBuilder<SchemaType, SchemaType["Root"]>) => {
  [mutationName: string]: FieldRef<SchemaType, RtuenType | number | boolean | null | undefined, "Mutation">;
};
type AnySetMutations =
  | SetMutations<ObjectRef[ObjectRefKey] | readonly ObjectRef[ObjectRefKey][]>
  | SetMutations<AnyObject | readonly AnyObject[]>;

type SetRelations<T extends ObjectRefKey | AnyObject> = T extends ObjectRefKey
  ? (set: SetRelation<T, ObjectRef[T]>) => void
  : (set: SetRelation<T, PothosSchemaTypes.ObjectRef<SchemaType, T, T>>) => void;
type SetRelation<T, Parent> = (
  object: T,
  relations: {
    [relationName: string]: (fb: PothosSchemaTypes.ObjectFieldBuilder<SchemaType, Parent>) => GenericFieldRef;
  },
) => void;

type AnySetRelations = SetRelations<ObjectRefKey | AnyObject>;

/**
 * 各種GraphQLの定義をドメイン毎にまとめるためのインタフェイス
 */
export interface GqlDomain<T extends ObjectRefKey | AnyObject> {
  queries?: T extends ObjectRefKey ? SetQueries<ObjectRef[T] | readonly ObjectRef[T][]> : SetQueries<T | readonly T[]>;
  mutations?: T extends ObjectRefKey
    ? SetMutations<ObjectRef[T] | readonly ObjectRef[T][]>
    : SetMutations<T | readonly T[]>;
  // FIXME: 独自定義オブジェクトの関連設定は未実装
  relations?: T extends ObjectRefKey ? SetRelations<T> : undefined;
}

/** ドメイン毎の定義を Schem に登録する関数型 */
type GqlDomainBuilder<T extends ObjectRefKey | AnyObject> = (schemaBuilder: SchemaBuilderType) => GqlDomain<T>;
export type AnyGqlDomainBuilder = GqlDomainBuilder<ObjectRefKey | AnyObject>;

export const gqlDomain = <T extends ObjectRefKey | AnyObject>(builder: GqlDomainBuilder<T>) => builder;

/**
 * gqlDomain を schema に登録する
 * @param sb スキーマビルダ
 * @param gqlDomainBuilders
 */
export const buildGqlDomain = (sb: SchemaBuilderType, gqlDomainBuilders: AnyGqlDomainBuilder[]) => {
  const queriesDef: AnySetQueries[] = [];
  const mutationsDef: AnySetMutations[] = [];
  const relationsDef: AnySetRelations[] = [];
  for (const domainBuilder of gqlDomainBuilders) {
    const { queries, mutations, relations } = domainBuilder(sb);
    queries && queriesDef.push(queries);
    mutations && mutationsDef.push(mutations);
    relations && relationsDef.push(relations);
  }

  sb.queryType({
    fields: (qb) => {
      return Object.assign({}, ...queriesDef.map((fn) => fn(qb)));
    },
  });

  sb.mutationType({
    fields: (mb) => {
      return Object.assign({}, ...mutationsDef.map((fn) => fn(mb)));
    },
  });

  relationsDef.forEach((fn) =>
    fn((objectType, relations) => {
      // FIXME: 独自定義オブジェクトの関連設定は未実装
      if (typeof objectType === "string") {
        Object.entries(relations).forEach(([relationName, relation]) => {
          sb.objectField(objectType, relationName, relation);
        });
      }
    }),
  );
};
