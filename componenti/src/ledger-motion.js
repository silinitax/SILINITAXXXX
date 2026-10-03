import { gsap } from 'gsap';
// Cubic ease-in-out clamped to [a,b]: the same curve remotion's Easing.inOut(Easing.cubic) gave,
// without bundling remotion and React (about 175 KB) for two helpers.
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
export const track=(p,a,b)=>ease(Math.min(1,Math.max(0,(p-a)/(b-a))));
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const mix=(a,b,t)=>a+(b-a)*t;

// Story progress: the phone settles (0 to ENTRY_END), then the camera visits every step of every screen.
// Each step first travels to its target (SAME or SCREEN share of its slot), then holds still so it can be read.
export const ENTRY_END=.05;
const TRAVEL_SAME=.4,TRAVEL_SCREEN=.55;
// The phone screen is 284 x 572 px; the screenshots (390 x 769) fill it by height, cropping a sliver at the sides.
const SCREEN_W=284,SCREEN_H=572,UNIT=SCREEN_H/769,CROP_X=(390-SCREEN_W/UNIT)/2;
const RING_PAD=5,SLIDE_GAP=36; // empty space between two copies sliding past each other

// Steps of the story in order, with their target rectangle and zoom in screen pixels.
function planSteps(screens){
 const steps=[];
 screens.forEach((screen,s)=>screen.beats.forEach((b,i)=>{
  const [rx,ry,rw,rh]=b.ring,x=(rx-CROP_X)*UNIT,y=ry*UNIT,w=rw*UNIT,h=rh*UNIT;
  // Zoom in as far as the highlighted area still fits the screen, never past 1.6 (the screenshots are 2x).
  const z=b.zoom||clamp(Math.min(SCREEN_W/(w+34),(SCREEN_H-70)/(h+20)),1,1.6);
  steps.push({s,i,count:screen.beats.length,x,y,w,h,z,fx:x+w/2,fy:y+h/2,label:screen.label,title:b.title,text:b.text,stat:b.stat});
 }));
 return steps;
}

// Camera: the point (fx,fy) of page s goes to the middle of the phone screen, without ever showing empty space.
function camera(z,s,fx,fy){
 const x=SCREEN_W/2-z*(s*SCREEN_W+fx),y=SCREEN_H/2-z*fy;
 return {z,
  x:Math.min(-z*s*SCREEN_W,Math.max(SCREEN_W-z*(s+1)*SCREEN_W,x)),
  y:Math.min(0,Math.max(SCREEN_H-z*SCREEN_H,y))};
}

// The phone shows real screens of the app. Beside it (below on narrow screens) the explanation of the step
// the camera is on, and on wide screens the key figure of that area written big on the other side.
// Everything is driven by scroll alone; copy and figures slide inside a mask, so nothing is blurred.
export function ledgerExperience(screens,nav){
 const pages=screens.map(({label,src},s)=>`<div class="app-page"><img class="app-shot" src="${src}" alt="Schermata ${label} dell’app SiliniTax, dati dimostrativi" width="390" height="769" decoding="async"><i class="app-ring" aria-hidden="true"></i></div>`).join('');
 const steps=planSteps(screens);
 const copy=steps.map((b,j)=>`<div class="copy-item" aria-hidden="${j!==0}"><span class="copy-eyebrow">${b.label} · ${b.i+1}/${b.count}</span><h3>${b.title}</h3><p>${b.text}</p></div>`).join('');
 const stat=steps.map(b=>`<div class="stat-item"><strong>${b.stat[0]}</strong><span>${b.stat[1]}</span></div>`).join('');
 return `<div class="ledger-phone"><div class="phone-island-ledger"></div><div class="app-status" aria-hidden="true"><span>9:41</span><span class="app-status-icons"><i></i><i></i><b></b></span></div><div class="app-screen"><div class="app-camera"><div class="app-track">${pages}</div></div></div><div class="phone-home-ledger"></div></div><div class="journey-copy"><div class="copy-mask">${copy}</div>${nav}</div><div class="journey-stat" aria-hidden="true"><div class="stat-mask">${stat}</div></div>`;
}

export function createLedgerMotion(section,screens){
 const steps=planSteps(screens),N=steps.length;
 const stage=section.querySelector('.journey-stage'),phone=section.querySelector('.ledger-phone');
 const cam=section.querySelector('.app-camera'),rings=[...section.querySelectorAll('.app-ring')],shots=[...section.querySelectorAll('.app-shot')];
 const copyBox=section.querySelector('.journey-copy'),mask=section.querySelector('.copy-mask'),items=[...section.querySelectorAll('.copy-item')];
 const statBox=section.querySelector('.journey-stat'),statMask=section.querySelector('.stat-mask'),stats=[...section.querySelectorAll('.stat-item')];
 const tabNav=section.querySelector('.journey-tabs'),tabs=[...section.querySelectorAll('[data-stop]')],win=section.querySelector('.journey-window');
 // First and last step of each screen, to keep every ring inside its own screen.
 const first=screens.map((_,s)=>steps.findIndex(b=>b.s===s)),last=screens.map((_,s)=>N-1-[...steps].reverse().findIndex(b=>b.s===s));
 // Still point inside a step, where its travel is over: used by the jump buttons and the reduced-motion view.
 const stops=steps.map((_,j)=>ENTRY_END+(1-ENTRY_END)*((j+.8)/N));
 const fills=new Array(screens.length).fill(-1);
 let active=-1,maskH=0,statH=0,measuredKey='',current=0;

 // Position of the camera along the steps: -1 is the whole first screen, j is step j reached, in between it travels.
 const where=p=>{
  const u=clamp((p-ENTRY_END)/(1-ENTRY_END),0,1),slot=Math.min(N-1,Math.floor(u*N)),f=u*N-slot;
  const crossing=slot>0&&steps[slot].s!==steps[slot-1].s;
  return slot-1+ease(clamp(f/(crossing?TRAVEL_SCREEN:TRAVEL_SAME),0,1));
 };
 const pose=B=>{
  const j=Math.floor(B),t=B-j;
  const a=j<0?{s:0,z:1,fx:SCREEN_W/2,fy:SCREEN_H/2}:steps[j],b=steps[Math.min(N-1,j+1)];
  let z=mix(a.z,b.z,t);
  // Between two screens the camera pulls back while the track slides, then pushes in again.
  if(a.s!==b.s)z=mix(z,1,Math.sin(Math.PI*t));
  return camera(z,mix(a.s,b.s,t),mix(a.fx,b.fx,t),mix(a.fy,b.fy,t));
 };
 const drawRings=B=>rings.forEach((ring,s)=>{
  const dist=Math.max(0,first[s]-B,B-last[s]),opacity=clamp(1-2*dist,0,1);
  if(!opacity){if(ring.style.opacity!=='0')ring.style.opacity='0';return;}
  const at=clamp(B,first[s],last[s]),a=Math.floor(at),b=Math.min(last[s],a+1),t=at-a,A=steps[a],C=steps[b];
  ring.style.cssText=`opacity:${opacity.toFixed(3)};width:${mix(A.w,C.w,t)+2*RING_PAD}px;height:${mix(A.h,C.h,t)+2*RING_PAD}px;transform:translate(${mix(A.x,C.x,t)-RING_PAD}px,${mix(A.y,C.y,t)-RING_PAD}px)`;
 });

 // The tallest copy decides the mask height, so nothing jumps while the steps slide past each other.
 const sizeOf=el=>[...el.children].reduce((n,child)=>n+child.offsetHeight+parseFloat(getComputedStyle(child).marginTop),0);
 const measure=()=>{
  maskH=Math.max(...items.map(sizeOf))+8;mask.style.height=maskH+'px';
  statH=Math.max(...stats.map(sizeOf))+4;statMask.style.height=statH+'px';
  measuredKey=sizeKey();
 };
 const sizeKey=()=>copyBox.clientWidth+'|'+statBox.clientWidth+'|'+innerWidth;

 const render=(p,approach=1,reduced=false)=>{
  const mobile=innerWidth<761,h=innerHeight,w=stage.clientWidth;
  const anchor=reduced?0:h*.25;
  const entry=reduced?1:track(p,0,ENTRY_END);
  const B=where(p),Bc=Math.max(0,B);
  // Phone always centred. Wide screens put the copy on its left and the figure on its right; narrower ones
  // stack the copy under the phone. The width is the one of the stage, so a classic scrollbar does not count.
  const side=!mobile&&w>=1080;
  const fitSide=Math.min(1.2,(h-170)/624);
  const left=side?Math.max(24,w*.06):20,width=side?Math.min(420,w/2-151*fitSide-left-48):Math.min(560,w-40);
  copyBox.classList.toggle('is-stacked',!side);
  copyBox.style.left=(side?left:(w-width)/2)+'px';copyBox.style.width=width+'px';
  // The figure faces the copy across the phone, on the right, and only where there is room for it.
  const sLeft=w/2+151*fitSide+56;
  statBox.classList.toggle('is-off',!side);
  statBox.style.left=sLeft+'px';statBox.style.width=Math.max(200,Math.min(360,w-sLeft-Math.max(24,w*.06)))+'px';
  if(!maskH||sizeKey()!==measuredKey)measure();
  // Stacked, the phone is as big as what is left once the copy has its own room under it (nav 84 + gap 16 + margin 14).
  const fit=side?fitSide:Math.max(.3,Math.min(1,(h-114-copyBox.offsetHeight)/624,(w-60)/302));
  const base=mobile?.68:.95;
  const scale=mix(base,fit,entry);
  const finalTop=side?(h-624*fit)/2:84;
  const top=mix(mobile?-55:-75,finalTop-anchor,entry);
  gsap.set(phone,{scale,transformOrigin:'50% 0%',xPercent:-50,yPercent:0,x:0,y:top,top:0});
  if(win)gsap.set(win,{y:-anchor*entry,left:0,right:0,height:h,borderRadius:0});
  const c=pose(B);
  cam.style.transform=`translate(${c.x.toFixed(2)}px,${c.y.toFixed(2)}px) scale(${c.z.toFixed(4)})`;
  cam.style.setProperty('--z',c.z.toFixed(3));
  drawRings(B);
  const copyTop=side?(h-copyBox.offsetHeight)/2:finalTop+624*fit+16;
  // The progress bar cannot take focus while the copy is still clipped away, or the focus would be invisible.
  if(tabNav.inert!==(entry<1))tabNav.inert=entry<1;
  // Once the story has started nothing is clipped, so the focus ring of the tabs is drawn whole.
  const reveal=entry>=1?'none':`inset(0 0 ${((1-entry)*100).toFixed(2)}% 0)`;
  gsap.set(copyBox,{y:copyTop-anchor,clipPath:reveal});
  const pos=Bc-1+entry;
  items.forEach((item,i)=>gsap.set(item,{y:(i-pos)*(maskH+SLIDE_GAP)}));
  if(side){
   gsap.set(statBox,{y:(h-statH)/2-anchor,clipPath:entry>=1?'none':`inset(0 -80px ${((1-entry)*100).toFixed(2)}% -80px)`});
   stats.forEach((item,i)=>gsap.set(item,{y:(i-pos)*(statH+SLIDE_GAP)}));
  }
  tabs.forEach((b,s)=>{
   const fill=clamp((Bc-first[s]+1)/(last[s]-first[s]+1),0,1);
   if(Math.abs(fill-fills[s])>.002){fills[s]=fill;b.style.setProperty('--fill',fill.toFixed(3));}
  });
  const now=Math.round(Bc);
  if(now!==active){
   active=now;current=now;
   const screen=steps[now].s;
   items.forEach((item,i)=>item.setAttribute('aria-hidden',String(i!==now)));
   shots.forEach((img,i)=>img.setAttribute('aria-hidden',String(i!==screen)));
   tabs.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===screen)));
  }
 };
 return {render,tabs,measure(){maskH=0;},stops,first,current:()=>current,steps:N};
}
