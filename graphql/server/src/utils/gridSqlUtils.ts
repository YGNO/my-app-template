import { type SQL, and, eq, gt, gte, inArray, like, lt, lte, ne, notInArray, notLike, sql } from "drizzle-orm";
import type { PgColumn, PgSelect } from "drizzle-orm/pg-core";
import type { FilterOption, Operator, PaginationOption } from "./gridQuery.ts";

/** 指定されたSQLステートメントにページング用のオプションを連結する  */
export const setPagination = <Query extends PgSelect, Field extends string>(
  selectSql: Query,
  id: PgColumn,
  option: PaginationOption<Field>,
) => {
  const { first, offset } = option;
  return selectSql.orderBy(toOrderBySql(option, id)).limit(first).offset(offset);
};

const toOrderBySql = <Field extends string>(option: PaginationOption<Field>, id: PgColumn) => {
  if (!option.orderBy) {
    return sql.raw(`"${id.name}" asc`);
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
    case "NOT_IN":
      return notInArray(f, value);
    default:
      throw Error(`invalid operator(field:${field}, operator:${operator})`);
  }
};
