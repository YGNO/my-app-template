import type { FieldRef } from "@pothos/core";

/** Note:  Pothosで定義されている型を扱いやすい形式で再定義する */

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type GqlSchemaType = Partial<PothosSchemaTypes.UserSchemaTypes> | {};
type WrappedGqlSchemaType = PothosSchemaTypes.ExtendDefaultTypes<GqlSchemaType>;
export type GqlQuery<T> = FieldRef<WrappedGqlSchemaType, T, "Query">;
export type GqlObject<T> = PothosSchemaTypes.ObjectRef<WrappedGqlSchemaType, T, T>;

export type SchemaBuilder = PothosSchemaTypes.SchemaBuilder<WrappedGqlSchemaType>;
export type QueryFieldBuilder = PothosSchemaTypes.QueryFieldBuilder<WrappedGqlSchemaType, GqlSchemaType>;
export type ObjectFieldBuilder<T> = PothosSchemaTypes.ObjectFieldBuilder<WrappedGqlSchemaType, T>;
