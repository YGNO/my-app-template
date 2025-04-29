import { resolve } from "jsr:@std/path@1.0.8";
import build from "@hono/vite-build/deno";
import adapter from "@hono/vite-dev-server/node";
import tailwindcss from "@tailwindcss/vite";
import honox from "honox/vite";
import { type Connect, defineConfig, type Plugin as VitePlugin } from "vite";
import { IncomingMessage, ServerResponse } from "node:http";
import gqlDenoJson from "../graphql/deno.jsonc" with { type: "json" };

export default defineConfig(({ mode }) => {
  // Note: ビルド時にバンドルしないライブラリ、document、window を直接使っている等で、そのままでは deno で実行できないものが対象
  const notBundle = ["slickgrid-react", "@slickgrid-universal/common"];

  let alias = {
    "@": resolve("./app"),
    // Note: モノレポの依存関係を vite が解決してくれないので、直接パスを記載
    "@my-app/graphql": resolve("../graphql/mod.ts"),
  };
  if (mode === "production") {
    alias = {
      ...alias,
      // Note: 本番ビルド時に兄弟パッケージの依存関係が解決できなくなるので、直接パスを記載
      //       deno の実行オプションで import_map を複数指定できれば解決できるが、現状できないので力技でなんとかする
      ...gqlDenoJson.imports,
    };
  }

  const ssrExternal = ["react", "react-dom"];
  Object.keys(gqlDenoJson.imports).forEach((module) => {
    // Note: graphql モジュールの依存関係を SSR 対象から外す
    ssrExternal.push(module);
  });

  return {
    cacheDir: "node_modules/.vite",
    resolve: { alias },
    ssr: { external: ssrExternal },
    esbuild: {
      jsx: "automatic",
      jsxImportSource: "react",
    },
    // Note: @deno/vite-plugin を利用すると、特定の npm インストールしたモジュールロードのパフォーマンスが劣化するので利用しない。
    //       この関係上、jsr、http を利用したモジュールのインポートは実施できない、多分。
    plugins: [
      changeDenoRequestToNode(),
      honox({
        devServer: { adapter },
        client: { jsxImportSource: "react", input: ["/app/style.css"] },
      }),
      tailwindcss(),
      build({ external: notBundle, staticRoot: "dist" }),
    ],
  };
});

// Note: Deno ランタイムで Node の rawHeaders が <k,v>形式になってしまうので、文字列配列に変換する用のプラグインを用意する
const changeDenoRequestToNode = () => {
  const plugin: VitePlugin = {
    name: "change-deno-to-node",
    configureServer: async (server) => {
      // deno-lint-ignore require-await
      const createMiddleware = async () => {
        // deno-lint-ignore require-await
        return async (
          req: IncomingMessage,
          _res: ServerResponse,
          next: Connect.NextFunction,
        ) => {
          const rawHeaders = Object.fromEntries(
            // deno-lint-ignore no-explicit-any
            req.rawHeaders as unknown as any,
          );
          const newRawHeaders: string[] = [];
          Object.entries(rawHeaders).forEach(([k, v]) => {
            newRawHeaders.push(k);
            newRawHeaders.push(v);
          });
          Object.defineProperty(req, "rawHeaders", {
            value: newRawHeaders,
            writable: false,
          });
          Object.defineProperty(req, "headers", {
            value: rawHeaders,
            writable: false,
          });
          return next();
        };
      };

      server.middlewares.use(await createMiddleware());
    },
  };
  return plugin;
};
