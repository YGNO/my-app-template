import { resolve } from "jsr:@std/path@1.0.8";
import { defineConfig } from "vite";

// Note: serverモジュールの gqlDomain が vite の import.meta.glob に依存しているため、
//       一旦 vite でビルドしてから genQL のモジュールを作成する
export default defineConfig({
  resolve: {
    alias: {
      "@my-app/graphql-server/graphqlSchema": resolve("../server/graphqlMod.ts"),
      "@my-app/db-client": resolve("../../dbClient/src/dbClient.ts"),
    },
  },

  build: {
    lib: {
      entry: resolve("./genGraphqlClient.ts"),
      formats: ["es"],
      fileName: "script",
    },
    outDir: "dist",
    rollupOptions: {
      external: ["pg", "@std/path", "npm:@genql/cli"],
    },
  },
});
