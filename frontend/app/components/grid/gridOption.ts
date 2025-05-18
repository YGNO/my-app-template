import type { GridOption as SlickgridGridOption } from "@slickgrid-universal/common";
import type { GraphqlService } from "@slickgrid-universal/graphql";

type Props<Data> = {
  fetcher?: {
    graphqlService: GraphqlService;
    onFetch: (data: Data[]) => void;
  };
};

export type GridOption<Data> = (props: Props<Data>) => SlickgridGridOption;
