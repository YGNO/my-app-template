import type { FieldRef } from "@pothos/core";
import type { SchemaBuilderType, SchemaType } from "../schemaDefine.ts";
import type { GqlDomain } from "./gqlDomain.ts";

/** Slickgrid のデータ取得で使用する Enum 定義 */
export const SlickgridEnum = {
  SlickgridDirection: ["ASC", "DESC", "asc", "desc"] as const,
  // https://ghiscoding.gitbook.io/slickgrid-react/backend-services/graphql/graphql-filtering#filterby
  SlickgridOperator: [
    "Contains",
    "Not_Contains",
    "LT",
    "LE",
    "GT",
    "GE",
    "NE",
    "EQ",
    "StartsWith",
    "EndsWith",
    "IN",
    "NOT_IN",
  ] as const,
};
type Direction = (typeof SlickgridEnum.SlickgridDirection)[number];
export type Operator = (typeof SlickgridEnum.SlickgridOperator)[number];

export const SLICKGRID_FILTER_VALUE = "SlickgridFilterValue";
/**
 * Slickgrid の絞り込み条件で指定できる値
 * Note: カスタムした値を設定できるので、必要に応じて追加する
 */
type SlickgridFilterValueType = string | number | Array<unknown>;
export type SlickgridFilterValue = {
  SlickgridFilterValue: {
    Input: SlickgridFilterValueType;
    Output: SlickgridFilterValueType;
  };
};
export const SlickgridFilterResolver = {
  serialize: (v: SlickgridFilterValueType) => v,
  parseValue: (v: unknown): SlickgridFilterValueType => {
    if (Array.isArray(v) || typeof v === "number" || typeof v === "string") {
      return v;
    }
    throw new Error("Value must be a SlickgridFilterValueType");
  },
};

const setOrderInput = <Field extends string>(sb: SchemaBuilderType, name: string, fields: readonly Field[]) => {
  const field = sb.enumType(`${name}_order_fields`, { values: fields });
  return sb.inputType(`${name}_order`, {
    fields: (fb) => ({
      field: fb.field({ type: field, required: true }),
      direction: fb.field({ type: "SlickgridDirection", required: true }),
    }),
  });
};

const setFilterInput = <Field extends string>(sb: SchemaBuilderType, name: string, fields: readonly Field[]) => {
  const field = sb.enumType(`${name}_filter_fields`, { values: fields });
  return sb.inputType(`${name}_filter`, {
    fields: (fb) => ({
      field: fb.field({ type: field, required: true }),
      operator: fb.field({ type: "SlickgridOperator", required: true }),
      value: fb.field({ type: SLICKGRID_FILTER_VALUE, required: true }),
    }),
  });
};

type QueryResult<Row extends Record<string, unknown>> = { totalCount: number; nodes: Row[] };
const setQueryResult = <Field extends string>(sb: SchemaBuilderType, name: string, fields: readonly Field[]) => {
  type Row = { [K in Field]: unknown };
  // 列一覧からノードのオブジェクトを生成する
  const node = sb.objectRef<Row>(`${name}_query_node`);
  node.implement({
    fields: (fb) => ({
      ...fields.reduce<Record<string, FieldRef<SchemaType, unknown, "Object">>>((acc, key) => {
        // Note: それぞれの列の型はここは確定しないので、JSONとして扱う
        acc[key] = fb.field({ type: "JSON", resolve: (row) => row[key] });
        return acc;
      }, {}),
    }),
  });

  const queryResult = sb.objectRef<QueryResult<Row>>(`${name}_query_result`);

  return sb.objectType(queryResult, {
    fields: (fb) => ({
      totalCount: fb.int({
        resolve: (parent) => parent.totalCount,
      }),
      nodes: fb.field({
        type: [node],
        resolve: (parent) => parent.nodes,
      }),
    }),
  });
};

export type PaginationOption<Field extends string> = {
  first: number;
  offset: number;
  orderBy?: { field: keyof Field; direction: Direction }[] | null;
};

export type FilterOption<Field extends string> = {
  filterBy?: { field: Field; operator: Operator; value: SlickgridFilterValueType }[] | null;
};

type QueryArgs<Field extends string> = PaginationOption<Field> & FilterOption<Field>;

/**
 * slickgrid 用のクエリを登録する
 */
export const gridQuery = <Field extends string>({
  queryName: name,
  fields,
  resolve,
  builder: sb,
}: {
  queryName: string;
  fields: readonly Field[];
  // Note: リゾルバーで返されるオブジェクトは プロパティ名 の有無のみチェックできてばよいので、値は unknown にしてしまう
  resolve: (args: QueryArgs<Field>) => Promise<QueryResult<{ [K in Field]: unknown }>>;
  builder: SchemaBuilderType;
}) => {
  const order = setOrderInput(sb, name, fields);
  const filter = setFilterInput(sb, name, fields);
  const result = setQueryResult(sb, name, fields);

  return {
    queries: (qb) => ({
      [name]: qb.field({
        type: result,
        args: {
          first: qb.arg.int({ required: true }),
          offset: qb.arg.int({ required: true }),
          orderBy: qb.arg({ type: [order] }),
          filterBy: qb.arg({ type: [filter] }),
        },
        resolve: (_, args) => resolve(args as QueryArgs<Field>),
      }),
    }),
  } as GqlDomain<QueryResult<{ [K in Field]: unknown }>>;
};
