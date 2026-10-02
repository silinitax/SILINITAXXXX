import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { startFluid } from './bg.js';

gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
$('#year').textContent = new Date().getFullYear();

/* liquid background + dark chapter */
const fluid = startFluid($('#fluid'), { reduced });
if (!fluid) document.body.style.background = 'linear-gradient(160deg,#eef3fb,#dbe7ff 60%,#efe8ff)';
const studio = $('#studio');
function onScroll() {
  const r = studio.getBoundingClientRect(), vh = innerHeight;
  const dark = r.top < vh * .45 && r.bottom > vh * .55;
  document.body.classList.toggle('dark', dark);
  document.querySelector('meta[name=theme-color]').content = dark ? '#050a1c' : '#eef3fb';
  if (fluid) { fluid.setDark(dark ? 1 : 0); fluid.setScroll(scrollY / Math.max(1, document.body.scrollHeight - vh)); }
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();

/* reveal on view */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); e.target.parentElement?.classList.add('in'); io.unobserve(e.target); } }), { threshold: .18, rootMargin: '0px 0px -6% 0px' });
$$('.reveal').forEach((el, i) => { el.style.setProperty('--d', (i % 4) * 0.08 + 's'); io.observe(el); });
$$('.hero .reveal').forEach((el, i) => setTimeout(() => el.classList.add('in'), 150 + i * 120));

/* pointer-follow specular light on glass */
$$('.glass').forEach(el => {
  el.addEventListener('pointermove', e => {
    const b = el.getBoundingClientRect();
    el.style.setProperty('--mx', ((e.clientX - b.left) / b.width * 100) + '%');
    el.style.setProperty('--my', ((e.clientY - b.top) / b.height * 100) + '%');
  });
});

/* hero phone: 3D tilt that follows the pointer, chips drift at different depths */
const stage = $('#heroStage'), hp = $('#heroPhone');
if (fine && !reduced) {
  const chips = $$('.chip', hp);
  const rx = gsap.quickTo(hp, 'rotationX', { duration: .9, ease: 'power3.out' }), ry = gsap.quickTo(hp, 'rotationY', { duration: .9, ease: 'power3.out' });
  addEventListener('pointermove', e => {
    const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
    ry(nx * 26); rx(-ny * 18);
    chips.forEach(c => gsap.to(c, { x: nx * -Number(c.dataset.depth) * .7, y: ny * -Number(c.dataset.depth) * .5, duration: 1.1, ease: 'power3.out', overwrite: 'auto' }));
  }, { passive: true });
}
if (!reduced) {
  gsap.from(hp, { y: 90, rotationY: -28, rotationX: 10, opacity: 0, duration: 1.6, ease: 'expo.out', delay: .15 });
  // scroll: the hero phone drifts back and tilts away as the story begins
  gsap.to('#heroStage', { y: -70, scale: .94, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
}

/* story: pinned phone, four screens, driven by scroll */
const story = $('.story'), views = $$('[data-view]', story), steps = $$('.step', story), tabs = $$('.seg button', story), tabbar = $$('#storyPhone [data-tab]');
let current = -1;
function show(i) {
  if (i === current) return; current = i;
  $$('#storyPhone [data-view]').forEach(v => v.classList.toggle('is-on', Number(v.dataset.view) === i));
  steps.forEach((s, k) => s.classList.toggle('is-on', k === i));
  tabs.forEach((b, k) => b.setAttribute('aria-selected', String(k === i)));
  tabbar.forEach(t => t.classList.toggle('on', Number(t.dataset.tab) === i));
}
show(0);
const sp = $('#storyPhone');
let storyST;
if (!reduced) {
  const tl = gsap.timeline({ scrollTrigger: { trigger: story, start: 'top top', end: 'bottom bottom', scrub: .6, onUpdate: self => show(Math.min(3, Math.floor(self.progress * 4 - .0001 + .12))) }, defaults: { ease: 'none' } });
  storyST = tl.scrollTrigger;
  tl.fromTo(sp, { rotationY: -24, rotationX: 8, scale: .9 }, { rotationY: 14, rotationX: -4, scale: 1.04, duration: 1 }, 0)
    .to(sp, { rotationY: -10, rotationX: 5, scale: 1, duration: 1 }, 1)
    .to(sp, { rotationY: 16, rotationX: -3, scale: 1.04, duration: 1 }, 2)
    .to(sp, { rotationY: -6, rotationX: 2, scale: 1, duration: 1 }, 3);
} else {
  ScrollTrigger.create({ trigger: story, start: 'top top', end: 'bottom bottom', onUpdate: self => show(Math.min(3, Math.floor(self.progress * 4))) });
}
tabs.forEach((b, i) => b.addEventListener('click', () => {
  if (storyST) scrollTo({ top: storyST.start + (storyST.end - storyST.start) * ((i + .5) / 4), behavior: reduced ? 'auto' : 'smooth' });
  else show(i);
}));

/* bento / plan cards: gentle 3D tilt on hover */
if (fine && !reduced) {
  $$('.tilt').forEach(el => {
    const rx = gsap.quickTo(el, 'rotationX', { duration: .6, ease: 'power3.out' }), ry = gsap.quickTo(el, 'rotationY', { duration: .6, ease: 'power3.out' });
    gsap.set(el, { transformPerspective: 900 });
    el.addEventListener('pointermove', e => { const b = el.getBoundingClientRect(); ry(((e.clientX - b.left) / b.width - .5) * 8); rx(-((e.clientY - b.top) / b.height - .5) * 8); });
    el.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}
addEventListener('load', () => ScrollTrigger.refresh());
