// TOETI premium rental demo: presentation-only, never creates bookings or payments.
// Integrate into existing routes only after reviewing current NCH Fiji assets and booking contract.
export const DEMO_VEHICLES = Object.freeze([
  {id:'demo-corolla',name:'Toyota Corolla',dailyFjd:85,seats:5},
  {id:'demo-demio',name:'Mazda Demio',dailyFjd:59,seats:5},
  {id:'demo-xtrail',name:'Nissan X-Trail',dailyFjd:119,seats:5},
  {id:'demo-voxy',name:'Toyota Voxy',dailyFjd:145,seats:7}
]);
export function rentalDemoQuote({vehicleId,days=7}={}) {
  const car=DEMO_VEHICLES.find(x=>x.id===vehicleId);
  if(!car || !Number.isInteger(days) || days<1 || days>180) throw new RangeError('Invalid demo selection');
  return {vehicle:car.name,days,currency:'FJD',subtotal:car.dailyFjd*days,isDemo:true,availabilityVerified:false,canBook:false};
}
export function escapeDemoHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export function renderFijiRentalDemo(){
  const cards=DEMO_VEHICLES.map(v=>'<option value="'+v.id+'">'+escapeDemoHtml(v.name)+'</option>').join('');
  return `<section id="toeti-fiji-demo" aria-label="Fiji rental demo" style="background:#11192c;color:white;padding:24px;border-radius:24px;max-width:720px;margin:auto;font-family:system-ui"><small>TOETI GLOBAL · FIJI · DEMONSTRATION ONLY</small><h2>Discover Fiji. Drive freely.</h2><p>Illustrative vehicles and rates only. No availability or booking is confirmed.</p><label for="fiji-demo-car">Choose car</label><select id="fiji-demo-car">${cards}</select><label for="fiji-demo-days">Rental days</label><input id="fiji-demo-days" type="number" min="1" max="180" value="7"><p id="fiji-demo-total" role="status"></p><p>Request-to-book is disabled in this demo. No payment or supplier contact.</p></section><script>(function(){const root=document.getElementById('toeti-fiji-demo'),s=root.querySelector('select'),d=root.querySelector('input'),out=root.querySelector('[role=status]');const rates=${JSON.stringify(Object.fromEntries(DEMO_VEHICLES.map(v=>[v.id,v.dailyFjd])))};function update(){const n=Number(d.value);out.textContent=Number.isInteger(n)&&n>=1&&n<=180?'Illustrative subtotal: FJD '+(rates[s.value]*n).toLocaleString('en-US'):'Choose 1–180 days';}s.addEventListener('change',update);d.addEventListener('input',update);update();})();</script>`;
}
