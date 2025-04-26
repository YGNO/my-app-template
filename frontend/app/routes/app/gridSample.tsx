import { createRoute } from "honox/factory";
import GridSample from "../../islands/gridSample.tsx";

export default createRoute((c) => {
  const name = c.req.query("name") ?? "Hono";
  return c.render(
    <div className="py-8">
      <title>{name}</title>
      <GridSample />
    </div>,
  );
});
