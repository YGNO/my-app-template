import { graphqlServer } from "@hono/graphql-server";
import { Hono } from "hono";
import { buildSchema } from "drizzle-graphql";
import { drizzleClient } from "./drizzle/drizzleClient.ts";

const graphqlApp = new Hono();

const { schema } = buildSchema(drizzleClient);

graphqlApp.use(
  "/",
  graphqlServer({
    schema: schema,
    graphiql: true,
  }),
);

export default graphqlApp;
