import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createLedgerMotion, ledgerExperience, cardStops, track } from './ledger-motion';
import { startFluid } from './fluid';
gsap.registerPlugin(ScrollTrigger);
const page=document.body.dataset.page;
const mail='mailto:info@studiosilini.it?subject=Informazioni%20SiliniTax';
const logo='<a class="ledger-logo" href="/" aria-label="SiliniTax, pagina iniziale">silini<strong>tax</strong></a>';
// WhatsApp is the main way to reach the studio; the email address stays next to it as the alternative.
const whatsapp=(text='Ciao, vorrei informazioni su SiliniTax.')=>`https://wa.me/390350402086?text=${encodeURIComponent(text)}`;
const btnIcon=name=>`<svg class="btn-icon" aria-hidden="true"><use href="/app-icons.svg#${name}"/></svg>`;
function cta(label='Parla con lo studio',secondary=false,message){return `<a class="ledger-button has-icon ${secondary?'secondary':''}" href="${whatsapp(message)}" target="_blank" rel="noopener">${btnIcon('r-whatsapp-logo')}${label}</a>`;}
function header(){return `<header class="ledger-nav">${logo}<nav aria-label="Navigazione principale"><a href="/#funzioni">L’app</a><a href="/chi-siamo/">Lo studio</a><a href="/prezzi/">Piani</a></nav>${cta('Parla con lo studio',true)}</header>`;}
function footer(){return `<footer class="ledger-footer"><div class="footer-top"><div>${logo}<p>La gestione fiscale della tua attività.<br> Con l’app e le persone dello studio.</p></div><div><h3>Esplora</h3><a href="/">L’app</a><a href="/chi-siamo/">Chi siamo</a><a href="/prezzi/">Piani</a></div><div><h3>Contatti</h3><a href="${whatsapp()}" target="_blank" rel="noopener">WhatsApp</a><a href="mailto:info@studiosilini.it">info@studiosilini.it</a><a href="tel:+390350402086">035 040 2086</a><span>Pedrengo (BG)</span></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} SiliniTax</span><span>Schermate illustrative · dati dimostrativi</span></div></footer>`;}
const appYear = new Date().getFullYear();
const appIcon = name => `<svg class="appui-icon" aria-hidden="true"><use href="/app-icons.svg#${name}"/></svg>`;
const appLogo = '<svg class="appui-mark" viewBox="0 0 40 28" aria-hidden="true"><path d="M3 25 12 5l8 15 7-12 10 17" fill="none" stroke="#0E1B3D" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M27 8l10 17" stroke="#2563EB" stroke-width="4.5" stroke-linecap="round"/></svg>';
const appNav = active => `<div class="appui-tabbar">${[['home','r-house','Panoramica'],['tasse','r-chart-pie-slice','Tasse']].map(([key,icon,label]) => `<span class="appui-tab ${key === active ? 'is-active' : ''}">${appIcon(icon)}<small>${label}</small></span>`).join('')}<span class="appui-tab-center"><span>${appIcon('r-plus')}</span></span>${[['fatture','r-receipt','Fatture'],['scadenze','r-calendar-blank','Scadenze']].map(([key,icon,label]) => `<span class="appui-tab ${key === active ? 'is-active' : ''}">${appIcon(icon)}<small>${label}</small></span>`).join('')}</div>`;
const appShell = (active, content) => `<div class="appui-status"><span>9:41</span><span class="appui-system"><i></i><i></i><i></i><b></b></span></div><div class="appui-view">${content}</div>${appNav(active)}`;
const appAvatar = '<span class="appui-avatar">NG</span>';
const appBigHead = (title, subtitle) => `<header class="appui-bighead"><div><h3>${title}</h3><p>${subtitle}</p></div>${appAvatar}</header>`;
const appExample = `<div class="appui-example">${appIcon('r-eye')}<span>Stai guardando un <b>esempio</b></span></div>`;

const screens = [
  appShell('home', `${appExample}<header class="appui-brand-row"><div class="appui-brand">${appLogo}<div><b>SiliniTax</b><small>VERAMENTE SEMPLICI</small></div></div><div class="appui-brand-actions">${appIcon('r-bell')}${appAvatar}</div></header><section class="appui-home-hero"><div class="appui-greeting"><div><small>Ciao Nath,</small><h3>tutto sotto <em>controllo!</em></h3></div><img src="/salvo-ok.webp" alt=""></div><div class="appui-health"><i></i><b>Sei in ordine</b><span>Prossimo F24 30 nov</span></div><div class="appui-money"><small>Disponibile per te</small><strong>€ 18.420</strong><span>su € 25.000 incassati nel ${appYear} · stima</span></div><div class="appui-split"><i></i><i></i></div></section><section class="appui-acc"><div class="appui-acc-row"><i class="appui-blue-dot"></i><span><b>Da accantonare nel ${appYear}</b><small>il 26% di ogni incasso</small></span><strong>€ 6.580</strong></div><div class="appui-jar"><div><small>Nel salvadanaio</small><strong>€ 5.200</strong></div><span class="appui-pill">Metti da parte</span><div class="appui-progress"><i></i></div></div></section><section class="appui-next"><b>Prossime scadenze</b><span>Tutte</span><div><strong>30 <small>NOV</small></strong><span>F24 · secondo acconto<br> <small>Importo stimato</small></span></div></section>`),
  appShell('tasse', `${appBigHead('Tasse', 'Prossimo F24 30 nov · importo stimato')}<div class="appui-segments"><b>Panoramica</b><span>F24</span><span>Dichiarazione</span></div><section class="appui-tax-hero"><small>Da mettere da parte fino a giugno ${appYear + 1}</small><strong>€ 8.120</strong><p>Il <b>26%</b> di ogni incasso · circa <b>€ 680 al mese</b></p><div class="appui-tax-jar"><img src="/salvo-ok.webp" alt=""><div><span>Nel salvadanaio</span><b>€ 5.200</b><div class="appui-progress"><i></i></div></div></div></section><section class="appui-white-card appui-tax-split"><div><span>Tasse previste ${appYear} <small>STIMA</small></span><b>€ 6.580</b></div><div><span>Imposta sostitutiva</span><b>€ 2.480</b></div><div><span>Contributi</span><b>€ 4.100</b></div></section><section class="appui-white-card appui-tax-next"><b>Prossime scadenze</b><div><strong>30 <small>NOV</small></strong><span>Secondo acconto F24<br> <small>Da verificare con lo studio</small></span></div></section>`),
  appShell('fatture', `${appBigHead('Fatture', `18 nel ${appYear} · € 2.630 da incassare`)}<div class="appui-segments appui-two"><b>Fatture</b><span>Clienti</span></div><div class="appui-search"><span>${appIcon('r-magnifying-glass')} Cerca fatture</span><span>${appIcon('r-download-simple')} XML</span></div><div class="appui-filters"><b>Tutte <i>18</i></b><span>Da incassare <i>3</i></span><span>Incassate</span></div><div class="appui-month"><b>Settembre ${appYear}</b><strong>€ 4.920</strong></div><section class="appui-white-card appui-invoices"><div><i class="is-open"></i><span><b>Studio Ferrari Architetti</b><small>19 set · fattura 18 · scade 19 ott</small></span><strong>€ 1.420<small>Da incassare</small></strong></div><div><i class="is-paid"></i><span><b>Cantine Moroni</b><small>5 set · fattura 17 · incassata</small></span><strong>€ 1.680<small>Incassata</small></strong></div><div><i class="is-paid"></i><span><b>Albergo Sebino</b><small>2 set · fattura 16 · incassata</small></span><strong>€ 980<small>Incassata</small></strong></div></section><p class="appui-note">Registra le fatture o importa XML e P7M. L’emissione allo SDI resta nel tuo strumento abituale.</p>`),
  appShell('scadenze', `${appBigHead('Scadenze', 'Prossimo F24 30 nov · importo stimato')}<div class="appui-filters appui-due-filters"><b>Prossime</b><span>Passate e pagate</span><span>Tutte</span></div><h4 class="appui-group-title">Quello che devi sapere adesso</h4><section class="appui-white-card appui-due-list"><div><strong>30 <small>NOV</small></strong><span><b>F24 · secondo acconto</b><small>Scade il 30 novembre</small></span><em>Da pagare</em></div></section><h4 class="appui-group-title">Più avanti</h4><section class="appui-white-card appui-due-list"><div><strong>16 <small>FEB</small></strong><span><b>Bollo fatture elettroniche</b><small>Importo stimato</small></span><em>Da pagare</em></div><div><strong>30 <small>GIU</small></strong><span><b>F24 · saldo e acconto</b><small>Importo da verificare</small></span><em>Previsto</em></div></section><p class="appui-note">Segna gli F24 pagati: il dato aggiorna i calcoli dell’app.</p>`)
];


const features=[
 ['Panoramica','I tuoi numeri,<br> insieme.','Incassi, disponibile e somme da accantonare. Una vista per sapere a che punto sei.','r-house'],
 ['Tasse','Sai quanto<br> mettere da parte.','Una stima di tasse e contributi, aggiornata con i dati che registri.','r-chart-pie-slice'],
 ['Fatture','Vedi cosa manca<br> all’incasso.','Registri le fatture, importi XML e distingui i pagamenti ricevuti da quelli attesi.','r-receipt'],
 ['Scadenze','La prossima<br> scadenza è qui.','Date in ordine e pagamenti da confermare. Gli importi si verificano con lo studio.','r-calendar-blank']
];
const principles=[
 ['Leggere i numeri','Mettere le informazioni importanti in un ordine comprensibile.'],
 ['Preparare il prossimo passo','Capire quali documenti e verifiche richiedono attenzione.'],
 ['Parlare con qualcuno','Affrontare i dubbi con le persone dello studio, senza lasciare tutto a una schermata.']
];
function home(){return `<main id="main">
<section class="ledger-intro"><div class="intro-copy"><h1>Tutto il tuo fisco.<br> In una sola app.</h1><p>Incassi, tasse e scadenze in una vista chiara.<br> Con il supporto delle persone di Studio Silini.</p><div class="ledger-actions"><a class="ledger-button" href="#funzioni">Esplora l’app<span class="button-symbol">${appIcon('r-arrow-down')}</span></a>${cta('Parla con lo studio',true)}</div></div></section>
<section class="ledger-journey" aria-label="Esplora l’app SiliniTax, schermate illustrative"><div class="journey-stage">${ledgerExperience(appIcon,appLogo,appYear,screens)}<nav class="journey-tabs" aria-label="Funzioni dell’app">${features.map(([label],i)=>`<button type="button" data-stop="${i}" aria-pressed="${i===0}">${label}</button>`).join('')}</nav></div></section>
<section class="ledger-about" id="studio"><h2 class="about-title">I numeri aiutano.<br> Le persone<br> <span>chiariscono.</span></h2><div class="about-summary"><p>Crediamo che il fisco debba essere più comprensibile. L’app mette in ordine le informazioni. Le persone dello studio ti aiutano a leggerle e a scegliere il prossimo passo.</p><a class="ledger-button secondary" href="/chi-siamo/">Il nostro approccio</a></div></section>
<section class="ledger-platform" id="funzioni"><div class="platform-stage"><div class="feature-deck">${features.map(([label,title,copy,icon],i)=>`<article class="deck-card card-${i}"><div class="deck-icon">${appIcon(icon)}</div><h3>${label}</h3><p>${copy}</p></article>`).join('')}</div><h2>La tua attività.<br> Più semplice<br> da leggere.</h2></div></section>
<section class="ledger-product" id="come-lavoriamo"><div class="product-layout"><div class="product-copy"><h2>Meno dubbi.<br> Più chiarezza.</h2><p>Parti dai tuoi dati, poi confrontati con lo studio.</p><div class="ledger-actions">${cta()}<a class="ledger-button secondary" href="/prezzi/">Esplora i piani</a></div></div><ol class="work-steps">${principles.map(([title,copy])=>`<li><h3>${title}</h3><p>${copy}</p></li>`).join('')}</ol></div></section>
<section class="ledger-statement"><h2>Crediamo in un fisco<br> che si capisce.</h2>${cta()}<p class="statement-alt">Oppure scrivi a <a href="${mail}">info@studiosilini.it</a></p></section>
</main>`;}
function about() { return `<main id="main"><section class="inner-hero container"><span class="section-index">SILINITAX / CHI SIAMO</span><h1>Un modo più<br> <em>chiaro</em> di parlarne.</h1><p>SiliniTax è l’applicazione di Studio Silini pensata per accompagnarti nella gestione fiscale della tua attività, insieme alle persone dello studio.</p>${cta()}</section><section class="manifesto"><div class="container manifesto-grid"><div><span class="section-index">IL NOSTRO PUNTO DI PARTENZA</span><h2>La chiarezza<br> prima di tutto.</h2></div><div><p>Le domande fiscali non arrivano solo quando è tempo di dichiarazioni. Una vista organizzata di numeri, date e attività può rendere più utile ogni confronto con lo studio.</p><p>L’app aiuta a mettere a fuoco i prossimi passi e a preparare le domande da discutere con lo studio.</p></div></div></section><section class="principles container"><span class="section-index">COME VORREMMO LAVORARE</span><div class="principle"><span>01</span><h3>Leggere i numeri</h3><p>Mettere le informazioni importanti in un ordine comprensibile.</p></div><div class="principle"><span>02</span><h3>Preparare il prossimo passo</h3><p>Capire quali documenti e verifiche richiedono attenzione.</p></div><div class="principle"><span>03</span><h3>Parlare con qualcuno</h3><p>Affrontare i dubbi con le persone dello studio, senza lasciare tutto a una schermata.</p></div></section><section class="inner-cta container"><h2>Hai una domanda sulla<br> tua attività?</h2>${cta()}</section></main>`; }

function pricing() { return `<main id="main"><section class="inner-hero container"><span class="section-index">SILINITAX / PIANI</span><h1>Il supporto giusto<br> per il tuo <em>percorso.</em></h1><p>Qui trovi i livelli di supporto presentati nella bozza del servizio. Chiedi allo studio servizi, disponibilità e condizioni aggiornate per la tua attività.</p>${cta()}</section><section class="plans container"><article class="plan"><span class="plan-number">BASE</span><h2>Parti dalle basi.</h2><p>Per mettere in ordine gli elementi essenziali della gestione contabile.</p><ul><li>Contabilità e adempimenti da definire</li><li>Un primo confronto con lo studio</li></ul>${cta('Parla con lo studio',true,'Ciao, vorrei informazioni sul piano Base di SiliniTax.')}</article><article class="plan featured"><span class="plan-number">PLUS</span><h2>Più supporto nel tempo.</h2><p>Per chi vuole un confronto più continuativo sul lavoro da preparare.</p><ul><li>Il percorso Base</li><li>Ambito della dichiarazione da confermare</li></ul>${cta('Parla con lo studio',true,'Ciao, vorrei informazioni sul piano Plus di SiliniTax.')}</article><article class="plan"><span class="plan-number">MAX</span><h2>Uno sguardo avanti.</h2><p>Per esplorare strumenti di previsione e un supporto più ampio.</p><ul><li>Il percorso Plus</li><li>Funzioni digitali da confermare nel piano</li></ul>${cta('Parla con lo studio',true,'Ciao, vorrei informazioni sul piano Max di SiliniTax.')}</article></section><div class="container plan-note">Prezzi, inclusioni e condizioni non sono ancora confermati. La proposta dello studio chiarirà le prestazioni effettive e i professionisti coinvolti.</div><section class="inner-cta container"><h2>Non sai da dove<br> cominciare?</h2>${cta()}</section></main>`; }


document.getElementById('app').innerHTML=header()+({home,about,pricing}[page]||home)()+footer();
const mm=gsap.matchMedia();
if(page==='home'){
 // Liquid background behind the whole home; the dark chapters (studio, product) turn it navy.
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const fluidCanvas=document.createElement('canvas');
 fluidCanvas.id='fluid';fluidCanvas.setAttribute('aria-hidden','true');
 document.body.prepend(fluidCanvas);
 const fluid=startFluid(fluidCanvas,{reduced:reducedMotion});
 if(!fluid)document.body.classList.add('no-fluid');
 const themeMeta=document.querySelector('meta[name=theme-color]');
 const darkChapters=['.ledger-about','.ledger-product'].map(sel=>ScrollTrigger.create({trigger:sel,start:'top 50%',end:'bottom 50%',refreshPriority:-1,onToggle:applyTheme}));
 function applyTheme(){
  const dark=darkChapters.some(t=>t.isActive);
  document.body.classList.toggle('dark',dark);
  if(themeMeta)themeMeta.content=dark?'#050a1c':'#eef3fb';
  if(fluid)fluid.setDark(dark?1:0);
 }
 if(fluid)ScrollTrigger.create({start:0,end:'max',refreshPriority:-1,onUpdate:self=>fluid.setScroll(self.progress)});
 const section=document.querySelector('.ledger-journey'),stage=section.querySelector('.journey-stage');
 const {render,tabs,actions,measure}=createLedgerMotion(section);
 const intro=document.querySelector('.ledger-intro');
 let journey;
 const approach=()=>track(window.scrollY,0,intro.offsetHeight);
 const update=p=>render(p,approach());
 update(Math.max(0,Math.min(1,(scrollY-intro.offsetHeight+innerHeight*.25)/(innerHeight*(innerWidth<761?3.5:4)))));
 mm.add('(prefers-reduced-motion: no-preference)',()=>{
  document.body.classList.add('motion-ledger');
  ScrollTrigger.create({trigger:section,start:()=>`top ${intro.offsetHeight}px`,end:()=>`top ${innerHeight*.25}px`,invalidateOnRefresh:true,onUpdate:()=>{if(!journey||journey.progress()===0)update(0);},onRefresh:()=>{if(!journey||journey.progress()===0)update(0);}});
  journey=gsap.to({progress:0},{progress:1,ease:'none',scrollTrigger:{trigger:section,start:()=>`top ${innerHeight*.25}px`,end:()=>'+='+innerHeight*(innerWidth<761?3.5:4),pin:stage,scrub:.32,invalidateOnRefresh:true},onUpdate:function(){update(this.progress())}});
  gsap.from('.intro-copy>*',{y:18,opacity:0,duration:.7,stagger:.08,ease:'power2.out'});
  gsap.from('.about-title',{y:65,opacity:0,scrollTrigger:{trigger:'.ledger-about',start:'top 70%',end:'top 15%',scrub:1}});
  const cards=gsap.utils.toArray('.deck-card');
  const tl=gsap.timeline({scrollTrigger:{trigger:'.ledger-platform',start:'top top',end:()=>'+='+innerHeight*2.4,pin:'.platform-stage',scrub:.7,invalidateOnRefresh:true}});
  cards.forEach((c,i)=>{gsap.set(c,{zIndex:i+1,rotation:i%2?5:-5,y:i*9});if(i>0)gsap.set(c,{y:700,rotation:12});if(i>0)tl.to(c,{y:0,rotation:i%2?4:-4,duration:1},i-.2);});
  gsap.from('.ledger-statement h2',{opacity:.15,scrollTrigger:{trigger:'.ledger-statement',start:'top 85%',end:'top 35%',scrub:1}});
  return()=>{journey=null;document.body.classList.remove('motion-ledger');};
 });
 mm.add('(prefers-reduced-motion: reduce)',()=>{document.body.classList.add('reduced-ledger');render(cardStops()[0],1,true);return()=>document.body.classList.remove('reduced-ledger');});
 tabs.forEach((b,i)=>b.addEventListener('click',()=>{if(journey){const st=journey.scrollTrigger;window.scrollTo({top:st.start+(st.end-st.start)*cardStops()[i],behavior:'smooth'});}else{render(i===3?.96:cardStops()[i],1,true);}}));
 actions.forEach((b,i)=>b.addEventListener('click',()=>{const stop=[.51,.75,.96][i];if(journey){const st=journey.scrollTrigger;window.scrollTo({top:st.start+(st.end-st.start)*stop,behavior:'smooth'});}else render(stop,1,true);}));
 document.fonts.ready.then(()=>{measure();ScrollTrigger.refresh();if(journey)update(journey.scrollTrigger.progress);});
 addEventListener('pageshow',()=>{if(journey)update(journey.scrollTrigger.progress);});
 addEventListener('resize',()=>{measure();if(journey)update(journey.progress());});
}
addEventListener('pagehide',()=>mm.revert(),{once:true});
