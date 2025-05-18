import { editActionColumn } from "@/components/grid/gridColumn.ts";
import { GridDataFetcher } from "@/components/grid/gridDataFetcher.ts";
import type { GridOption } from "@/components/grid/gridOption.ts";
import type { Column, IFormatters, OnEventArgs } from "@slickgrid-universal/common";

type PrefectureGridData = {
  code: number;
  name: string;
  nameKana: string;
  nameAlpha: string;
};

const KEY_FIELD = "code";
export const PrefectureGridColumn = (
  formatters: IFormatters,
  action: {
    onEditAction: (code: number) => void;
  },
): Column[] => {
  /** id, field は GraphQL のクエリと一致させる必要があるので注意 */
  return [
    editActionColumn(formatters, {
      onClick(_e: Event, args: OnEventArgs) {
        action.onEditAction(Number(args.dataContext.code));
      },
    }),
    {
      id: KEY_FIELD,
      name: "コード",
      field: KEY_FIELD,
      sortable: true,
      type: "number",
      filterable: true,
      minWidth: 100,
      maxWidth: 100,
    },
    {
      id: "name",
      name: "都道府県名",
      field: "name",
      sortable: true,
      type: "string",
      filterable: true,
      minWidth: 150,
      maxWidth: 150,
    },
    {
      id: "nameKana",
      name: "都道府県名（カナ）",
      field: "nameKana",
      sortable: true,
      type: "string",
      filterable: true,
      minWidth: 200,
      maxWidth: 200,
    },
    {
      id: "nameAlpha",
      name: "都道府県名（ローマ字）",
      field: "nameAlpha",
      type: "string",
      filterable: true,
      minWidth: 250,
    },
  ];
};

const GRID_QUERY_NAME = "PrefectureTable";
const DEFAULT_PAGE_SIZE = 50;
export const PrefectureGridOption: GridOption<PrefectureGridData> = ({ fetcher }) => {
  return {
    gridWidth: "100%",
    datasetIdPropertyName: KEY_FIELD,
    enableHeaderMenu: false,
    enableAutoResize: false,
    enableFiltering: true,
    showPreHeaderPanel: false,
    enablePagination: true,
    pagination: {
      pageSizes: [25, 50, 100],
      pageSize: DEFAULT_PAGE_SIZE,
    },
    backendServiceApi:
      fetcher &&
      GridDataFetcher<PrefectureGridData>({
        graphqlService: fetcher.graphqlService,
        datasetName: GRID_QUERY_NAME,
        infiniteScroll: false,
        onFetch: ({ data }) => fetcher.onFetch(data),
      }),
  };
};
