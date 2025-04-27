import { resolve } from "jsr:@std/path@1.0.8";
import build from "@hono/vite-build/deno";
import adapter from "@hono/vite-dev-server/node";
import tailwindcss from "@tailwindcss/vite";
import honox from "honox/vite";
import { type Connect, defineConfig, type Plugin as VitePlugin } from "vite";
import { IncomingMessage, ServerResponse } from "node:http";

// Note: @deno/vite-plugin を利用すると、特定の npm インストールしたモジュールロードのパフォーマンスが劣化するので利用しない。
//       なので、jsr、http を利用したモジュールのインポートは行わない。
// Note: モジュールの依存関係解決は分散させたくないので、package.json で一元管理する。
// FIXME: package.json で管理している場合、ソースコード上で import する場合のモジュールのサジェストが効かないのでなんとかしたい。
export default defineConfig(({ mode }) => {
  const config = {
    cacheDir: "node_modules/.vite",
    resolve: {
      alias: {
        "@": resolve("./app"),
        // Note: モノレポのパッケージを vite が認識しないので、直接パスを解決する
        "@my-app/graphql": resolve("../graphql/mod.ts"),
      },
    },
  };

  if (mode === "development") {
    return {
      ...config,
      ssr: {
        external: [
          "react",
          "react-dom",
          "@hono/graphql-server",
        ],
      },
      esbuild: {
        jsx: "automatic",
        jsxImportSource: "react",
      },
      plugins: [
        changeDenoRequestToNode(),
        honox({
          devServer: { adapter },
          client: { jsxImportSource: "react", input: ["/app/style.css"] },
        }),
        tailwindcss(),
        build(),
      ],
    };
  }
  throw new Error("本番環境用の設定は後で考える");
});

// Deno ランタイムで Node の rawHeaders が <k,v>形式になってしまうので、
// 文字列配列に変換する用のプラグイン
const changeDenoRequestToNode = () => {
  const plugin: VitePlugin = {
    name: "deno-server",
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
