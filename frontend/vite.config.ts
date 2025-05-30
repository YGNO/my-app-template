import { resolve } from "jsr:@std/path@1.0.8";
import build from "@hono/vite-build/deno";
import adapter from "@hono/vite-dev-server/node";
import tailwindcss from "@tailwindcss/vite";
import honox from "honox/vite";
import { defineConfig } from "vite";
import dbClientDenoJson from "../dbClient/deno.jsonc" with { type: "json" };
import gqlDenoJson from "../graphql/server/deno.jsonc" with { type: "json" };

export default defineConfig(({ mode }) => {
  // Note: ビルド時にバンドルしないライブラリ、document、window を直接使っている等で、そのままでは deno で実行できないものが対象
  const notBundle = ["slickgrid-react", "@slickgrid-universal/graphql", "@slickgrid-universal/common"];

  let alias = {
    "@": resolve("./app"),
    // Note: モノレポの依存関係を vite が解決してくれないので、直接パスを記載
    "@my-app/shadcn": resolve("../shadcn/mod.ts"),
    "@my-app/db-client": resolve("../dbClient/src/dbClient.ts"),
    "@my-app/graphql-server/graphqlSchema": resolve("../graphql/server/graphqlMod.ts"),
    "@my-app/graphql-server/zodSchema": resolve("../graphql/server/zodMod.ts"),
    "@my-app/graphql-client": resolve("../graphql/client/__generated__/index.ts"),
  };
  if (mode === "production") {
    alias = {
      ...alias,
      // Note: 本番ビルド時に兄弟パッケージの依存関係が解決できなくなるので、直接パスを記載
      //       deno の実行オプションで import_map を複数指定できれば解決できるが、現状できないので力技でなんとかする
      ...gqlDenoJson.imports,
      ...dbClientDenoJson.imports,
    };
  }

  const ssrExternal = ["react", "react-dom", "@supabase/ssr"];
  // Note: graphql、dbClient モジュールの依存関係を SSR 対象から外す
  const moduleList = Object.keys({
    ...gqlDenoJson.imports,
    ...dbClientDenoJson.imports,
  });
  for (const module of moduleList) {
    ssrExternal.push(module);
  }

  return {
    cacheDir: "node_modules/.vite",
    resolve: { alias },
    ssr: { external: ssrExternal, noExternal: ["@my-app/shadcn-ui"] },
    esbuild: {
      jsx: "automatic",
      jsxImportSource: "react",
    },
    // Note: @deno/vite-plugin を利用すると、特定の npm インストールしたモジュールロードのパフォーマンスが劣化するので利用しない。
    //       この関係上、jsr、http を利用したモジュールのインポートは実施できない、多分。
    plugins: [
      honox({
        devServer: { adapter },
        client: { jsxImportSource: "react", input: ["/app/style.css"] },
      }),
      tailwindcss(),
      build({ external: notBundle, staticRoot: "dist" }),
    ],
  };
});
