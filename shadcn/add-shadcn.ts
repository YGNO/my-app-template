import { join } from "https://deno.land/std@0.224.0/path/mod.ts";

// shadcn のコンポーネントを取得
const args = Deno.args;
const process = new Deno.Command("npx", {
  args: ["shadcn@latest", "add", "-o", ...args],
  stdout: "inherit",
  stderr: "inherit",
}).spawn();

const status = await process.status;

if (!status.success) {
  console.error(`❌ Command failed with code ${status.code}`);
  Deno.exit(status.code);
}

// ファイルパスを修正
// see: https://chatgpt.com/c/68170ef4-8c0c-8000-be4f-9106680f3f8c
const replacePath = async (targetPath: string) => {
  try {
    for await (const entry of Deno.readDir(targetPath)) {
      const path = join(targetPath, entry.name);
      if (entry.isDirectory) {
        await replacePath(path);
        continue;
      }

      if (entry.isFile && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
        const content = await Deno.readTextFile(path);
        const updated = content.replace(/__generated__/g, "..");

        if (content !== updated) {
          await Deno.writeTextFile(path, updated);
          console.log(`🛠  Updated: ${path}`);
        }
      }
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      console.warn("⚠️  '__generated__' directory not found, skipping replacement.");
    } else {
      throw err;
    }
  }
};

const generatedDir = "./__generated__";
await replacePath(generatedDir);
