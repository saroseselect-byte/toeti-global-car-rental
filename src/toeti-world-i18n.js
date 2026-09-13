// TOETI Worldwide language engine — shared by P1 Cars and P2 Experiences.
// Explicit ?lang= / cookie choice wins; then browser language; English is the safe fallback.
export const LANGUAGES={
 en:{name:'English',dir:'ltr'},nl:{name:'Nederlands',dir:'ltr'},de:{name:'Deutsch',dir:'ltr'},fr:{name:'Français',dir:'ltr'},es:{name:'Español',dir:'ltr'},pt:{name:'Português',dir:'ltr'},it:{name:'Italiano',dir:'ltr'},tr:{name:'Türkçe',dir:'ltr'},ar:{name:'العربية',dir:'rtl'},zh:{name:'中文',dir:'ltr'},ja:{name:'日本語',dir:'ltr'},ko:{name:'한국어',dir:'ltr'},id:{name:'Bahasa Indonesia',dir:'ltr'},th:{name:'ไทย',dir:'ltr'},hi:{name:'हिन्दी',dir:'ltr'},sw:{name:'Kiswahili',dir:'ltr'},el:{name:'Ελληνικά',dir:'ltr'},cs:{name:'Čeština',dir:'ltr'}
};
const A={
 en:['Explore the world','Welcome to','Explore destinations','Local partner','Request to book','All destinations','Real places. Local partners. Authentic experiences.'],
 nl:['Ontdek de wereld','Welkom in','Ontdek bestemmingen','Lokale partner','Boeking aanvragen','Alle bestemmingen','Echte plekken. Lokale partners. Authentieke ervaringen.'],
 de:['Entdecke die Welt','Willkommen in','Reiseziele entdecken','Lokaler Partner','Buchung anfragen','Alle Reiseziele','Echte Orte. Lokale Partner. Authentische Erlebnisse.'],
 fr:['Explorez le monde','Bienvenue à','Explorer les destinations','Partenaire local','Demander une réservation','Toutes les destinations','Des lieux authentiques. Des partenaires locaux. Des expériences authentiques.'],
 es:['Explora el mundo','Bienvenido a','Explorar destinos','Socio local','Solicitar reserva','Todos los destinos','Lugares reales. Socios locales. Experiencias auténticas.'],
 pt:['Explore o mundo','Bem-vindo a','Explorar destinos','Parceiro local','Pedir reserva','Todos os destinos','Lugares reais. Parceiros locais. Experiências autênticas.'],
 it:['Esplora il mondo','Benvenuto a','Esplora le destinazioni','Partner locale','Richiedi prenotazione','Tutte le destinazioni','Luoghi autentici. Partner locali. Esperienze autentiche.'],
 tr:['Dünyayı keşfet','Hoş geldiniz','Destinasyonları keşfet','Yerel iş ortağı','Rezervasyon talebi','Tüm destinasyonlar','Gerçek yerler. Yerel ortaklar. Özgün deneyimler.'],
 ar:['اكتشف العالم','مرحباً بك في','استكشف الوجهات','شريك محلي','طلب حجز','جميع الوجهات','أماكن حقيقية. شركاء محليون. تجارب أصيلة.'],
 zh:['探索世界','欢迎来到','探索目的地','当地合作伙伴','申请预订','所有目的地','真实地点。本地伙伴。地道体验。'],
 ja:['世界を旅する','ようこそ','目的地を探す','現地パートナー','予約をリクエスト','すべての目的地','本物の場所。現地パートナー。本物の体験。'],
 ko:['세계를 탐험하세요','환영합니다','여행지 둘러보기','현지 파트너','예약 요청','모든 여행지','진짜 장소. 현지 파트너. 진정한 경험.'],
 id:['Jelajahi dunia','Selamat datang di','Jelajahi destinasi','Mitra lokal','Ajukan pemesanan','Semua destinasi','Tempat nyata. Mitra lokal. Pengalaman autentik.'],
 th:['สำรวจโลก','ยินดีต้อนรับสู่','สำรวจจุดหมายปลายทาง','พันธมิตรท้องถิ่น','ขอจอง','จุดหมายทั้งหมด','สถานที่จริง พันธมิตรท้องถิ่น ประสบการณ์แท้จริง'],
 hi:['दुनिया घूमें','आपका स्वागत है','गंतव्य खोजें','स्थानीय भागीदार','बुकिंग का अनुरोध करें','सभी गंतव्य','असली जगहें। स्थानीय भागीदार। प्रामाणिक अनुभव।'],
 sw:['Gundua dunia','Karibu','Gundua maeneo','Mshirika wa eneo','Omba nafasi','Maeneo yote','Maeneo halisi. Washirika wa eneo. Uzoefu halisi.'],
 el:['Εξερευνήστε τον κόσμο','Καλώς ήρθατε','Εξερευνήστε προορισμούς','Τοπικός συνεργάτης','Αίτημα κράτησης','Όλοι οι προορισμοί','Αληθινοί τόποι. Τοπικοί συνεργάτες. Αυθεντικές εμπειρίες.'],
 cs:['Objevujte svět','Vítejte v','Prozkoumat destinace','Místní partner','Požádat o rezervaci','Všechny destinace','Skutečná místa. Místní partneři. Autentické zážitky.']
};
export const COPY=Object.fromEntries(Object.entries(A).map(([k,v])=>[k,{explore:v[0],welcome:v[1],destinations:v[2],partner:v[3],request:v[4],all:v[5],promise:v[6]}]));
export function normaliseLanguage(raw=''){const x=String(raw).toLowerCase().split(',')[0].trim().split('-')[0];return LANGUAGES[x]?x:'en'}
export function languageFromRequest(request){const u=new URL(request.url);const q=u.searchParams.get('lang');if(q&&LANGUAGES[normaliseLanguage(q)])return normaliseLanguage(q);const m=(request.headers.get('cookie')||'').match(/(?:^|;\s*)toeti_lang=([^;]+)/);if(m)return normaliseLanguage(m[1]);return normaliseLanguage(request.headers.get('accept-language')||'en')}
export function languageMeta(lang){lang=normaliseLanguage(lang);return {lang,dir:LANGUAGES[lang].dir,copy:COPY[lang]||COPY.en}}
export function languagePicker(current,path){return Object.entries(LANGUAGES).map(([code,x])=>`<a href="${path}?lang=${code}" hreflang="${code}" lang="${code}"${code===current?' aria-current="page"':''}>${x.name}</a>`).join(' · ')}
export function languageCookie(lang){return `toeti_lang=${normaliseLanguage(lang)}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`}
