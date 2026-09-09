export const OFFER_STATES = Object.freeze(['DRAFT','SUPPLIER_REVIEW','APPROVED','LIVE','PAUSED']);
export const BOOKING_STATES = Object.freeze(['DRAFT','REQUESTED','AWAITING_SUPPLIER','CONFIRMED','DECLINED','CANCELLED']);
export const AVAILABILITY_METHODS = Object.freeze(['MANUAL','EMAIL','WHATSAPP','API']);
export const TRANSITIONS = Object.freeze({ DRAFT:['REQUESTED'], REQUESTED:['AWAITING_SUPPLIER','CANCELLED'],
  AWAITING_SUPPLIER:['CONFIRMED','DECLINED','CANCELLED'], CONFIRMED:['CANCELLED'], DECLINED:[], CANCELLED:[] });
export function canTransition(from,to){ return TRANSITIONS[from]?.includes(to) ?? false; }
export function rentalDays(pickup,dropoff){ const start=Date.parse(`${pickup}T00:00:00Z`),end=Date.parse(`${dropoff}T00:00:00Z`);
  if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start) throw new Error('Return date must be after pickup date.'); return Math.ceil((end-start)/86400000); }
export function quoteCents(rate,pickup,dropoff){ return rate*rentalDays(pickup,dropoff); }
function randomHex(size){ const bytes=crypto.getRandomValues(new Uint8Array(size)); return [...bytes].map(x=>x.toString(16).padStart(2,'0')).join(''); }
export function publicReference(){ return `TOETI-ZNZ-${randomHex(4).toUpperCase()}`; }
export function secureToken(){ const bytes=crypto.getRandomValues(new Uint8Array(32)); return btoa(String.fromCharCode(...bytes)).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,''); }
export class AvailabilityAdapter { constructor(method){this.method=method} checkAvailability(){return{status:'AWAITING_SUPPLIER',method:this.method}}
  reserve(){return{status:'NOT_YET_VERIFIED'}} confirmBooking(){return{status:'REQUIRES_SUPPLIER_DECISION'}} cancelBooking(){return{status:'REQUIRES_REVIEW'}} }
export class PaymentRouter { constructor(providers=[]){this.providers=providers} select(context){const p=this.providers.find(x=>x.supports(context));
  return p?{status:'SELECTED',provider:p.id}:{status:'UNAVAILABLE',reason:'No eligible payment provider configured.'};} }
