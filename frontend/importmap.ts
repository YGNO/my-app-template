import { parse } from "npm:jsonc-parser";

const load = async (path: string) => {
  const jsonText = await Deno.readTextFile(path);
  return parse(jsonText);
};

const dbClientDenoJson = await load("../dbClient/deno.jsonc");
const rootDenoJson = await load("../deno.jsonc");
const gqlDenoJson = await load("../graphql/server/deno.jsonc");
const frontDenoJson = await load("./deno.jsonc");

// dist 配下に import_map を生成
const importMat = {
  imports: {
    ...rootDenoJson.imports,
    ...gqlDenoJson.imports,
    ...dbClientDenoJson.imports,
    ...frontDenoJson.imports,
  },
};
const jsonString = JSON.stringify(importMat, null, 2);
await Deno.mkdir("./dist", { recursive: true });
await Deno.writeTextFile("./dist/deno.json", jsonString);
