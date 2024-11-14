// deno-lint-ignore-file no-unused-vars
import { dirname, fromFileUrl, join } from "@std/path";
import { walk } from "jsr:@std/fs@1.0.0";

const version = Deno.args[0];

const __dirname = dirname(fromFileUrl(import.meta.url));

const engDir = dirname(__dirname);
const rootDir = dirname(engDir);
const libDir = join(rootDir, "rex");

async function isFile(path: string): Promise<boolean> {
    try {
        return (await Deno.stat(path)).isFile;
    } catch {
        return false;
    }
}

for await (const entry of walk(libDir, { includeDirs: false, maxDepth: 2 })) {
    if (entry.isFile && entry.name === "deno.json") {
        const data = JSON.parse(await Deno.readTextFile(entry.path));
        data.version = version;
        await Deno.writeTextFile(entry.path, JSON.stringify(data, null, 4));
    }
}
