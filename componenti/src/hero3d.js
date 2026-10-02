import { WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Points, BufferGeometry, BufferAttribute, PointsMaterial, CylinderGeometry, TorusGeometry, ExtrudeGeometry, Shape, MeshStandardMaterial, MeshPhysicalMaterial, AmbientLight, DirectionalLight, PointLight, PMREMGenerator, AdditiveBlending, Color } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Decorative 3D layer behind the hero copy: coins, glass slabs and dust.
// It never carries information, so any failure just leaves the CSS background in place.
function slabGeometry(w, h, r, depth) {
  const s = new Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return new ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: .04, bevelSize: .04, bevelSegments: 3, curveSegments: 10 });
}

export function mountHero3D(host, { reduced = false } = {}) {
  let renderer;
  try { renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
  catch { return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  const canvas = renderer.domElement;
  canvas.className = 'hero3d-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.prepend(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, .1, 100);
  camera.position.z = 14;
  const pmrem = new PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), .04).texture;
  scene.environment = envTexture;
  scene.add(new AmbientLight(0x5f7dff, .5));
  const key = new DirectionalLight(0xbcd0ff, 2.2); key.position.set(-4, 6, 8); scene.add(key);
  const rim = new PointLight(0x3d7bff, 60, 30); rim.position.set(6, -2, 4); scene.add(rim);

  const world = new Group(); scene.add(world);
  const goldMat = new MeshStandardMaterial({ color: 0xe2b85a, metalness: 1, roughness: .22 });
  const edgeMat = new MeshStandardMaterial({ color: 0xb98a2f, metalness: 1, roughness: .35 });
  const glassMat = new MeshPhysicalMaterial({ color: 0x2f62ff, metalness: .1, roughness: .12, transparent: true, opacity: .42, clearcoat: 1, clearcoatRoughness: .1, envMapIntensity: 1.4 });
  const glassDark = new MeshPhysicalMaterial({ color: 0x0d1c4a, metalness: .3, roughness: .18, transparent: true, opacity: .7, clearcoat: 1, envMapIntensity: 1.2 });

  const coinGeo = new CylinderGeometry(1, 1, .16, 56);
  const rimGeo = new TorusGeometry(.97, .045, 12, 56);
  const items = [];
  function coin(x, y, z, s, spin) {
    const g = new Group();
    const body = new Mesh(coinGeo, goldMat); body.rotation.x = Math.PI / 2;
    const ring = new Mesh(rimGeo, edgeMat);
    ring.position.z = .08; const ring2 = ring.clone(); ring2.position.z = -.08;
    g.add(body, ring, ring2);
    g.position.set(x, y, z); g.scale.setScalar(s);
    g.userData = { base: [x, y, z], spin, phase: Math.random() * 6.28, depth: z };
    world.add(g); items.push(g); return g;
  }
  function slab(x, y, z, w, h, mat, rotation) {
    const m = new Mesh(slabGeometry(w, h, .22, .08), mat);
    m.position.set(x, y, z); m.rotation.set(...rotation);
    m.userData = { base: [x, y, z], spin: .05, phase: Math.random() * 6.28, depth: z, tilt: rotation };
    world.add(m); items.push(m); return m;
  }
  // Left cluster, right cluster. Coordinates are scaled by the visible half-width on resize.
  coin(-5.6, 1.6, 0, .78, .5); coin(-4.5, -1.3, 1.4, .5, -.7); coin(-6.5, -1.1, -1.2, .42, .4);
  coin(5.5, 2.0, .5, .55, -.55); coin(6.2, -.8, 0, .85, .45); coin(4.6, -2.0, 1.6, .38, .8);
  slab(-4.1, 2.3, -1.6, 2.3, 1.5, glassMat, [.3, .5, -.2]);
  slab(4.4, .5, -1.4, 2.6, 1.7, glassDark, [-.2, -.5, .18]);
  slab(-6.2, -2.4, -2.2, 1.9, 1.2, glassMat, [.1, .6, .3]);

  const count = 380, pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) { pos[i * 3] = (Math.random() - .5) * 30; pos[i * 3 + 1] = (Math.random() - .5) * 14; pos[i * 3 + 2] = -6 + Math.random() * 10; }
  const dustGeo = new BufferGeometry(); dustGeo.setAttribute('position', new BufferAttribute(pos, 3));
  const dust = new Points(dustGeo, new PointsMaterial({ color: new Color(0x8fb1ff), size: .045, transparent: true, opacity: .75, blending: AdditiveBlending, depthWrite: false }));
  scene.add(dust);

  let w = 0, h = 0, spread = 1, visible = true, raf = 0, lost = false;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const scrollState = { y: 0 };
  function resize() {
    const rect = host.getBoundingClientRect();
    w = Math.max(1, Math.round(rect.width)); h = Math.max(1, Math.round(rect.height));
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    const halfW = Math.tan(camera.fov * Math.PI / 360) * camera.position.z * camera.aspect;
    spread = halfW / 8.2;
    const k = Math.min(1, Math.max(.55, spread));
    world.scale.setScalar(k);
    const narrow = w < 761;
    items.forEach(o => {
      o.userData.x = o.userData.base[0] * spread / k * (narrow ? 1.25 : 1);
      // On phones keep only the coins at the screen edges so the headline stays clear.
      o.visible = !narrow || (!o.userData.tilt && Math.abs(o.userData.x) > 3.2);
    });
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    draw(0);
  }
  function draw(t) {
    if (lost) return;
    pointer.x += (pointer.tx - pointer.x) * .06; pointer.y += (pointer.ty - pointer.y) * .06;
    const sy = scrollState.y;
    world.rotation.y = pointer.x * .22; world.rotation.x = -pointer.y * .12;
    world.position.y = sy * .004;
    items.forEach(o => {
      const u = o.userData, f = 1 + u.depth * .09;
      o.position.y = u.base[1] + Math.sin(t * .0007 + u.phase) * .22 + sy * .0035 * f;
      o.position.x = u.x + pointer.x * .35 * f;
      if (u.tilt) { o.rotation.x = u.tilt[0] + Math.sin(t * .0005 + u.phase) * .08 + pointer.y * .1; o.rotation.y = u.tilt[1] + pointer.x * .25 + Math.sin(t * .0004 + u.phase) * .1; }
      else { o.rotation.y = t * .0006 * u.spin + u.phase; o.rotation.x = .5 + Math.sin(t * .0005 + u.phase) * .35 + sy * .0012; }
    });
    dust.rotation.y = t * .00004 + pointer.x * .05; dust.position.y = sy * .0012;
    renderer.render(scene, camera);
  }
  function loop(t) { raf = 0; if (!visible || document.hidden) return; draw(t); raf = requestAnimationFrame(loop); }
  function start() { if (!raf && !reduced) raf = requestAnimationFrame(loop); }

  const onMove = e => { pointer.tx = e.clientX / innerWidth * 2 - 1; pointer.ty = e.clientY / innerHeight * 2 - 1; };
  const onScroll = () => { scrollState.y = scrollY; };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }, { threshold: 0 });
  io.observe(host);
  const ro = new ResizeObserver(resize); ro.observe(host);
  if (!reduced) { addEventListener('pointermove', onMove, { passive: true }); addEventListener('scroll', onScroll, { passive: true }); }
  document.addEventListener('visibilitychange', start);
  const onLost = e => { lost = true; e.preventDefault(); canvas.remove(); host.classList.remove('has-hero3d'); };
  canvas.addEventListener('webglcontextlost', onLost);
  resize(); host.classList.add('has-hero3d'); start();

  return {
    dispose() {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      removeEventListener('pointermove', onMove); removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', start);
      canvas.removeEventListener('webglcontextlost', onLost);
      [coinGeo, rimGeo, dustGeo, goldMat, edgeMat, glassMat, glassDark, envTexture].forEach(x => x.dispose());
      items.forEach(o => o.geometry && o.geometry.dispose());
      pmrem.dispose(); renderer.dispose(); canvas.remove();
    }
  };
}
