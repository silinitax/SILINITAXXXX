import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { startFluid } from './bg.js';

gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
$('#year').textContent = new Date().getFullYear();

/* liquid background; the studio chapter pours the page into dark */
const fluid = startFluid($('#fluid'), { reduced });
if (!fluid) document.body.style.background = 'linear-gradient(160deg,#eef3fb,#dbe7ff 60%,#efe8ff)';
const studio = $('#studio'), themeMeta = $('meta[name=theme-color]');
let dark = null;
function onScroll() {
  const r = studio.getBoundingClientRect(), vh = innerHeight;
  const next = r.top < vh * .45 && r.bottom > vh * .55;
  if (next !== dark) {
    dark = next;
    document.body.classList.toggle('dark', dark);
    themeMeta.content = dark ? '#050a1c' : '#eef3fb';
    if (fluid) fluid.setDark(dark ? 1 : 0);
  }
  if (fluid) fluid.setScroll(scrollY / Math.max(1, document.documentElement.scrollHeight - vh));
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();

/* entrances: line masks for headings, a short fade-up for supporting blocks */
$$('.lines').forEach(h => $$('.ln', h).forEach((ln, i) => ln.style.setProperty('--i', i)));
$$('.reveal').forEach(el => {
  const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
  el.style.setProperty('--d', Math.min(siblings.indexOf(el), 4) * 0.07 + 's');
});
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); io.unobserve(e.target);
}), { threshold: .2, rootMargin: '0px 0px -8% 0px' });
$$('.reveal, .lines').forEach(el => (el.closest('.hero') ? null : io.observe(el)));
requestAnimationFrame(() => $$('.hero .lines, .hero .reveal').forEach(el => el.classList.add('in')));

/* nav: mark the section in view */
const links = $$('.nav-links a');
const navIO = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  links.forEach(a => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + e.target.id)));
}), { rootMargin: '-45% 0px -50% 0px' });
['app', 'come', 'studio', 'piani'].forEach(id => navIO.observe(document.getElementById(id)));

/* pointer-follow light on glass */
if (fine) $$('.glass').forEach(el => el.addEventListener('pointermove', e => {
  const b = el.getBoundingClientRect();
  el.style.setProperty('--mx', ((e.clientX - b.left) / b.width * 100) + '%');
  el.style.setProperty('--my', ((e.clientY - b.top) / b.height * 100) + '%');
}));

/* hero: the phone enters, then three notifications arrive in order (incasso, quota, scadenza) */
const hp = $('#heroPhone'), pushes = $$('.push', hp);
const today = $('[data-today]', hp);
if (today) today.textContent = new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
if (!reduced) {
  gsap.timeline({ delay: .15 })
    .from(hp, { y: 60, rotationY: -24, rotationX: 8, autoAlpha: 0, duration: 1.4, ease: 'expo.out' })
    .from(pushes, { autoAlpha: 0, y: '-1.2em', scale: .94, duration: .7, ease: 'back.out(1.4)', stagger: .55 }, '-=.5');
  gsap.to('.hero .stage', { y: -50, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  if (fine) {
    const rx = gsap.quickTo(hp, 'rotationX', { duration: .9, ease: 'power3.out' }), ry = gsap.quickTo(hp, 'rotationY', { duration: .9, ease: 'power3.out' });
    addEventListener('pointermove', e => { ry((e.clientX / innerWidth - .5) * 22); rx(-(e.clientY / innerHeight - .5) * 14); }, { passive: true });
  }
}

/* story: the phone stays pinned while the four screens change with scroll */
const story = $('.story'), sp = $('#storyPhone'), steps = $$('.step', story), tabs = $$('.seg button', story);
let current = -1;
function show(i) {
  if (i === current) return; current = i;
  $$('[data-view]', sp).forEach(v => v.classList.toggle('is-on', Number(v.dataset.view) === i));
  $$('[data-tab]', sp).forEach(t => t.classList.toggle('on', Number(t.dataset.tab) === i));
  steps.forEach((s, k) => s.classList.toggle('is-on', k === i));
  tabs.forEach((b, k) => { b.setAttribute('aria-selected', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
}
show(0);
const storyST = ScrollTrigger.create({ trigger: story, start: 'top top', end: 'bottom bottom', onUpdate: self => show(Math.min(3, Math.floor(self.progress * 4))) });
if (!reduced) {
  gsap.timeline({ scrollTrigger: { trigger: story, start: 'top bottom', end: 'bottom bottom', scrub: .6 }, defaults: { ease: 'none' } })
    .fromTo(sp, { rotationY: -22, rotationX: 7, scale: .92 }, { rotationY: 10, rotationX: -3, scale: 1, duration: 1.4 })
    .to(sp, { rotationY: -8, rotationX: 4, duration: 1 })
    .to(sp, { rotationY: 12, rotationX: -2, duration: 1 })
    .to(sp, { rotationY: -4, rotationX: 1, duration: 1 });
}
tabs.forEach((b, i) => {
  b.addEventListener('click', () => scrollTo({ top: storyST.start + (storyST.end - storyST.start) * ((i + .5) / 4), behavior: reduced ? 'auto' : 'smooth' }));
  b.addEventListener('keydown', e => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault(); const n = (i + d + tabs.length) % tabs.length; tabs[n].focus(); tabs[n].click();
  });
});

/* how it works: one progress rail across the three steps (vertical rail on phones) */
const rail = $('.rail'), howSteps = $$('.how-steps li');
if (reduced) { rail.style.setProperty('--p', 1); howSteps.forEach(li => li.classList.add('on')); }
else {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    let marks = [];
    const measure = () => { const r = rail.getBoundingClientRect(); marks = howSteps.map(li => ($('.dot', li).getBoundingClientRect().left - r.left) / r.width); };
    ScrollTrigger.create({
      trigger: '.how-steps', start: 'top 80%', end: 'bottom 60%', scrub: .4, onRefresh: measure,
      onUpdate: self => { rail.style.setProperty('--p', self.progress); howSteps.forEach((li, k) => li.classList.toggle('on', self.progress >= (marks[k] || 0) - .001)); }
    });
    measure();
  });
  mm.add('(max-width: 900px)', () => {
    howSteps.forEach(li => ScrollTrigger.create({ trigger: li, start: 'top 65%', end: 'max', onToggle: self => li.classList.toggle('on', self.isActive) }));
  });
}

/* gentle tilt on plan cards */
if (fine && !reduced) $$('.plan').forEach(el => {
  gsap.set(el, { transformPerspective: 900 });
  const rx = gsap.quickTo(el, 'rotationX', { duration: .5, ease: 'power3.out' }), ry = gsap.quickTo(el, 'rotationY', { duration: .5, ease: 'power3.out' });
  el.addEventListener('pointermove', e => { const b = el.getBoundingClientRect(); ry(((e.clientX - b.left) / b.width - .5) * 6); rx(-((e.clientY - b.top) / b.height - .5) * 6); });
  el.addEventListener('pointerleave', () => { rx(0); ry(0); });
});

document.fonts?.ready.then(() => ScrollTrigger.refresh());
addEventListener('load', () => ScrollTrigger.refresh());
