import { graphqlServer } from "@hono/graphql-server";
import { Hono } from "hono";
import graphqlSchema from "./schemaDefine.ts";

const graphqlApp = new Hono();

const graphiql = Deno.env.get("GRAPHQL_PLAY_GROUND") === "true";

graphqlApp.use(
  "/",
  graphqlServer({
    schema: graphqlSchema,
    graphiql,
  }),
);

export default graphqlApp;
