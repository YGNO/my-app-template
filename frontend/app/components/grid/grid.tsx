import {
  type Dispatch,
  type SetStateAction,
  Suspense,
  forwardRef,
  lazy,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import type { Column, GridOption, SlickgridReactInstance } from "slickgrid-react";

const SlickgridReact = lazy(async () => {
  const { SlickgridReact } = await import("slickgrid-react");
  return {
    default: SlickgridReact,
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
}

const loading = <div>Loading</div>;

const CONTAINER_ID_PREFIX = "grid-container_";
const Grid = <DATA,>(
  { id, column, options }: GridProps,
  ref: React.Ref<GridHandle<DATA>>,
): React.ReactElement | null => {
  const [mounded, setMounded] = useState(false);
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
