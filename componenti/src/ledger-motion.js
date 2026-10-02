import { gsap } from 'gsap';
// Cubic ease-in-out clamped to [a,b]: the same curve remotion's Easing.inOut(Easing.cubic) gave,
// without bundling remotion and React (about 175 KB) for two helpers.
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
export const track=(p,a,b)=>ease(Math.min(1,Math.max(0,(p-a)/(b-a))));
const mix=(a,b,t)=>a+(b-a)*t;
export const cardStops=()=>[.20,.675,.415,.90];
const euro=n=>{const [whole,cents]=n.toFixed(2).split('.');return '€ '+whole.replace(/\B(?=(\d{3})+(?!\d))/g,'.')+(cents==='00'?'':','+cents);};

export function ledgerExperience(icon,logo,year,screens){
 const pending=`<section class="story-pending"><span class="story-pending-icon">${icon('r-receipt')}</span><div><b>Hai una fattura da incassare</b><small>Studio Ferrari · fattura 18</small></div><strong>€ 1.420</strong><span class="story-pending-check">✓</span></section>`;
 const views=[screens[0].replace('<section class="appui-acc">',pending+'<section class="appui-acc">'),screens[2],screens[1],screens[3]];
 views[2]=views[2].replace('<p>Il <b>26%</b> di ogni incasso · circa <b>€ 680 al mese</b></p>',`<div class="story-tax-allocation"><b>€ 369,20 <span>da accantonare</span></b><p>Il 26% di questo incasso di € 1.420 · stima</p></div>`);
 const actions=[null,['invoice','Incassa fattura','Fattura incassata'],['saving','Metti da parte € 369,20','Quota accantonata'],['deadline','Vedi il prossimo F24','30 novembre · Da verificare']];
 const actionMarkup=i=>`<button type="button" class="story-action story-action-${actions[i][0]}" data-story-action="${actions[i][0]}" aria-label="${actions[i][1]}, esempio animato"><span class="story-action-before">${actions[i][1]}</span><span class="story-action-fill"></span><span class="story-action-after">✓ ${actions[i][2]}</span><span class="story-action-arrow">↗</span></button>`;
 return `<div class="ledger-phone"><div class="phone-island-ledger"></div>${views.map((view,i)=>`<div class="story-screen story-screen-${i}" aria-hidden="${i!==0}">${view}</div>`).join('')}<div class="story-actions">${actions.map((action,i)=>action?actionMarkup(i):'').join('')}</div><div class="phone-home-ledger"></div></div><div class="regia-notice regia-payment" aria-hidden="true"><span class="regia-notice-icon">✓</span><div><b>Fattura incassata <em>€ 1.420</em></b><small>Studio Ferrari · incasso registrato</small></div></div><div class="regia-notice regia-tax" aria-hidden="true"><span class="regia-notice-icon">${icon('r-chart-pie-slice')}</span><div><b>Quota accantonata <em>€ 369,20</em></b><small>Nel salvadanaio · esempio</small></div></div><div class="regia-notice regia-invoice" aria-hidden="true"><span class="regia-notice-icon">${icon('r-calendar-blank')}</span><div><b>Prossimo F24 <em>30 NOV</em></b><small>Importo da verificare con lo studio</small></div></div>`;
}

export function createLedgerMotion(section){
 const stage=section.querySelector('.journey-stage'),phone=section.querySelector('.ledger-phone');
 const views=[...section.querySelectorAll('.story-screen')],nav=section.querySelector('.journey-tabs'),tabs=[...section.querySelectorAll('[data-stop]')];
 const actions=[...section.querySelectorAll('.story-action')],allocation=section.querySelector('.story-tax-allocation');
 const actionHosts=[views[1].querySelector('.appui-invoices>div'),views[2].querySelector('.appui-tax-hero'),views[3].querySelector('.appui-due-list')];
 actions.forEach((action,i)=>{actionHosts[i].append(action);action.querySelectorAll('span').forEach(el=>el.setAttribute('aria-hidden','true'));});
 section.querySelector('.story-actions').remove();
 const notices=['payment','tax','invoice'].map(name=>section.querySelector('.regia-'+name));
 const background=section.querySelector('.journey-background');
 const invoiceRow=views[1].querySelector('.appui-invoices>div');
 const pending=views[0].querySelector('.story-pending');
 const transitions=[[.285,.345],[.555,.62],[.775,.835]];
 const focusTargets=[pending,views[1].querySelector('.appui-invoices'),views[2].querySelector('.appui-tax-hero'),views[3].querySelector('.appui-due-list')];
 const setText=(node,value)=>{if(node&&node.textContent!==value)node.textContent=value;};
 let positions=[];
 const measure=()=>{
  // Offset coordinates remain independent of the phone's scroll-driven scale.
  positions=focusTargets.map(el=>{let x=0,y=0,node=el;while(node&&node!==phone){x+=node.offsetLeft;y+=node.offsetTop;node=node.offsetParent;}return{x,y,w:el.offsetWidth,h:el.offsetHeight};});
 };
 measure();
 const render=(p,approach=1,reduced=false)=>{
  const mobile=innerWidth<761,h=innerHeight,w=stage.clientWidth;
  const anchor=reduced?0:h*.25;
  const intro=document.querySelector('.ledger-intro').offsetHeight;
  const startApproach=track(Math.max(0,intro-anchor),0,intro);
  const base=mobile?.68:.95,fit=mobile||reduced?Math.min(1.02,(h-150)/624,(w-38)/302):Math.min(1.62,w/650);
  const entry=reduced?1:track(p,0,.145);
  const scale=mix(base,fit,entry),pan=mobile||reduced?0:180*track(p,.83,.94);
  const resting=(h-624*base)/2, initialTop=mobile?-65:-90;
  const entranceTop=mix(initialTop,resting,startApproach);
  const finalTop=(mobile||reduced?(h-624*scale)/2:resting)-anchor-pan;
  const before=window.scrollY<intro-anchor&&!reduced;
  const top=before?mix(initialTop,resting,approach):mix(entranceTop,finalTop,entry);
  gsap.set(phone,{scale,xPercent:-50,yPercent:0,x:0,y:top,top:0});
  const bottom=mobile?h*.18:Math.max(0,h-530);
  if(background)gsap.set(background,{height:h,y:-anchor*entry,clipPath:`inset(0px ${(mobile?12:16)*(1-entry)}px ${bottom*(1-entry)}px round ${32*(1-entry)}px)`});
  let active=0;
  views.forEach((view,i)=>{
   const enter=i?track(p,...transitions[i-1]):1;
   const leave=i<3?track(p,...transitions[i]):0;
   if(i&&enter>.5)active=i;
   const from=positions[i-1]||{x:0,y:0,w:284,h:606};
   const clip=i?`inset(${from.y*(1-enter)}px ${Math.max(0,284-from.x-from.w)*(1-enter)}px ${Math.max(0,606-from.y-from.h)*(1-enter)}px ${from.x*(1-enter)}px round ${17*(1-enter)}px)`:'inset(0px)';
   gsap.set(view,{zIndex:i+1,opacity:enter>0?(1-track(leave,.68,1)):0,clipPath:clip,scale:1-.025*leave,y:-12*leave,filter:`blur(${2*leave}px)`});
   view.setAttribute('aria-hidden',String(enter<.5||leave>.5));
   // Cards settle ahead of the surrounding page, preserving one focal point.
   if(i){const card=focusTargets[i];gsap.set(card,{y:16*(1-enter),scale:.96+.04*enter,transformOrigin:'center top'});}
  });
  views.forEach((view,i)=>{view.style.pointerEvents=i===active?'auto':'none';});
  tabs.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===[0,2,1,3][active])));
  const paid=track(p,.435,.485),saved=track(p,.685,.73);
  const focusWindows=[[.19,.225,.27,.285],[.355,.385,.49,.52],[.625,.66,.735,.76],[.835,.86,.965,1]];
  focusTargets.forEach((card,i)=>{const [a,b,c,d]=focusWindows[i],focus=track(p,a,b)*(1-track(p,c,d));gsap.set(card,{scale:1+.018*focus,rotation:-.7*focus,transformOrigin:'center center'});});
  pending.style.backgroundColor=`rgb(${mix(255,234,paid)},${mix(237,246,paid)},${mix(237,237,paid)})`;
  gsap.set(pending.querySelector('.story-pending-icon'),{opacity:1-paid});
  gsap.set(pending.querySelector('.story-pending-check'),{opacity:paid});
  setText(pending.querySelector('b'),paid>.5?'Fattura incassata':'Hai una fattura da incassare');
  invoiceRow.classList.toggle('story-paid',paid>.5);
  setText(invoiceRow.querySelector('strong small'),paid>.5?'Incassata':'Da incassare');
  setText(views[1].querySelector('.appui-bighead p'),`18 nel ${new Date().getFullYear()} · ${euro(2630-1420*paid)} da incassare`);
  setText(views[1].querySelector('.appui-filters>span i'),paid>.5?'2':'3');
  setText(views[0].querySelector('.appui-money strong'),euro(18420+1050.8*paid));
  setText(views[0].querySelector('.appui-money>span'),`su ${euro(25000+1420*paid)} incassati nel ${new Date().getFullYear()} · stima`);
  setText(views[0].querySelector('.appui-acc-row>strong'),euro(6580+369.2*paid));
  setText(views[0].querySelector('.appui-health b'),paid>.5?'Sei in ordine':'Dati aggiornati');
  setText(views[0].querySelector('.appui-jar strong'),euro(5200+369.2*saved));
  setText(views[2].querySelector('.appui-tax-hero>strong'),euro(8120+369.2*paid));
  setText(views[2].querySelector('.appui-tax-jar b'),euro(5200+369.2*saved));
  const contribution=369.2*4100/6580;
  const taxRows=[...views[2].querySelectorAll('.appui-tax-split>div>b')];
  [6580+369.2*paid,2480+(369.2-contribution)*paid,4100+contribution*paid].forEach((n,i)=>setText(taxRows[i],euro(n)));
  gsap.set(views[2].querySelectorAll('.appui-progress i'),{scaleX:mix(1,1.07,saved),transformOrigin:'left center'});
  const phases=[[.36,.405,.435,.485,.52,.555],[.635,.665,.685,.73,.755,.785],[.855,.90,.91,.955,1,1.1]];
  actions.forEach((button,i)=>{
   const [a,b,c,d,e,f]=phases[i],show=track(p,a,b)*(1-track(p,e,f)),done=track(p,c,d);
   gsap.set(button,{opacity:show,y:24*(1-track(p,a,b)),visibility:show>.01?'visible':'hidden',height:36*show,marginTop:8*show});
   button.tabIndex=show>.5?0:-1;
   button.setAttribute('aria-label',`${done>.7?button.querySelector('.story-action-after').textContent.replace('✓ ',''):button.querySelector('.story-action-before').textContent}, esempio animato`);
   gsap.set(button.querySelector('.story-action-fill'),{scaleX:done,transformOrigin:'right center'});
   gsap.set(button.querySelector('.story-action-before'),{opacity:1-track(done,0,.4),y:-6*done});
   gsap.set(button.querySelector('.story-action-after'),{opacity:track(done,.6,1),y:6*(1-done)});
   gsap.set(button.querySelector('.story-action-arrow'),{opacity:1-done});
  });
  const allocationShow=track(p,.625,.665)*(1-track(p,.75,.78));
  gsap.set(allocation,{opacity:allocationShow,y:12*(1-allocationShow)});
  allocation.setAttribute('aria-hidden',String(allocationShow<.1));
  // The invoice confirmation docks into its paid row; the savings into its jar.
  const nw=mobile?223:330,nh=mobile?53:79;
  const screenX=w/2-151*scale;
  const place=(el,from,dock,appear,flight,shrink)=>{
   const s=appear*(1-shrink);
   gsap.set(el,{width:nw,height:nh,left:0,top:0,x:mix(from[0],dock[0],flight)-nw/2,y:mix(from[1],dock[1],flight)-nh/2,scale:s,opacity:s>.01?1:0});
   el.setAttribute('aria-hidden',String(s<.1));
  };
  const paymentFrom=mobile?[w/2,Math.max(36-anchor,top-52)]:[w/2-327,h*.38-anchor];
  const taxFrom=mobile?[w/2,Math.max(36-anchor,top-52)]:[w/2+327,h*.73-anchor];
  const dueFrom=mobile?[w/2,top+618*scale]:[w/2+327,h*.525-anchor];
  place(notices[0],paymentFrom,[screenX+200*scale,top+248*scale],track(p,.485,.51),track(p,.51,.555),track(p,.53,.565));
  place(notices[1],taxFrom,[screenX+198*scale,top+252*scale],track(p,.73,.755),track(p,.755,.795),track(p,.775,.805));
  place(notices[2],dueFrom,dueFrom,track(p,.845,.875),0,0);
  gsap.set(nav,{opacity:track(p,.145,.18)*(1-track(p,.76,.80)),visibility:p>.80||p<.145?'hidden':'visible'});
  if(reduced){gsap.set(nav,{opacity:1,visibility:'visible'});gsap.set(notices,{opacity:0});notices.forEach(el=>el.setAttribute('aria-hidden','true'));}
 };
 return {render,tabs,actions,measure};
}
