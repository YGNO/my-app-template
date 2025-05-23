import type { IFormatters } from "@slickgrid-universal/common";
import type { GraphqlService } from "@slickgrid-universal/graphql";
import { useEffect, useState } from "react";
import { createContext } from "react";

export const GridContext = createContext<{
  formatters?: IFormatters;
  graphqlService?: GraphqlService;
}>({});

export const GridProvider = ({ children }: { children: React.ReactNode }) => {
  const [formatters, setFormatters] = useState<IFormatters>();
  const [graphqlService, setGraphqlService] = useState<GraphqlService>();

  useEffect(() => {
    // Note: multiple-select-vanilla が window を直接利用しており SSR対象にできないので、
    //       multiple-select-vanilla に依存しているモジュールは動的に import してcontext 経由で配下に渡す。
    (async () => {
      const { Formatters } = await import("@slickgrid-universal/common");
      setFormatters(Formatters);
    })();

    (async () => {
      const { GraphqlService } = await import("@slickgrid-universal/graphql");
      setGraphqlService(new GraphqlService());
    })();
  }, []);

  return <GridContext.Provider value={{ formatters, graphqlService }}>{children}</GridContext.Provider>;
};
