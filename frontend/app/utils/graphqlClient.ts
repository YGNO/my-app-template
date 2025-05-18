import { createClient } from "@my-app/graphql-client";

export const GRAPHQL_ENTRY_URL = "/gql";

export const genqlClient = createClient({ url: GRAPHQL_ENTRY_URL });
