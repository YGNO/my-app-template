import { graphqlServer, type RootResolver } from "@hono/graphql-server";
import { buildSchema } from "graphql";
import { Hono } from "hono";

const graphqlApp = new Hono();

const schema = buildSchema(`
type Query {
    hello: String
}
`);

const rootResolver: RootResolver = (_c) => {
  return {
    hello: () => "Hello Hono!",
  };
};

graphqlApp.use(
  "/",
  graphqlServer({
    schema,
    rootResolver,
    graphiql: true,
  }),
);

export default graphqlApp;
