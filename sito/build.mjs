// Bundles src/ into a single self-contained HTML file (no server needed): node build.mjs
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const src = f => readFileSync(resolve(root, 'src', f));
const b64 = (f, mime) => `data:${mime};base64,${src('assets/' + f).toString('base64')}`;

const { outputFiles } = await build({ entryPoints: [resolve(root, 'src/main.js')], bundle: true, minify: true, format: 'iife', write: false, target: 'es2020' });
const js = outputFiles[0].text.replace(/<\/script/gi, '<\\/script');

const salvo = b64('salvo-ok.webp', 'image/webp');
const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${src('assets/app-icons.svg').toString().replace(/<\/?svg[^>]*>/g, '')}</svg>`;
const phone = src('phone.html').toString().split('{{salvo}}').join(salvo);
const css = src('style.css').toString().replace('{{font}}', b64('geist-latin.woff2', 'font/woff2'));
const favicon = 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#0071e3"/><path d="M12 46 25 18l11 22 9-16 8 22" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>').toString('base64');

let html = src('index.html').toString();
const fill = { '{{css}}': css, '{{favicon}}': favicon, '{{sprite}}': sprite, '{{phone}}': phone, '{{salvo}}': salvo, '{{js}}': js };
for (const [k, v] of Object.entries(fill)) html = html.split(k).join(v);
mkdirSync(resolve(root, 'dist'), { recursive: true });
writeFileSync(resolve(root, 'dist/index.html'), html);
writeFileSync(resolve(root, '../SITO-NUOVO.html'), html);
console.log('SITO-NUOVO.html', (html.length / 1024).toFixed(0) + ' KB');
