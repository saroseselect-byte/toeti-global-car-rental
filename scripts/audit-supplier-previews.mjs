/** Read-only external TOETI supplier preview smoke audit. No publishing, no customer submissions. */
import { writeFileSync } from 'node:fs';
const base='https://toeti-global-car-rental.sarose.workers.dev';
const suffix='.sarose.workers.dev';
const specs=[
 ['Yacout Marrakech','45ae8e52-toeti-global-car-rental', '/supplier/yacout-marrakech-review'],
 ['Manolya Istanbul','work-manolya-light-unique-proof-toeti-global-car-rental','/supplier/manolya-istanbul'],
 ['Golden Way Samoa','build-golden-way-samoa-review-toeti-global-car-rental','/supplier/golden-way-samoa'],
 ['AF Madeira','build-af-madeira-rental-review-toeti-global-car-rental','/supplier/af-madeira-rental'],
 ['MZ Agency','build-mz-agency-essaouira-review-toeti-global-car-rental','/supplier/mz-agency-essaouira'],
 ['Premiant Prague','build-premiant-prague-premium-review-toeti-global-car-rental','/supplier/premiant-prague'],
 ['DG Travel','build-dg-travel-madeira-review-toeti-global-car-rental','/'],
 ['Chegaga Travel','build-chegaga-travel-morocco-review-toeti-global-car-rental','/supplier/chegaga-travel'],
 ['Marrakech Tour Operator','build-marrakech-tour-operator-review-toeti-global-car-rental','/supplier/marrakech-tour-operator'],
 ['Eurocars Crete','build-eurocars-crete-review-toeti-global-car-rental','/'],
 ['Lombok Rentals','build-lombok-rentals-indonesia-review-toeti-global-car-rental','/'],
 ['RF Azores','build-rf-azores-review-toeti-global-car-rental','/supplier/rf-rent-a-car-azores'],
 ['WST Mauritius','build-wst-mauritius-review-toeti-global-car-rental','/'],
 ['Zanzibar Rentals','build-zanzibar-rentals-review-toeti-global-car-rental','/'],
 ['OceanEye Azores','build-oceaneye-azores-review-toeti-global-car-rental','/'],
 ['Vela Mayorca','build-vela-mayorca-review-toeti-global-car-rental','/'],
 ['PragueWay Prague','build-pragueway-premium-review-toeti-global-car-rental','/'],
 ['Porto Walkers','build-porto-walkers-review-toeti-global-car-rental','/'],
 ['NCH Fiji','build-nch-fiji-review-toeti-global-car-rental','/'],
 ['Cape Car Tours','build-cape-car-tours-western-cape-review-toeti-global-car-rental','/'],
 ['Agadir Visite','build-agadir-visite-premium-review-toeti-global-car-rental','/']
];
const timeout=8500;
async function get(url){try {const response=await fetch(url,{signal:AbortSignal.timeout(timeout)});const html=await response.text();return {http:response.status,html};}catch(e){return {http:0,html:'',error:String(e).slice(0,160)};}}
const results=[];
for (const [name,host,path] of specs){const url=`https://${host}${suffix}${path}`;const r=await get(url);const html=r.html;const actions=[...html.matchAll(/<form\b[^>]*>|<a\b[^>]*href=["']([^"']+)["'][^>]*>[^<]{0,130}/gi)].map(x=>x[0]);const bookingActions=actions.filter(x=>/book|request|reserve|reserv|ask availability|demande|aanvraag|enquir|availability|beschik/i.test(x));const imgUrls=[...html.matchAll(/<img\b[^>]*src=["']([^"']+)/gi)].map(m=>m[1]);const images=[];for(const src of imgUrls.slice(0,8)){if(!src.startsWith('http'))continue;try{const x=await fetch(src,{method:'GET',signal:AbortSignal.timeout(4800)});if(x.status>=400)images.push({src,http:x.status});await x.body?.cancel();}catch(e){images.push({src,error:String(e).slice(0,80)});}}
const formCount=(html.match(/<form\b/gi)||[]).length;const inputCount=(html.match(/<(?:input|textarea|select)\b/gi)||[]).length;const mailtoOnly=bookingActions.length>0&&bookingActions.every(x=>/mailto:/i.test(x));results.push({name,url,http:r.http,htmlBytes:html.length,forms:formCount,inputs:inputCount,bookingActions:bookingActions.length,mailtoOnly,imageCount:imgUrls.length,imagesFailed:images,robotsHeader:'not checked',blocking:['http != 200', 'no functional form'].filter((v,i)=>i===0?r.http!==200:inputCount===0),...r.error?{error:r.error}:{}});console.log(`${name.padEnd(27)} HTTP ${r.http} form=${formCount} fields=${inputCount} CTA=${bookingActions.length} imgErrors=${images.length}`);}
const output={date:new Date().toISOString(),scope:'Existing review URLs only. No supplier approvals, payments, email deliveries or full customer booking flow verified.',results};writeFileSync('supplier-preview-audit.json',JSON.stringify(output,null,2));console.log(`AUDIT ${results.length} suppliers; accessible=${results.filter(x=>x.http===200).length}; actual form fields=${results.filter(x=>x.inputs>0).length}; failures=${results.filter(x=>x.blocking.length||x.imagesFailed.length).length}`);
