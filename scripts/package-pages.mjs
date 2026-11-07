import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";

const output = new URL("../_site/", import.meta.url);
await rm(output, { recursive: true, force: true });
await cp(new URL("../public/", import.meta.url), output, { recursive: true });
await cp(new URL("../dist/client/", import.meta.url), output, {
  recursive: true,
});

// GitHub Pages serves directory indexes for the extensionless navigation URLs.
for (const file of await readdir(output)) {
  if (!file.endsWith(".html") || file === "index.html" || file === "404.html")
    continue;
  const directory = new URL(`${file.slice(0, -5)}/`, output);
  await mkdir(directory, { recursive: true });
  await cp(new URL(file, output), new URL("index.html", directory));
}
await writeFile(new URL(".nojekyll", output), "");
