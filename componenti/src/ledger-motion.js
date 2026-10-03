import { gsap } from 'gsap';
// Cubic ease-in-out clamped to [a,b]: the same curve remotion's Easing.inOut(Easing.cubic) gave,
// without bundling remotion and React (about 175 KB) for two helpers.
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
export const track=(p,a,b)=>ease(Math.min(1,Math.max(0,(p-a)/(b-a))));
const mix=(a,b,t)=>a+(b-a)*t;
// Story progress: the phone settles, then three screen changes, each followed by a still hold.
const ENTRY=[0,.12],CHANGES=[[.32,.40],[.56,.64],[.80,.88]];
export const cardStops=()=>[.22,.48,.72,.95];
const SCREEN_W=284;
const SHOTS=['/app-home.webp','/app-tasse.webp','/app-fatture.webp','/app-scadenze.webp'];

// The phone shows real screens of the app; beside it (below on narrow screens) one title and one sentence
// per screen, driven only by scroll. Both slide inside a mask, so nothing is ever half transparent or blurred.
export function ledgerExperience(features,nav){
 const shots=features.map(([label],i)=>`<img class="app-shot" src="${SHOTS[i]}" alt="Schermata ${label} dell’app SiliniTax, dati dimostrativi" width="390" height="769" decoding="async"${i?' loading="lazy"':''}>`).join('');
 const copy=features.map(([,title,text],i)=>`<div class="copy-item" aria-hidden="${i!==0}"><h3>${title}</h3><p>${text}</p></div>`).join('');
 return `<div class="ledger-phone"><div class="phone-island-ledger"></div><div class="app-status" aria-hidden="true"><span>9:41</span><span class="app-status-icons"><i></i><i></i><b></b></span></div><div class="app-screen"><div class="app-track">${shots}</div></div><div class="phone-home-ledger"></div></div><div class="journey-copy"><div class="copy-mask">${copy}</div>${nav}</div>`;
}

export function createLedgerMotion(section){
 const stage=section.querySelector('.journey-stage'),phone=section.querySelector('.ledger-phone');
 const appTrack=section.querySelector('.app-track'),shots=[...section.querySelectorAll('.app-shot')];
 const copyBox=section.querySelector('.journey-copy'),mask=section.querySelector('.copy-mask'),items=[...section.querySelectorAll('.copy-item')];
 const tabs=[...section.querySelectorAll('[data-stop]')],win=section.querySelector('.journey-window');
 let active=-1;
 const render=(p,approach=1,reduced=false)=>{
  const mobile=innerWidth<761,h=innerHeight,w=stage.clientWidth;
  const anchor=reduced?0:h*.25;
  const entry=reduced?1:track(p,...ENTRY);
  const screen=CHANGES.reduce((n,[a,b])=>n+track(p,a,b),0);
  // Phone always centred. Wide screens put the copy on its left; narrower ones stack it under the phone.
  const side=!mobile&&w>=1100;
  const base=mobile?.68:.95;
  const fit=side?Math.min(1.2,(h-170)/624):Math.min(1,(h-300)/624,(w-60)/302);
  const scale=mix(base,fit,entry);
  const finalTop=side?(h-624*fit)/2:84;
  const top=mix(mobile?-55:-75,finalTop-anchor,entry);
  gsap.set(phone,{scale,transformOrigin:'50% 0%',xPercent:-50,yPercent:0,x:0,y:top,top:0});
  if(win)gsap.set(win,{y:-anchor*entry,left:0,right:0,height:h,borderRadius:0});
  gsap.set(appTrack,{x:-SCREEN_W*screen});
  const left=side?Math.max(24,w*.06):20,width=side?Math.min(420,w/2-151*fit-left-48):Math.min(560,w-40);
  copyBox.classList.toggle('is-stacked',!side);
  copyBox.style.left=(side?left:(w-width)/2)+'px';copyBox.style.width=width+'px';
  const maskH=Math.max(...items.map(item=>[...item.children].reduce((n,el)=>n+el.offsetHeight+parseFloat(getComputedStyle(el).marginTop),0)))+8;
  mask.style.height=maskH+'px';
  const copyTop=side?(h-copyBox.offsetHeight)/2:finalTop+624*fit+16;
  gsap.set(copyBox,{y:copyTop-anchor,clipPath:`inset(0 0 ${((1-entry)*100).toFixed(2)}% 0)`});
  const pos=screen-1+entry;
  items.forEach((item,i)=>gsap.set(item,{y:(i-pos)*maskH}));
  const now=Math.round(screen);
  if(now!==active){
   active=now;
   items.forEach((item,i)=>item.setAttribute('aria-hidden',String(i!==now)));
   shots.forEach((img,i)=>img.setAttribute('aria-hidden',String(i!==now)));
   tabs.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===now)));
  }
 };
 return {render,tabs,measure(){}};
}
