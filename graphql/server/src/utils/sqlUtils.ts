// deno-lint-ignore-file no-explicit-any

import { eq } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

/**
 * 指定されたキーフィールド毎にレコードをグルーピングする
 * @param records レコード一覧
 * @param idField キーフィールド名
 * @param ids グルーピングするID一覧
 * @returns
 */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const groupByIds = <T extends { [field: string]: any }>(
  records: T[],
  idField: string,
  ids: number[] | string[],
) => {
  const groupMap: Record<number | string, typeof records> = {};
  for (const record of records) {
    const id = record[idField];
    if (!groupMap[id]) {
      groupMap[id] = [];
    }
    groupMap[id].push(record);
  }
  return ids.map((id) => groupMap[id] || []);
};

/**
 * 指定されたID順にレコードをソートする
 * @param records レコード一覧
 * @param idField ソート対象のフィールド名
 * @param ids ソート順配列
 */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const sortByIds = <T extends { [field: string]: any }>(
  records: T[],
  idField: string,
  ids: number[] | string[],
) => {
  const orderMap = new Map<number | string, number>();
  ids.forEach((id, index) => {
    orderMap.set(id, index);
  });

  return [...records].sort((a, b) => {
    return (
      (orderMap.get(a[idField]) ?? Number.POSITIVE_INFINITY) - (orderMap.get(b[idField]) ?? Number.POSITIVE_INFINITY)
    );
  });
};

/**
 * 指定された条件のうち、値が undefined でないものを抽出し、SQL 条件式を生成する
 */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const setEq = (conditions: [PgColumn<any, any, any>, any][]) => {
  return conditions
    .map(([column, value]) => {
      if (value === undefined) {
        return undefined;
      }
      return eq(column, value);
    })
    .filter((c): c is Exclude<typeof c, undefined> => c !== undefined);
};
