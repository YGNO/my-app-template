import { graphqlServer } from "@hono/graphql-server";
import { Hono } from "hono";
import graphqlSchema from "./schemaDefine.ts";

const graphqlApp = new Hono();

graphqlApp.use(
  "/",
  graphqlServer({
    schema: graphqlSchema,
    graphiql: true,
  }),
);

export default graphqlApp;
