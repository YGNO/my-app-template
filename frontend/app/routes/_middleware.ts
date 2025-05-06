import { createRoute } from "honox/factory";
import { setAuthClient } from "../middleware/setAuthClient.ts";

export default createRoute(setAuthClient);
