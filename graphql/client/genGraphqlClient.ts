import { generate } from "npm:@genql/cli";
import { graphqlSchemaString } from "@my-app/graphql-server";
import * as path from "@std/path";

generate({
  schema: graphqlSchemaString,
  output: path.join(Deno.cwd(), "__generated__"),
  scalarTypes: {
    MongoID: "string",
  },
}).catch(console.error);
