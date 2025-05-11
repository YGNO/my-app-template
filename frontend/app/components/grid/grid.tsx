import {
  type ForwardRefRenderFunction,
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

interface GridProps<DATA> {
  id?: string;
  column: Column[];
  options?: GridOption;
  data: DATA[];
}

export interface GridHandle {
  getGridInstance: () => SlickgridReactInstance | undefined;
}

interface ForwardGridRefFunction<DATA = unknown> extends ForwardRefRenderFunction<GridHandle, GridProps<DATA>> {}

const loading = <div>Loading</div>;

const Grid: ForwardGridRefFunction = ({ id, column, options, data }, ref) => {
  const [mounded, setMounded] = useState(false);
  const [gridInstance, setGridInstance] = useState<SlickgridReactInstance>();
  useEffect(() => {
    setMounded(true);
  }, []);

  useImperativeHandle(ref, () => ({
    getGridInstance: () => gridInstance,
  }));

  if (!mounded) {
    return loading;
  }

  return (
    <Suspense fallback={loading}>
      <SlickgridReact
        gridId={id}
        columns={column}
        options={options}
        dataset={data}
        onReactGridCreated={($event) => setGridInstance($event.detail)}
      />
    </Suspense>
  );
};

Grid.displayName = "Child";
export default forwardRef(Grid);
