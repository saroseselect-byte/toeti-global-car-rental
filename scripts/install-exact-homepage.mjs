// TOETI exact homepage integration - private staging only.
// This script is intentionally opt-in and requires the original HTML file locally.
// Usage: node scripts/install-exact-homepage.mjs /absolute/path/to/original.html
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(), input=process.argv[2];
if(!input||!fs.existsSync(input))throw Error('Pass the original TOETI HTML file path.');
const entry=path.join(root,'src/entry.js'), config=path.join(root,'wrangler.jsonc');
if(!fs.existsSync(entry)||!fs.existsSync(config))throw Error('Run from existing TOETI repo root.');
const original=fs.readFileSync(input);
if(!original.toString('utf8',0,200).toLowerCase().includes('<!doctype html>'))throw Error('Original HTML invalid.');
const marker=" if(request.method==='GET'&&url.pathname==='/robots.txt')";
let router=fs.readFileSync(entry,'utf8');
if(!router.includes('TOETI EXACT HOME ROUTE')){
 if(!router.includes(marker))throw Error('Router anchor missing: refusing modification.');
 const route=` // TOETI EXACT HOME ROUTE: preserve other Worker routes.\n if(request.method==='GET'&&url.pathname==='/'){\n  if(!env.ASSETS)return new Response('Homepage assets not configured',{status:503});\n  const asset=await env.ASSETS.fetch(new Request(new URL('/toeti-home.html',url),request));\n  const headers=new Headers(asset.headers);headers.set('cache-control','no-store');headers.set('x-robots-tag','noindex, nofollow');\n  return new Response(asset.body,{status:asset.status,headers});\n }\n`;
 router=router.replace(marker,route+marker);
}
let cfg=fs.readFileSync(config,'utf8');
if(!cfg.includes('"assets"')){
 const anchor='  "preview_urls": true,';
 if(!cfg.includes(anchor))throw Error('Wrangler anchor missing: refusing modification.');
 cfg=cfg.replace(anchor,anchor+'\n  "assets": { "directory": "./public", "binding": "ASSETS", "run_worker_first": true },');
}
fs.mkdirSync(path.join(root,'public'),{recursive:true});
fs.writeFileSync(path.join(root,'public/toeti-home.html'),original);
fs.writeFileSync(entry,router);
fs.writeFileSync(config,cfg);
console.log('Exact homepage installed locally. No deploy, merge, or production change.');
