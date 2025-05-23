import { GRAPHQL_ENTRY_URL } from "@/utils/graphQlClient.ts";
import type { Metrics } from "@slickgrid-universal/common";
import type {
  GraphqlPaginatedResult,
  GraphqlResult,
  GraphqlService,
  GraphqlServiceApi,
  GraphqlServiceOption,
} from "@slickgrid-universal/graphql";

const fetchClient = {
  query: async (query: string) => {
    const res = await fetch(GRAPHQL_ENTRY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    return await res.json();
  },
};

type GridDate = Record<string, unknown>;

type Props<DATA extends GridDate> = {
  graphqlService: GraphqlService;
  onFetch?: (data: {
    data: DATA[];
    totalCount: number;
    infiniteScrollBottomHit?: boolean;
    metrics?: Metrics;
  }) => void;
} & GraphqlServiceOption;

/**
 * グリッドデータの取得用のAPIを生成する
 */
export const gridDataFetcher = <DATA extends GridDate>({
  graphqlService,
  infiniteScroll = { fetchSize: 30 },
  onFetch,
  ...options
}: Props<DATA>): GraphqlServiceApi => {
  return {
    disableInternalPostProcess: true,
    options: {
      ...options,
      infiniteScroll,
    },
    service: graphqlService,
    process: async (queryString) => {
      try {
        return await fetchClient.query(queryString);
      } catch (e) {
        console.error("GraphQLの取得に失敗しました。", e);
        throw e;
      }
    },
    postProcess: (result: GraphqlResult | GraphqlPaginatedResult) => {
      const data = result.data[options.datasetName]!;
      if (Array.isArray(data)) {
        throw new Error("GraphqlPaginatedResult 以外のデータが返されました。");
      }
      const nodes = (data.nodes ?? []) as DATA[];
      const totalCount = data.totalCount ?? 0;
      const infiniteScrollBottomHit = "infiniteScrollBottomHit" in result ? result.infiniteScrollBottomHit : false;
      const metrics = result.metrics as Metrics;
      if (onFetch) {
        onFetch({ data: nodes, totalCount, infiniteScrollBottomHit, metrics });
      }
    },
  };
};
