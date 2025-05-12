import Grid, { type GridHandle } from "@/components/grid/grid.tsx";
import { buildGridDataFetcher } from "@/components/grid/gridDataFetcher.ts";
import { SlickgridContext, SlickgridProvider } from "@/components/grid/slickgridProvider.tsx";
import type { Column, GridOption } from "@slickgrid-universal/common";
import type { GraphqlServiceApi } from "@slickgrid-universal/graphql";
import { useContext, useRef } from "react";

type PrefectureGridData = {
  code: number;
  name: string;
  nameKana: string;
  nameAlpha: string;
};

const getColumnDef = (): Column[] => {
  /** id, field は GraphQL のクエリと一致させる必要があるので注意 */
  return [
    {
      id: "code",
      name: "コード",
      field: "code",
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

const getGridOption = (backendServiceApi: GraphqlServiceApi): GridOption => {
  return {
    gridWidth: "100%",
    datasetIdPropertyName: "code",
    enableHeaderMenu: false,
    enableAutoResize: false,
    enableFiltering: true,
    showPreHeaderPanel: false,
    backendServiceApi,
  };
};

const WrapedGrid: React.FC = () => {
  const gridRef = useRef<GridHandle<PrefectureGridData>>(null);

  const { graphqlService } = useContext(SlickgridContext);
  if (!graphqlService) {
    return <div />;
  }

  const gridOption = getGridOption(
    buildGridDataFetcher<PrefectureGridData>({
      graphqlService,
      datasetName: "PrefectureTable",
      onFetch: ({ data, infiniteScrollBottomHit }) => {
        if (!gridRef.current) {
          return;
        }
        if (infiniteScrollBottomHit) {
          gridRef.current.gridInstance?.dataView?.addItems(data);
          return;
        }
        gridRef.current.gridInstance?.slickGrid.scrollTo(0);
        gridRef.current.setDataset(data);
      },
    }),
  );

  return <Grid id="prefectureGrid" column={getColumnDef()} options={gridOption} ref={gridRef} />;
};

const PrefectureGrid: React.FC = () => {
  return (
    <SlickgridProvider>
      <WrapedGrid />
    </SlickgridProvider>
  );
};

export default PrefectureGrid;
