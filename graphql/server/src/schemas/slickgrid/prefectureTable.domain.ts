import { dbClient, dbSchema } from "@my-app/db-client";
import { count, sql } from "drizzle-orm";
import { gqlDomain } from "../../utils/gqlDomain.ts";
import { gridQuery, setFilterOption, setPagination } from "./slickgridQueryUtils.ts";

export default gqlDomain((builder) =>
  gridQuery({
    builder,
    queryName: "PrefectureTable",
    fields: ["code", "name", "nameKana", "nameAlpha"],
    async resolve(args) {
      const prefecture = dbSchema.prefecture;
      const baseSql = dbClient
        .select({
          code: prefecture.code,
          name: prefecture.name,
          // Note: DBの列名 と Grid の列名で名前が違うので、サブクエリで補正する
          nameKana: sql<string>`(${prefecture.nameKana})`.as("nameKana"),
          nameAlpha: sql<string>`(${prefecture.nameAlpha})`.as("nameAlpha"),
        })
        .from(prefecture)
        .as("base");

      let countSql = dbClient.select({ count: count() }).from(baseSql).$dynamic();
      countSql = setFilterOption(countSql, args);
      const totalCount = (await countSql)[0].count;

      let nodeSql = dbClient.select().from(baseSql).$dynamic();
      nodeSql = setFilterOption(nodeSql, args);
      nodeSql = setPagination(nodeSql, prefecture.code, args);
      const nodes = (await nodeSql) || [];

      return { totalCount, nodes };
    },
  }),
);
