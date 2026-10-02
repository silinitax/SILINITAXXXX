// Bundles src/ into one self-contained HTML file (no server needed): node build.mjs
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const src = f => readFileSync(resolve(root, 'src', f));
const b64 = (f, mime) => `data:${mime};base64,${src('assets/' + f).toString('base64')}`;

const WHATSAPP = '390350402086';
const wa = text => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

const { outputFiles } = await build({ entryPoints: [resolve(root, 'src/main.js')], bundle: true, minify: true, format: 'iife', write: false, target: 'es2020' });
const js = outputFiles[0].text.replace(/<\/script/gi, '<\\/script');

const salvo = b64('salvo-ok.webp', 'image/webp');
const phone = src('phone.html').toString().split('{{salvo}}').join(salvo);
const lock = src('lock.html').toString();
let html = src('index.html').toString().split('{{phone}}').join(phone).split('{{lock}}').join(lock);

// Icons: every <use href="#i-…"> in the page becomes one symbol, so only used glyphs ship.
// i-logo-* comes from Iconify Logos (recoloured to currentColor), everything else from Solar.
const solar = require('@iconify-json/solar/icons.json'), logos = require('@iconify-json/logos/icons.json');
const used = [...new Set([...html.matchAll(/href="#i-([a-z0-9-]+)"/g)].map(m => m[1]))];
const symbols = used.map(name => {
  const logo = name.startsWith('logo-');
  const set = logo ? logos : solar, key = logo ? name.slice(5) + '-monochrome-icon' : name;
  const icon = set.icons[key];
  if (!icon) throw new Error('Icona mancante: ' + name);
  const body = logo ? icon.body.replace(/fill="#[0-9a-f]{3,6}"/gi, 'fill="currentColor"') : icon.body;
  return `<symbol id="i-${name}" viewBox="0 0 ${icon.width || set.width || 24} ${icon.height || set.height || 24}">${body}</symbol>`;
}).join('');
const appIcons = src('assets/app-icons.svg').toString().replace(/<\/?svg[^>]*>/g, '');
const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${symbols}${appIcons}</svg>`;

const css = (src('style.css').toString() + '\n' + src('phone.css').toString()).replace('{{font}}', b64('geist-latin.woff2', 'font/woff2'));
const favicon = 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#0071e3"/><path d="M12 46 25 18l11 22 9-16 8 22" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>').toString('base64');

html = html.replace(/\{\{wa:(\w+)\}\}/g, (_, plan) => wa(`Ciao, vorrei informazioni sul piano ${plan} di SiliniTax.`));
const fill = { '{{wa}}': wa('Ciao, vorrei informazioni su SiliniTax.'), '{{css}}': css, '{{favicon}}': favicon, '{{sprite}}': sprite, '{{salvo}}': salvo, '{{js}}': js };
for (const [k, v] of Object.entries(fill)) html = html.split(k).join(v);
const left = html.match(/\{\{[a-z:]+\}\}/i);
if (left) throw new Error('Segnaposto non sostituito: ' + left[0]);

mkdirSync(resolve(root, 'dist'), { recursive: true });
writeFileSync(resolve(root, 'dist/index.html'), html);
writeFileSync(resolve(root, '../SITO-NUOVO.html'), html);
console.log('SITO-NUOVO.html', (html.length / 1024).toFixed(0) + ' KB,', used.length, 'icone');
