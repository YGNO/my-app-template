import { reactRenderer } from "@hono/react-renderer";
import { Link, Script } from "honox/server";

export default reactRenderer(({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Script src="/app/client.ts" async />
        <Link rel="stylesheet" href="/app/style.css" />
      </head>
      <body>{children}</body>
    </html>
  );
});
