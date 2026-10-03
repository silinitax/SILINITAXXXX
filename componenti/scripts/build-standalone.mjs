// Builds the three self-contained preview pages (open with a double click, no server needed)
// from dist/. Run after `pnpm build`: node scripts/build-standalone.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const out = resolve(dist, '../..');
const read = f => readFileSync(resolve(dist, f));
const b64 = (f, mime) => `data:${mime};base64,${read(f).toString('base64')}`;

const fluid = read('fluid.css').toString();
const legacy = read('legacy.css').toString().replace("url('/geist-latin.woff2')", `url('${b64('geist-latin.woff2', 'font/woff2')}')`);
const style = read('style.css').toString().replace(/@import url\(['"]?\/legacy\.css['"]?\);?/, '');
const sprite = read('app-icons.svg').toString().replace(/<\?xml[^>]*>/, '');
const salvo = b64('salvo-ok.webp', 'image/webp');
const favicon = b64('favicon.svg', 'image/svg+xml');

let js = read('app.js').toString()
  .replace(/\/app-(home|tasse|fatture|scadenze)\.webp/g, (m, n) => b64(`app-${n}.webp`, 'image/webp'))
  .split('/salvo-ok.webp').join(salvo)
  .split('/app-icons.svg#').join('#')
  .split('"/chi-siamo/"').join('"./chi-siamo.html"').split('"/prezzi/"').join('"./prezzi.html"')
  .split('"/#funzioni"').join('"./APRI-SITO.html#funzioni"').split('"/"').join('"./APRI-SITO.html"');
js = js.replace(/<\/script/gi, '<\\/script');

const pages = [['index.html', 'home', 'APRI-SITO.html'], ['chi-siamo/index.html', 'about', 'chi-siamo.html'], ['prezzi/index.html', 'pricing', 'prezzi.html']];
for (const [src, page, name] of pages) {
  const html = read(src).toString();
  const title = html.match(/<title>[^<]*<\/title>/)[0], desc = html.match(/<meta name="description"[^>]*>/)[0];
  const css = legacy + style + (page === 'home' ? fluid : '');
  writeFileSync(resolve(out, name), `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="${page === 'home' ? '#f1f1f1' : '#0B1F45'}"><meta name="robots" content="noindex,nofollow">${desc}${title}<link rel="icon" href="${favicon}" type="image/svg+xml"><style>${css}</style></head><body data-page="${page}"><svg width="0" height="0" style="position:absolute" aria-hidden="true">${sprite.replace(/<\/?svg[^>]*>/g, '')}</svg><a class="skip" href="#main">Vai al contenuto</a><div id="app"></div><script>${js}</script></body></html>`);
  console.log(name, (readFileSync(resolve(out, name)).length / 1024).toFixed(0) + ' KB');
}
