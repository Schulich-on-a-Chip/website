import { cp, mkdir, rm, writeFile } from 'node:fs/promises';

const output = new URL('../_site/', import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(new URL('../site/', import.meta.url), output, {
    recursive: true,
    filter: (source) => !source.endsWith('/.DS_Store'),
});
for (const file of ['sock.js', 'sock.js.map', 'emulator-demo.js', 'emulator-demo.js.map']) {
    await cp(new URL(`../.pages-build/${file}`, import.meta.url), new URL(file, output));
}
await cp(new URL('../CNAME', import.meta.url), new URL('CNAME', output));
await writeFile(new URL('.nojekyll', output), '');
