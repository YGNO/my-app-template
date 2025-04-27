import { graphqlServer } from "@hono/graphql-server";
import { Hono } from "hono";

import SchemaBuilder from "@pothos/core";

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (_parent, { name }) => {
        return `hello, ${name || "World"}`;
      },
    }),
  }),
});

const graphqlApp = new Hono();

graphqlApp.use(
  "/",
  graphqlServer({
    schema: builder.toSchema(),
    graphiql: true,
  }),
);

export default graphqlApp;
