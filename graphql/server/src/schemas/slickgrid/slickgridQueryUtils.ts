import type { SchemaBuilderType } from "../../schemaBuilder.ts";

export const registerOrder = <Fields extends string>(name: string, sb: SchemaBuilderType, fields: Fields[]) => {
  const field = sb.enumType(`${name}_order_fields`, {
    values: fields,
  });

  const direction = sb.enumType(`${name}_direction`, {
    values: ["ASC", "DESC", "asc", "desc"],
  });

  return sb.inputType(`${name}_order`, {
    fields: (fb) => {
      return {
        field: fb.field({ type: field, required: true }),
        direction: fb.field({ type: direction, required: true }),
      };
    },
  });
};

export const SLICKGRID_FILTER_VALUE = "SlickgridFilterValue";
// TODO: 必要であれば、随時追加する
type SlickgridFilterValueType = string | number;
export type SlickgridFilterValue = {
  SlickgridFilterValue: {
    Input: SlickgridFilterValueType;
    Output: SlickgridFilterValueType;
  };
};
export const SlickgridFilterResolver = {
  serialize: (v: SlickgridFilterValueType) => v,
  parseValue: (v: unknown): SlickgridFilterValueType => {
    if (typeof v === "number") {
      return v;
    }
    if (typeof v === "string") {
      return v;
    }
    throw new Error("Value must be a SlickgridFilterValueType");
  },
};

export const registerFilter = <Fields extends string>(name: string, sb: SchemaBuilderType, fields: Fields[]) => {
  const field = sb.enumType(`${name}_filter_fields`, {
    values: fields,
  });

  // https://ghiscoding.gitbook.io/slickgrid-react/backend-services/graphql/graphql-filtering#filterby
  const operator = sb.enumType(`${name}_operator`, {
    values: ["Contains", "Not_Contains", "LT", "LE", "GT", "NE", "EQ", "StartsWith", "EndsWith", "IN", "NOT_IN"],
  });

  sb.addScalarType;

  return sb.inputType(`${name}_filter`, {
    fields: (fb) => {
      return {
        field: fb.field({ type: field, required: true }),
        operator: fb.field({ type: operator, required: true }),
        value: fb.field({ type: SLICKGRID_FILTER_VALUE, required: true }),
      };
    },
  });
};

type QueryResult<NodeType extends { [field: string]: unknown }> = { totalCount: number; nodes: NodeType[] };
export const registerQueryResult = <NodeType extends { [field: string]: unknown }>(
  name: string,
  sb: SchemaBuilderType,
) => {
  const node = sb.objectRef<NodeType>(`${name}_query_node`);
  const queryResult = sb.objectRef<QueryResult<NodeType>>(`${name}_query_result`);
  return sb.objectType(queryResult, {
    fields: (fb) => ({
      totalCount: fb.int({
        resolve: (parent) => parent.totalCount,
      }),
      nodes: fb.field({
        type: [node],
        resolve: (parent) => parent.nodes,
      }),
    }),
  });
};
