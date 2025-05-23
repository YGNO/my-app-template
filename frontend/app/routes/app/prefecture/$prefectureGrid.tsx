import Grid, { type GridHandle } from "@/components/grid/grid.tsx";
import { GridContext, GridProvider } from "@/components/grid/gridProvider.tsx";
import { useContext, useRef, useState } from "react";
import { PrefectureForm } from "./$prefectureForm.tsx";
import { PrefectureGridColumn, PrefectureGridOption } from "./prefectureGridDefine.ts";

type PrefectureGridData = {
  code: number;
  name: string;
  nameKana: string;
  nameAlpha: string;
};

const WrapedGrid: React.FC = () => {
  const gridRef = useRef<GridHandle<PrefectureGridData>>(null);
  const [prefectureCode, setPrefectureCode] = useState<number>();

  // Note: graphqlService、formatters は SSR で初期化されないので、フロントエンドで初期化されるのを待つ
  const { graphqlService, formatters } = useContext(GridContext);
  if (!graphqlService || !formatters) {
    return <div />;
  }

  const option = PrefectureGridOption({
    fetcher: {
      graphqlService,
      onFetch: (data) => {
        if (!gridRef.current) {
          return;
        }
        gridRef.current.setDataset(data);
      },
    },
  });

  const column = PrefectureGridColumn(formatters, {
    onEditAction: (code: number) => {
      setPrefectureCode(code);
    },
  });

  return (
    <>
      <PrefectureForm code={prefectureCode} onClose={() => setPrefectureCode(undefined)} />
      <Grid id="prefectureGrid" column={column} options={option} ref={gridRef} />
    </>
  );
};

const PrefectureGrid: React.FC = () => {
  return (
    <GridProvider>
      <WrapedGrid />
    </GridProvider>
  );
};

export default PrefectureGrid;
