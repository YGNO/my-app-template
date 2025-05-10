import SchemaBuilder from "@pothos/core";
import AddGraphQLPlugin from "@pothos/plugin-add-graphql";
import DataloaderPlugin from "@pothos/plugin-dataloader";
import { DateResolver, JSONResolver } from "graphql-scalars";
import type { SlickgridFilterValue } from "./schemas/slickgrid/slickgridQueryUtils.ts";
import { SLICKGRID_FILTER_VALUE, SlickgridFilterResolver } from "./schemas/slickgrid/slickgridQueryUtils.ts";

type SchemaBuilderOption = {
  Scalars: SlickgridFilterValue & {
    JSON: { Input: unknown; Output: unknown };
    Date: { Input: Date; Output: Date };
  };
};
export type SchemaType = PothosSchemaTypes.ExtendDefaultTypes<SchemaBuilderOption>;
export type SchemaBuilderType = PothosSchemaTypes.SchemaBuilder<SchemaType>;

let builder: SchemaBuilderType;
export const getSchemaBuilder = (): SchemaBuilderType => {
  if (builder !== undefined) {
    return builder;
  }

  builder = new SchemaBuilder<SchemaBuilderOption>({
    plugins: [AddGraphQLPlugin, DataloaderPlugin],
  });
  builder.addScalarType("JSON", JSONResolver);
  builder.addScalarType("Date", DateResolver);
  builder.scalarType(SLICKGRID_FILTER_VALUE, SlickgridFilterResolver);
  return builder;
};
