import {readFile,access} from 'node:fs/promises';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
const html=await readFile('public/index.html','utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
if(new Set(ids).size!==ids.length)throw new Error('Duplicate HTML IDs');
for(const match of html.matchAll(/href="#([^"]+)"/g))if(!ids.includes(match[1]))throw new Error('Missing anchor: '+match[1]);
for(const match of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g))await access(resolve('public',match[1]));
for(const match of html.matchAll(/aria-controls="([^"]+)"/g))if(!ids.includes(match[1]))throw new Error('Missing aria target: '+match[1]);
if(!html.includes('contact@harang.xyz'))throw new Error('Contact address missing');
for(const file of ['public/app.js','public/i18n.js']){
  const checked=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});
  if(checked.status!==0)throw new Error(checked.stderr);
}
const localeSource=await readFile('public/i18n.js','utf8');
const locales=JSON.parse(localeSource.split('window.HarangLocales = ')[1].split(';\n')[0]);
for(const section of ['static','ui','services','scenarios']){
  assert.deepEqual(Object.keys(locales.ko[section]).sort(),Object.keys(locales.en[section]).sort(),'Locale keys differ in '+section);
}
for(const match of html.matchAll(/data-i18n-html="([^"]+)"/g)){
  for(const language of ['ko','en'])assert.equal(typeof locales[language].static[match[1]],'string','Missing translation: '+match[1]);
}
for(const match of html.matchAll(/data-i18n-(?:placeholder|aria-label)="([^"]+)"/g)){
  for(const language of ['ko','en'])assert.equal(typeof locales[language].ui[match[1]],'string','Missing label: '+match[1]);
}
assert(html.indexOf('src="./i18n.js"')<html.indexOf('src="./app.js"'),'Language script must load first');
assert(html.includes('data-language="ko"')&&html.includes('data-language="en"'),'Language buttons missing');
console.log('PASS: JavaScript syntax, assets, links, ARIA references, contact address, bilingual catalog completeness, and language script order.');

