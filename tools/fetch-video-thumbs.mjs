#!/usr/bin/env node
/**
 * tools/fetch-video-thumbs.mjs
 *
 * Downloads a thumbnail for each YouTube video the site embeds into
 * public/video-thumbs/<youtubeId>.jpg, so click-to-load videos
 * (src/components/ClickToLoadVideo.astro) show a self-hosted image and nothing
 * is fetched from YouTube (i.ytimg.com) until the visitor clicks play.
 * Re-run after adding or changing a video; a missing thumbnail falls back to a
 * plain dark poster, never to YouTube.
 *
 *   node tools/fetch-video-thumbs.mjs             # ids embedded in src/pages, only missing
 *   node tools/fetch-video-thumbs.mjs --force     # re-download all
 *   node tools/fetch-video-thumbs.mjs <id> <id>   # specific ids
 */
import { mkdir, writeFile, access, readdir, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'video-thumbs');
const FORCE = process.argv.includes('--force');
let ids = process.argv.slice(2).filter((a) => /^[\w-]{11}$/.test(a));

if (!ids.length) {
  // Collect videoId="…" from every <ClickToLoadVideo> in src/pages.
  const found = new Set();
  const walk = async (dir) => {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) await walk(p);
      else if (p.endsWith('.astro')) {
        for (const m of (await readFile(p, 'utf8')).matchAll(/videoId=["']([\w-]{11})["']/g)) found.add(m[1]);
      }
    }
  };
  await walk(join(ROOT, 'src', 'pages'));
  ids = [...found];
}

await mkdir(OUT, { recursive: true });
// oardefault = original aspect ratio (right for portrait Shorts); then the
// standard landscape sizes.
const VARIANTS = ['oardefault', 'maxresdefault', 'hqdefault'];

for (const id of ids) {
  const file = join(OUT, `${id}.jpg`);
  if (!FORCE) {
    try { await access(file); console.log(`skip  ${id} (exists)`); continue; } catch { /* fetch it */ }
  }
  let saved = false;
  for (const v of VARIANTS) {
    const r = await fetch(`https://i.ytimg.com/vi/${id}/${v}.jpg`);
    if (!r.ok) continue;
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 2000) continue; // YouTube's grey "no thumbnail" placeholder
    await writeFile(file, buf);
    console.log(`saved ${id} (${v}, ${Math.round(buf.length / 1024)}KB)`);
    saved = true;
    break;
  }
  if (!saved) console.log(`MISSING ${id}: no thumbnail available`);
}
