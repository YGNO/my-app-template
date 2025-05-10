import type { FieldRef } from "@pothos/core";
import { asc, sql } from "drizzle-orm";
import type { PgColumn, PgSelect } from "drizzle-orm/pg-core";
import type { SchemaBuilderType, SchemaType } from "../../schemaDefine.ts";
import type { GqlSchema } from "../../utils/schemaUtils.ts";

type Direction = "ASC" | "DESC" | "asc" | "desc";
const registerOrder = <Field extends string>(name: string, fields: readonly Field[], sb: SchemaBuilderType) => {
  const field = sb.enumType(`${name}_order_fields`, { values: fields });
  const direction = sb.enumType(`${name}_direction`, {
    values: ["ASC", "DESC", "asc", "desc"],
  });

  return sb.inputType(`${name}_order`, {
    fields: (fb) => ({
      field: fb.field({ type: field, required: true }),
      direction: fb.field({ type: direction, required: true }),
    }),
  });
};

export const SLICKGRID_FILTER_VALUE = "SlickgridFilterValue";
// TODO: 必要であれば、随時追加する
type SlickgridFilterValueType = string | number;
export type SlickgridFilterValue = {
  SlickgridFilterValue: {
    Input: SlickgridFilterValueType;
    Output: SlickgridFilterValueType;
  };
};
export const SlickgridFilterResolver = {
  serialize: (v: SlickgridFilterValueType) => v,
  parseValue: (v: unknown): SlickgridFilterValueType => {
    if (typeof v === "number") {
      return v;
    }
    if (typeof v === "string") {
      return v;
    }
    throw new Error("Value must be a SlickgridFilterValueType");
  },
};

const registerFilter = <Field extends string>(name: string, fields: readonly Field[], sb: SchemaBuilderType) => {
  const field = sb.enumType(`${name}_filter_fields`, { values: fields });

  // https://ghiscoding.gitbook.io/slickgrid-react/backend-services/graphql/graphql-filtering#filterby
  const operator = sb.enumType(`${name}_operator`, {
    values: ["Contains", "Not_Contains", "LT", "LE", "GT", "NE", "EQ", "StartsWith", "EndsWith", "IN", "NOT_IN"],
  });

  sb.addScalarType;

  return sb.inputType(`${name}_filter`, {
    fields: (fb) => ({
      field: fb.field({ type: field, required: true }),
      operator: fb.field({ type: operator, required: true }),
      value: fb.field({ type: SLICKGRID_FILTER_VALUE, required: true }),
    }),
  });
};

type QueryResult<Row extends Record<string, unknown>> = { totalCount: number; nodes: Row[] };
const registerQueryResult = <Field extends string>(name: string, fields: readonly Field[], sb: SchemaBuilderType) => {
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

type PaginationOption<Field extends string> = {
  first: number;
  offset: number;
  orderBy?: { field: keyof Field; direction: Direction }[] | null;
};

type QueryArgs<Field extends string> = PaginationOption<Field> & {
  filterBy?: { field: Field; value: SlickgridFilterValueType }[] | null;
};

/**
 * slickgrid 用のクエリを登録する
 * @param name クエリ名
 * @param fields フィールド一覧
 * @param resolve クエリのリゾルバ
 * @returns
 */
export const registerGridQuery = <Field extends string>({
  name,
  fields,
  resolve,
  builder,
}: {
  name: string;
  fields: readonly Field[];
  // Note: リゾルバーで返されるオブジェクトは プロパティ名 の有無のみチェックできてばよいので、値は unknown にしてしまう
  resolve: (args: QueryArgs<Field>) => Promise<QueryResult<{ [K in Field]: unknown }>>;
  builder: SchemaBuilderType;
}) => {
  const order = registerOrder(name, fields, builder);
  const filter = registerFilter(name, fields, builder);
  const result = registerQueryResult(name, fields, builder);

  return {
    queries: (_, qb) => ({
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
  } as GqlSchema<QueryResult<{ [K in Field]: unknown }>>;
};

/** 指定されたSQLステートメントにページング用のオプションを連結する  */
export const setPagination = <SQL extends PgSelect, Field extends string>(
  selectSql: SQL,
  id: PgColumn,
  optin: PaginationOption<Field>,
) => {
  const { first, offset } = optin;
  return selectSql
    .orderBy(toOrderBySql(optin, id))
    .limit(first)
    .offset(offset * first);
};

const toOrderBySql = <Field extends string>(optin: PaginationOption<Field>, id: PgColumn) => {
  if (!optin.orderBy) {
    return asc(id);
  }

  // Note: ソートは複数指定しても最初の１つだけの適用にする
  const { field, direction } = optin.orderBy[0];
  // Note: drizzle は列を " で囲んで生成するので、列名は " で囲んでおく
  return sql.raw(`"${field.toString()}" ${direction}, "${id.name}" ${direction}`);
};
