import { createRoute } from "honox/factory";
import PrefectureGrid from "./$prefectureGrid.tsx";

export default createRoute((c) => {
  return c.render(
    <div className="h-full w-full">
      <title>都道府県情報</title>
      <PrefectureGrid />
    </div>,
  );
});
