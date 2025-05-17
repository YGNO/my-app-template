import type { FieldRef, GenericFieldRef, ObjectFieldThunk, QueryFieldsShape } from "@pothos/core";
import type { SchemaBuilderType, SchemaType } from "../schemaDefine.ts";

type ObjectRef = SchemaType["Objects"];
type ObjectRefKey = keyof SchemaType["Objects"];
type AnyObject = { [k: string]: unknown };

type SetQueries<RtuenType> = (qb: Parameters<QueryFieldsShape<SchemaType>>[0]) => {
  [queryName: string]: FieldRef<SchemaType, RtuenType | null | undefined, "Query">;
};
type AnySetQueries =
  | SetQueries<ObjectRef[ObjectRefKey] | readonly ObjectRef[ObjectRefKey][]>
  | SetQueries<AnyObject | readonly AnyObject[]>;

type SetRelations<T extends ObjectRefKey | AnyObject> = T extends ObjectRefKey
  ? (set: SetRelation<T, ObjectRef[T]>) => void
  : (set: SetRelation<T, PothosSchemaTypes.ObjectRef<SchemaType, T, T>>) => void;
type SetRelation<T, Parent> = (
  object: T,
  relations: {
    [relationName: string]: (t: Parameters<ObjectFieldThunk<SchemaType, Parent>>[0]) => GenericFieldRef;
  },
) => void;

type AnySetRelations = SetRelations<ObjectRefKey | AnyObject>;

/**
 * 各種GraphQLの定義をドメイン毎にまとめるためのインタフェイス
 */
export interface GqlDomain<T extends ObjectRefKey | AnyObject> {
  queries?: T extends ObjectRefKey ? SetQueries<ObjectRef[T] | readonly ObjectRef[T][]> : SetQueries<T | readonly T[]>;
  // FIXME: 独自定義オブジェクトの関連設定は未実装
  relations?: T extends ObjectRefKey ? SetRelations<T> : undefined;
}

/** ドメイン毎の定義を Schem に登録する関数型 */
type GqlDomainBuilder<T extends ObjectRefKey | AnyObject> = (schemaBuilder: SchemaBuilderType) => GqlDomain<T>;

export const gqlDomain = <T extends ObjectRefKey | AnyObject>(builder: GqlDomainBuilder<T>) => builder;

/** gqlDomain を定義したファイルを読み込む */
const loadGqlDomain = async () => {
  // Note: vite でビルドすることを前提に「import.meta.glob」を使用
  //       vite に依存させず、専用のデコレータを実装する方法もあるが、ルールが複雑化するので実装しない
  const loadFuncs = Object.values(import.meta.glob("../schemas/**/*.domain.ts"));
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const modules = await Promise.all(loadFuncs.map((fn) => fn() as any));
  return modules.map((m) => m.default as GqlDomainBuilder<ObjectRefKey | AnyObject>);
};

/**
 * gqlDomain を schema に登録する
 * @param sb スキーマビルダ
 * @param entries 定義を配置しているディレクトリ
 */
export const buildGqlDomain = async (sb: SchemaBuilderType) => {
  const builders = await loadGqlDomain();
  const queriesDef: AnySetQueries[] = [];
  const relationsDef: AnySetRelations[] = [];
  for (const domainBuilder of builders) {
    const { queries, relations } = domainBuilder(sb);
    queries && queriesDef.push(queries);
    relations && relationsDef.push(relations);
  }

  sb.queryType({
    fields: (qb) => {
      return Object.assign({}, ...queriesDef.map((fn) => fn(qb)));
    },
  });

  relationsDef.forEach((fn) =>
    fn((object, relations) => {
      // FIXME: 独自定義オブジェクトの関連設定は未実装
      if (typeof object === "string") {
        Object.entries(relations).forEach(([relationName, relation]) => {
          sb.objectField(object, relationName, relation);
        });
      }
    }),
  );
};
