import { join, resolve } from "https://deno.land/std@0.204.0/path/mod.ts";

async function copyDirContents(src: string, dest: string): Promise<void> {
  for await (const entry of Deno.readDir(src)) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory) {
      await Deno.mkdir(destPath, { recursive: true });
      await copyDirContents(srcPath, destPath);
    } else if (entry.isFile) {
      await Deno.copyFile(srcPath, destPath);
    } else if (entry.isSymlink) {
      const target = await Deno.readLink(srcPath);
      await Deno.symlink(target, destPath);
    }
  }
}

if (import.meta.main) {
  const [srcArg, destArg] = Deno.args;

  if (!srcArg || !destArg) {
    Deno.exit(1);
  }

  try {
    const src = resolve(Deno.cwd(), srcArg);
    const dest = resolve(Deno.cwd(), destArg);

    const srcStat = await Deno.stat(src);
    if (!srcStat.isDirectory) {
      console.error(`エラー: コピー元 "${srcArg}" はディレクトリではありません。`);
      Deno.exit(1);
    }

    await Deno.mkdir(dest, { recursive: true });
    await copyDirContents(src, dest);

    console.log(`コピー完了: '${srcArg}' の内容を '${destArg}' にコピーしました。`);
  } catch (err) {
    console.error("エラー:", (err as Error).message);
    Deno.exit(1);
  }
}
