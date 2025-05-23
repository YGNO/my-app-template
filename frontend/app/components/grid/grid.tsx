import {
  type Dispatch,
  type SetStateAction,
  Suspense,
  forwardRef,
  lazy,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type {
  Column,
  GridOption,
  SlickgridReact as SlickgridReactClass,
  SlickgridReactInstance,
} from "slickgrid-react";
import { Loading } from "../processing/processing.tsx";

const SlickgridReact = lazy(async () => {
  const { SlickgridReact } = await import("slickgrid-react");
  return {
    default: memo(SlickgridReact),
  };
});

interface GridProps {
  id?: string;
  column: Column[];
  options?: GridOption;
}

export interface GridHandle<DATA> {
  gridInstance: SlickgridReactInstance | undefined;
  setDataset: Dispatch<SetStateAction<DATA[]>>;
  refreshBackendDataset: () => void;
}

const loading = <Loading />;

const CONTAINER_ID_PREFIX = "grid-container_";
const Grid = <DATA,>(
  { id, column, options }: GridProps,
  ref: React.Ref<GridHandle<DATA>>,
): React.ReactElement | null => {
  const [mounded, setMounded] = useState(false);
  const gridRef = useRef<SlickgridReactClass>(null);
  const [gridInstance, setGridInstance] = useState<SlickgridReactInstance>();
  const [dataset, setDataset] = useState<DATA[]>([]);
  const [containerId, setContainerId] = useState<string>();

  useEffect(() => {
    setMounded(true);
    setContainerId(`${CONTAINER_ID_PREFIX}${self.crypto.randomUUID()}`);
  }, []);

  useImperativeHandle(ref, () => ({
    gridInstance,
    setDataset,
    refreshBackendDataset: () => {
      if (!gridRef.current) {
        return;
      }
      // データセットを更新する、何故かこのメソッドが gridInstance で公開されていないので、直接 ref から呼び出す
      return gridRef.current.backendUtilityService.refreshBackendDataset(options!);
    },
  }));

  if (!mounded || !containerId) {
    return loading;
  }

  return (
    <Suspense fallback={loading}>
      <div id={containerId}>
        <SlickgridReact
          gridId={id}
          columns={column}
          options={options}
          dataset={dataset}
          ref={gridRef}
          onReactGridCreated={($event) => setGridInstance($event.detail)}
        />
      </div>
    </Suspense>
  );
};

Grid.displayName = "Grid";
export default forwardRef(Grid) as <DATA>(
  props: GridProps & { ref?: React.Ref<GridHandle<DATA>> },
) => React.ReactElement | null;
