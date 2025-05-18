import type { AnyGqlDomainBuilder } from "./gqlDomain.ts";

export const loadGqlDomain = () => {
  const builderMap = import.meta.glob("../schemas/**/*.schema.ts", {
    import: "default",
    eager: true,
  });
  return Object.values(builderMap) as AnyGqlDomainBuilder[];
};
