import { dbClient, type dbSchema } from "@my-app/db-client";
import type { FieldRef } from "@pothos/core";
import { buildSchema } from "drizzle-graphql";

const { entities } = buildSchema(dbClient);

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type SchemaType = Partial<PothosSchemaTypes.UserSchemaTypes> | {};
type DefaultSchemaType = PothosSchemaTypes.ExtendDefaultTypes<SchemaType>;
type SchemaBuilderType = PothosSchemaTypes.SchemaBuilder<DefaultSchemaType>;

export const registerObjectType = (builder: SchemaBuilderType) => {
  const types = entities.types;
  const prefecture = builder.addGraphQLObject<typeof dbSchema.prefecture._.inferSelect>(types.PrefectureItem);
  const municipality = builder.addGraphQLObject<typeof dbSchema.municipality._.inferSelect>(types.MunicipalityItem);
  return {
    prefecture,
    municipality,
  };
};

type QueryBuilderType = PothosSchemaTypes.QueryFieldBuilder<DefaultSchemaType, SchemaType>;

export interface GraphqlObject<
  TItem extends PothosSchemaTypes.ObjectRef<DefaultSchemaType, TObject, TObject>,
  TObject,
> {
  queries: (
    objectType: TItem,
    queryBuilder: QueryBuilderType,
  ) => {
    [queryName: string]: FieldRef<DefaultSchemaType, TObject | readonly TObject[] | null | undefined, "Query">;
  };
}
