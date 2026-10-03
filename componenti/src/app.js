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
const appIcon = name => `<svg class="appui-icon" aria-hidden="true"><use href="/app-icons.svg#${name}"/></svg>`;

const features=[
 ['Panoramica','Quanto resta<br> davvero a te.','Il disponibile dopo tasse e contributi, gli incassi dell’anno e cosa ti aspetta nei prossimi giorni.','r-house'],
 ['Tasse','Sai quanto<br> mettere da parte.','Una stima di tasse e contributi fino al prossimo saldo, con la quota da accantonare ogni mese.','r-chart-pie-slice'],
 ['Fatture','Vedi cosa manca<br> all’incasso.','Le fatture mese per mese, l’importazione XML e un tocco per segnare un pagamento come incassato.','r-receipt'],
 ['Scadenze','La prossima<br> scadenza è qui.','F24 e dichiarazioni in ordine di data, con quello di cui si occupa lo studio già indicato.','r-calendar-blank']
];
const principles=[
 ['Leggere i numeri','Mettere le informazioni importanti in un ordine comprensibile.'],
 ['Preparare il prossimo passo','Capire quali documenti e verifiche richiedono attenzione.'],
 ['Parlare con qualcuno','Affrontare i dubbi con le persone dello studio, senza lasciare tutto a una schermata.']
];
const journeyNav=()=>`<nav class="journey-tabs" aria-label="Funzioni dell’app">${features.map(([label],i)=>`<button type="button" data-stop="${i}" aria-pressed="${i===0}">${label}</button>`).join('')}</nav>`;
function home(){return `<main id="main">
<section class="ledger-intro"><div class="intro-copy"><h1>Tutto il tuo fisco.<br> In una sola app.</h1><p>Incassi, tasse e scadenze in una vista chiara.<br> Con il supporto delle persone di Studio Silini.</p><div class="ledger-actions"><a class="ledger-button" href="#funzioni">Esplora l’app<span class="button-symbol">${appIcon('r-arrow-down')}</span></a>${cta('Parla con lo studio',true)}</div></div></section>
<section class="ledger-journey" aria-label="Esplora l’app SiliniTax"><div class="journey-stage"><div class="journey-frame" aria-hidden="true"><div class="journey-window"></div></div>${ledgerExperience(features,journeyNav())}</div></section>
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
 // The studio chapter turns navy once the light film has carried its title up the screen.
 const darkChapters=[['.ledger-about','top 50%'],['.ledger-product','top 50%']].map(([sel,start])=>ScrollTrigger.create({trigger:sel,start,end:'bottom 50%',refreshPriority:-1,onToggle:applyTheme}));
 function applyTheme(){
  const dark=darkChapters.some(t=>t.isActive);
  document.body.classList.toggle('dark',dark);
  if(themeMeta)themeMeta.content=dark?'#050a1c':'#f1f1f1';
  if(fluid)fluid.setDark(dark?1:0);
 }
 if(fluid)ScrollTrigger.create({start:0,end:'max',refreshPriority:-1,onUpdate:self=>fluid.setScroll(self.progress)});
 const section=document.querySelector('.ledger-journey'),stage=section.querySelector('.journey-stage');
 const {render,tabs,measure}=createLedgerMotion(section);
 const intro=document.querySelector('.ledger-intro');
 let journey;
 const approach=()=>track(window.scrollY,0,intro.offsetHeight);
 // The liquid behind the phone grows with it while the phone scales up to fill the screen.
 const update=p=>{render(p,approach());fluidCanvas.style.scale=String(1+.35*track(p,0,.145));};
 // Hand-off after the phone story: the pin holds the phone one screen longer and the studio chapter is
 // pulled up to overlap that screen, so its title rises right under the phone as it slides away.
 // The light matte film starts after the studio chapter (fluid.css).
 const about=document.querySelector('.ledger-about');
 const storyLen=()=>innerHeight*(innerWidth<761?3:3.4),handoffLen=()=>innerHeight;
 const storyShare=()=>storyLen()/(storyLen()+handoffLen());
 // The pinned stage (75dvh, held 25% down) ends at the bottom of the screen, so pulling the chapter up
 // by one hand-off makes it enter exactly when the hand-off starts.
 // Runs on refreshInit, before ScrollTrigger measures, so the dark-chapter triggers see the final layout.
 const overlapFilm=()=>{about.style.marginTop=-handoffLen()+'px';};
 // The phone and its copy leave crisply: the stage slides up with the rising chapter, no fade or blur.
 function handoff(e){
  stage.style.translate=e?`0 ${(-100*e).toFixed(2)}vh`:'';
  stage.style.visibility=e>=1?'hidden':'';
 }
 const advance=t=>{const share=storyShare();update(Math.min(1,t/share));handoff(Math.max(0,(t-share)/(1-share)));};
 update(Math.max(0,Math.min(1,(scrollY-intro.offsetHeight+innerHeight*.25)/storyLen())));
 mm.add('(prefers-reduced-motion: no-preference)',()=>{
  document.body.classList.add('motion-ledger');
  overlapFilm();ScrollTrigger.addEventListener('refreshInit',overlapFilm);
  ScrollTrigger.create({trigger:section,start:()=>`top ${intro.offsetHeight}px`,end:()=>`top ${innerHeight*.25}px`,invalidateOnRefresh:true,onUpdate:()=>{if(!journey||journey.progress()===0)update(0);},onRefresh:()=>{if(!journey||journey.progress()===0)update(0);}});
  journey=gsap.to({progress:0},{progress:1,ease:'none',scrollTrigger:{trigger:section,start:()=>`top ${innerHeight*.25}px`,end:()=>'+='+(storyLen()+handoffLen()),pin:stage,scrub:.32,invalidateOnRefresh:true},onUpdate:function(){advance(this.progress())}});
  gsap.from('.intro-copy>*',{y:18,opacity:0,duration:.7,stagger:.08,ease:'power2.out'});
  gsap.from('.about-title',{y:65,opacity:0,scrollTrigger:{trigger:'.ledger-about',start:'top bottom',end:'top 30%',scrub:1}});
  const cards=gsap.utils.toArray('.deck-card');
  const tl=gsap.timeline({scrollTrigger:{trigger:'.ledger-platform',start:'top top',end:()=>'+='+innerHeight*2.4,pin:'.platform-stage',scrub:.7,invalidateOnRefresh:true}});
  cards.forEach((c,i)=>{gsap.set(c,{zIndex:i+1,rotation:i%2?5:-5,y:i*9});if(i>0)gsap.set(c,{y:700,rotation:12});if(i>0)tl.to(c,{y:0,rotation:i%2?4:-4,duration:1},i-.2);});
  gsap.from('.ledger-statement h2',{opacity:.15,scrollTrigger:{trigger:'.ledger-statement',start:'top 85%',end:'top 35%',scrub:1}});
  return()=>{
   journey=null;handoff(0);document.body.classList.remove('motion-ledger');
   ScrollTrigger.removeEventListener('refreshInit',overlapFilm);about.style.marginTop='';
  };
 });
 mm.add('(prefers-reduced-motion: reduce)',()=>{
  document.body.classList.add('reduced-ledger');render(cardStops()[0],1,true);
  return()=>document.body.classList.remove('reduced-ledger');
 });
 tabs.forEach((b,i)=>b.addEventListener('click',()=>{if(journey){const st=journey.scrollTrigger;window.scrollTo({top:st.start+storyLen()*cardStops()[i],behavior:'smooth'});}else{render(cardStops()[i],1,true);}}));
 document.fonts.ready.then(()=>{measure();ScrollTrigger.refresh();if(journey)advance(journey.progress());});
 addEventListener('pageshow',()=>{if(journey)advance(journey.progress());});
 addEventListener('resize',()=>{measure();if(journey)advance(journey.progress());});
}
addEventListener('pagehide',()=>mm.revert(),{once:true});
