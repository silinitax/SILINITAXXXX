// Full-screen liquid background: domain-warped noise in a single fragment shader.
// uDark blends the palette from pale pastel to deep navy so the whole page "pours" into the dark chapter.
const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const FS = `precision highp float;
uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uDark;uniform float uScroll;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.02+vec2(3.1,1.7);a*=.5;}return v;}
void main(){
  vec2 p=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);
  p.y+=uScroll*.35;
  float t=uTime*.07;
  vec2 q=vec2(fbm(p*1.1+t),fbm(p*1.1+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p*1.4+2.*q+vec2(1.7,9.2)+.5*t),fbm(p*1.4+2.*q+vec2(8.3,2.8)-.4*t));
  float f=fbm(p*1.2+2.4*r);
  vec2 m=(uMouse-.5)*vec2(uRes.x/uRes.y,1.);
  float d=length(p-m);
  f+=.16*exp(-d*3.2);
  // light palette
  vec3 lb=vec3(.945,.96,.992),l1=vec3(.52,.72,1.),l2=vec3(.76,.68,1.),l3=vec3(.6,.92,1.);
  vec3 lc=mix(lb,l1,smoothstep(.25,.85,f)*.8);
  lc=mix(lc,l2,smoothstep(.45,1.,r.x)*.55);
  lc=mix(lc,l3,smoothstep(.5,1.,q.y)*.45);
  lc+=.07*pow(f,3.);
  // dark palette
  vec3 db=vec3(.012,.025,.07),d1=vec3(.08,.27,.95),d2=vec3(.42,.2,.9),d3=vec3(0.,.55,.9);
  vec3 dc=mix(db,d1,smoothstep(.3,.9,f)*.9);
  dc=mix(dc,d2,smoothstep(.45,1.,r.x)*.7);
  dc=mix(dc,d3,smoothstep(.55,1.,q.y)*.5);
  dc+=.1*pow(f,4.);
  vec3 c=mix(lc,dc,uDark);
  c+=(h(gl_FragCoord.xy+uTime)-.5)*.018;
  gl_FragColor=vec4(c,1.);
}`;

export function startFluid(canvas, { reduced = false } = {}) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return null;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(prog, n);
  const uRes = U('uRes'), uTime = U('uTime'), uMouse = U('uMouse'), uDark = U('uDark'), uScroll = U('uScroll');

  const state = { dark: 0, darkTarget: 0, mx: .5, my: .5, tx: .5, ty: .5, scroll: 0 };
  // The gradient is smooth, so a lower internal resolution is invisible and keeps it cheap.
  const scale = Math.min(devicePixelRatio || 1, 1) * .6;
  function resize() {
    canvas.width = Math.max(2, Math.round(innerWidth * scale)); canvas.height = Math.max(2, Math.round(innerHeight * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  let raf = 0, last = 0, time = 12;
  function frame(now) {
    raf = 0;
    const dt = Math.min(.05, (now - last) / 1000 || 0); last = now; time += dt;
    state.mx += (state.tx - state.mx) * .05; state.my += (state.ty - state.my) * .05;
    state.dark += (state.darkTarget - state.dark) * Math.min(1, dt * 2.6);
    gl.uniform2f(uRes, canvas.width, canvas.height); gl.uniform1f(uTime, time);
    gl.uniform2f(uMouse, state.mx, state.my); gl.uniform1f(uDark, state.dark); gl.uniform1f(uScroll, state.scroll);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!reduced && !document.hidden) raf = requestAnimationFrame(frame);
  }
  const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  addEventListener('resize', () => { resize(); kick(); });
  document.addEventListener('visibilitychange', kick);
  if (!reduced) addEventListener('pointermove', e => { state.tx = e.clientX / innerWidth; state.ty = 1 - e.clientY / innerHeight; }, { passive: true });
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); cancelAnimationFrame(raf); canvas.style.display = 'none'; });
  resize(); kick();
  return {
    setDark(v) { state.darkTarget = v; if (reduced) { state.dark = v; kick(); } },
    setScroll(v) { state.scroll = v; if (reduced) kick(); }
  };
}
