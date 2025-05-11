import type { FieldRef } from "@pothos/core";
import { type SQL, and, asc, eq, gt, gte, inArray, like, lt, lte, ne, notInArray, notLike, sql } from "drizzle-orm";
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

type Operator =
  | "Contains"
  | "Not_Contains"
  | "LT"
  | "LE"
  | "GT"
  | "GE"
  | "NE"
  | "EQ"
  | "StartsWith"
  | "EndsWith"
  | "IN"
  | "NIN";
const registerFilter = <Field extends string>(name: string, fields: readonly Field[], sb: SchemaBuilderType) => {
  const field = sb.enumType(`${name}_filter_fields`, { values: fields });

  // https://ghiscoding.gitbook.io/slickgrid-react/backend-services/graphql/graphql-filtering#filterby
  const operator = sb.enumType(`${name}_operator`, {
    values: ["Contains", "Not_Contains", "LT", "LE", "GT", "NE", "EQ", "StartsWith", "EndsWith", "IN", "NOT_IN"],
  });

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

type FilterOption<Field extends string> = {
  filterBy?: { field: Field; operator: Operator; value: SlickgridFilterValueType }[] | null;
};

type QueryArgs<Field extends string> = PaginationOption<Field> & FilterOption<Field>;

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
export const setPagination = <Query extends PgSelect, Field extends string>(
  selectSql: Query,
  id: PgColumn,
  option: PaginationOption<Field>,
) => {
  const { first, offset } = option;
  return selectSql
    .orderBy(toOrderBySql(option, id))
    .limit(first)
    .offset(offset * first);
};

const toOrderBySql = <Field extends string>(option: PaginationOption<Field>, id: PgColumn) => {
  if (!option.orderBy) {
    return asc(id);
  }

  // Note: ソートは複数指定しても最初の１つだけの適用にする
  const { field, direction } = option.orderBy[0];
  // Note: drizzle は列を " で囲んで生成するので、列名は " で囲んでおく
  return sql.raw(`"${field.toString()}" ${direction}, "${id.name}" ${direction}`);
};

/** 指定されたSQLステートメントに検索用のオプションを連結する  */
export const setFilterOption = <Query extends PgSelect, Field extends string>(
  selectSql: Query,
  option: FilterOption<Field>,
) => {
  if (!option.filterBy || option.filterBy.length === 0) {
    return selectSql;
  }
  const filters: SQL<unknown>[] = [];
  for (const { field, operator, value } of option.filterBy) {
    if (typeof value === "number") {
      filters.push(numberFilter(field, operator, value));
    }
    if (typeof value === "string") {
      filters.push(stringFilter(field, operator, value));
    }
    if (Array.isArray(value)) {
      filters.push(arrayFilter(field, operator, value));
    }
  }
  selectSql.where(and(...filters));
  return selectSql;
};

const stringFilter = <Field extends string>(field: Field, operator: Operator, value: string) => {
  const f = sql.raw(`"${field}"`);
  switch (operator) {
    case "EQ":
      return eq(f, value);
    case "NE":
      return ne(f, value);
    case "Contains":
      return like(f, sql`'%' || ${value} || '%'`);
    case "Not_Contains":
      return notLike(f, sql`'%' || ${value} || '%'`);
    case "StartsWith":
      return like(f, sql`${value} || '%'`);
    case "EndsWith":
      return like(f, sql`'%' || ${value}`);
    default:
      throw Error(`invalid operator(field:${field}, operator:${operator})`);
  }
};

const numberFilter = <Field extends string>(field: Field, operator: Operator, value: number) => {
  const f = sql.raw(field);
  switch (operator) {
    case "EQ":
      return eq(f, value);
    case "NE":
      return ne(f, value);
    case "LE":
      return lte(f, value);
    case "LT":
      return lt(f, value);
    case "GE":
      return gte(f, value);
    case "GT":
      return gt(f, value);
    default:
      throw Error(`invalid operator(field:${field}, operator:${operator})`);
  }
};

const arrayFilter = <Field extends string>(field: Field, operator: Operator, value: Array<unknown>) => {
  const f = sql.raw(field);
  switch (operator) {
    case "IN":
      return inArray(f, value);
    case "NIN":
      return notInArray(f, value);
    default:
      throw Error(`invalid operator(field:${field}, operator:${operator})`);
  }
};
