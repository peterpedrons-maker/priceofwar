// Abertura de booster em 3D (mockup aprovado: public/mockups/abertura-booster/, docs/animacoes.md): o pacote cai, carrega energia, rasga, as cartas sobem, abrem em leque
// e são viradas uma a uma (da menos rara para a melhor); se a melhor for forte, ela ganha aproximação e explosão dourada. Three.js + GSAP, só enquanto dura.
// Um único relógio T comanda timeline, partículas, luzes e câmera. Sem som (decisão do dono: os sons virão depois, escolhidos por ele).
import * as THREE from 'three';
import gsap from 'gsap';
import type { Shine, Rarity } from './rarity';
import { stampCode } from './cardCode3d';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

// Sem legenda de raridade (decisão do dono): quem diz que a carta é especial é só o efeito dela aparecendo na tela.
export type OpenCard = { name: string; code?: string; faceUrl: string | null; rarity: Rarity; isFullArt: boolean; shine: Shine };
export type OpenOpts = { packUrl: string | null; accent: string; backUrl: string; cards: OpenCard[]; onFinished: () => void; onInspect?: (index: number) => void };
const HALO: Record<Rarity, number> = { comum: 0xcfd8ff, rara: 0x5ab4ff, ultra: 0xffc85a, secreta: 0xff7ad9 };
// retângulos (em uv, v de baixo para cima) da arte e do nome nas imagens de src/assets/card3d
const ART_RECT = [0.148, 0.469, 0.857, 0.828], NAME_RECT_STD = [0.215, 0.838, 0.685, 0.893], NAME_RECT_FULL = [0.17, 0.86, 0.72, 0.912];

export function playBoosterOpening(host: HTMLElement, o: OpenOpts): { destroy: () => void } {
  const W = host.clientWidth, H = host.clientHeight; let seed = 7, dead = false;
  const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const R = (a: number, b: number) => a + (b - a) * rnd();
  const low = (window.devicePixelRatio || 1) > 2.2 || W * H > 1.3e6;   // aparelho "pesado": menos resolução
  const renderer = new THREE.WebGLRenderer({ antialias: !low, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, low ? 1.5 : 2)); renderer.setSize(W, H); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05; renderer.setClearColor(0x07060a, 0);
  renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%'; host.appendChild(renderer.domElement);
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(32, W / H, .1, 60); cam.position.set(0, 0, 10);
  const composer = new EffectComposer(renderer); composer.setSize(W, H); composer.addPass(new RenderPass(scene, cam));
  const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), .28, .7, .78); composer.addPass(bloom); composer.addPass(new OutputPass());
  const cv = (w: number, h: number, fn: (g: CanvasRenderingContext2D, w: number, h: number) => void) => { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d')!, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
  const haloTex = cv(256, 256, (g, w, h) => { const r = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.25, 'rgba(255,255,255,.45)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, w, h); });
  const ringTex = cv(256, 256, (g, w, h) => { const r = g.createRadialGradient(w / 2, h / 2, w * .3, w / 2, h / 2, w / 2); r.addColorStop(0, 'rgba(255,255,255,0)'); r.addColorStop(.7, 'rgba(255,255,255,.9)'); r.addColorStop(.85, 'rgba(255,255,255,.25)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, w, h); });
  const raysTex = (n: number, sd: number) => cv(512, 512, (g, w) => { g.translate(w / 2, w / 2); let s = sd; const rr = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + rr() * .2, wd = .03 + rr() * .07, len = w * (.32 + rr() * .18), gr = g.createLinearGradient(0, 0, Math.cos(a) * len, Math.sin(a) * len); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a - wd) * len, Math.sin(a - wd) * len); g.lineTo(Math.cos(a + wd) * len, Math.sin(a + wd) * len); g.closePath(); g.fill(); } });
  const bgTex = cv(256, 512, (g, w, h) => { const r = g.createRadialGradient(w / 2, h * .46, 8, w / 2, h * .46, h * .7); r.addColorStop(0, '#2a2118'); r.addColorStop(.5, '#120e0c'); r.addColorStop(1, '#050407'); g.fillStyle = r; g.fillRect(0, 0, w, h); });
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(26, 46), new THREE.MeshBasicMaterial({ map: bgTex, toneMapped: false })); bg.position.z = -9; scene.add(bg);
  const additive = (tex: THREE.Texture, color: number, opacity = 1) => new THREE.MeshBasicMaterial({ map: tex, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  const raysA = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), additive(raysTex(18, 11), 0xffd27a, 0)), raysB = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), additive(raysTex(26, 29), 0xfff0c0, 0));
  raysA.position.z = raysB.position.z = -1.2; scene.add(raysA, raysB);
  const coreGlow = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), additive(haloTex, 0xffc060, 0)); coreGlow.position.z = -.9; scene.add(coreGlow);
  scene.add(new THREE.AmbientLight(0xfff1dc, .85)); const key = new THREE.DirectionalLight(0xfff0d8, 1.7); key.position.set(-3, 4, 6); scene.add(key);
  const rim = new THREE.PointLight(0xffd080, 14, 14, 1.6); rim.position.set(2.5, 1, 3); scene.add(rim);
  const inner = new THREE.PointLight(0xffb040, 0, 9, 1.4); inner.position.set(0, .2, -.2); scene.add(inner);
  // partículas
  const MAXP = low ? 1100 : 2000, P: any[] = [];
  const pg = new THREE.BufferGeometry(), pPos = new Float32Array(MAXP * 3), pCol = new Float32Array(MAXP * 3), pSize = new Float32Array(MAXP), pAlpha = new Float32Array(MAXP);
  pg.setAttribute('position', new THREE.BufferAttribute(pPos, 3)); pg.setAttribute('color', new THREE.BufferAttribute(pCol, 3)); pg.setAttribute('size', new THREE.BufferAttribute(pSize, 1)); pg.setAttribute('alpha', new THREE.BufferAttribute(pAlpha, 1));
  const pm = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, uniforms: { k: { value: H / 2 } },
    vertexShader: 'attribute float size;attribute float alpha;attribute vec3 color;varying float vA;varying vec3 vC;uniform float k;void main(){vA=alpha;vC=color;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=size*k/-mv.z;gl_Position=projectionMatrix*mv;}',
    fragmentShader: 'varying float vA;varying vec3 vC;void main(){float d=length(gl_PointCoord-.5)*2.;float a=exp(-d*d*3.2)*vA;if(a<.01)discard;gl_FragColor=vec4(vC*a*1.6,a);}' });
  const points = new THREE.Points(pg, pm); points.frustumCulled = false; points.renderOrder = 50; scene.add(points);
  const col = new THREE.Color();
  const emit = (n: number, f: any) => { for (let i = 0; i < n && P.length < MAXP; i++) { const p = typeof f === 'function' ? f() : f; col.set(p.c ?? 0xffd890); P.push({ x: p.x, y: p.y, z: p.z ?? 0, vx: p.vx ?? 0, vy: p.vy ?? 0, vz: p.vz ?? 0, g: p.g ?? 0, drag: p.drag ?? .98, life: p.life ?? 1, age: 0, s: p.s ?? .1, r: col.r, gg: col.g, b: col.b, a: p.a ?? 1 }); } };
  const simP = (dt: number) => { for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; p.age += dt; if (p.age >= p.life) { P.splice(i, 1); continue; } const k = Math.pow(p.drag, dt * 60); p.vx *= k; p.vy *= k; p.vz *= k; p.vy -= p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; } };
  const uploadP = () => { let i = 0; for (const p of P) { const u = p.age / p.life, f = u < .12 ? u / .12 : 1 - (u - .12) / .88; pPos[i * 3] = p.x; pPos[i * 3 + 1] = p.y; pPos[i * 3 + 2] = p.z; pCol[i * 3] = p.r; pCol[i * 3 + 1] = p.gg; pCol[i * 3 + 2] = p.b; pSize[i] = p.s; pAlpha[i] = p.a * Math.max(0, f); i++; } for (; i < MAXP; i++) pAlpha[i] = 0; for (const a of ['position', 'color', 'size', 'alpha']) (pg.attributes as any)[a].needsUpdate = true; };
  const burst = (x: number, y: number, z: number, n: number, c: number, sp = 4, size = .09, life = 1.1, g = 2.2) => emit(n, () => { const a = R(0, 6.283), e = R(-.5, 1), v = R(sp * .3, sp); return { x, y, z, vx: Math.cos(a) * v * (1 - Math.abs(e) * .3), vy: Math.sin(a) * v * (1 - Math.abs(e) * .3) + R(0, 1), vz: R(-.5, 1.5), g, drag: .965, life: R(life * .5, life), s: R(size * .5, size), c, a: 1 }; });
  let tNow = 0; const rings: { m: THREE.Mesh; t0: number; dur: number; size: number }[] = [];
  const shock = (x: number, y: number, z: number, color: number, size: number, dur = .8) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), additive(ringTex, color, 1)); m.position.set(x, y, z); m.scale.setScalar(.2); scene.add(m); rings.push({ m, t0: tNow, dur, size }); };
  const stepRings = () => { for (let i = rings.length - 1; i >= 0; i--) { const r = rings[i], u = (tNow - r.t0) / r.dur; if (u >= 1) { scene.remove(r.m); (r.m.material as THREE.Material).dispose(); rings.splice(i, 1); continue; } const e = 1 - Math.pow(1 - Math.max(0, u), 3); r.m.scale.setScalar(.2 + r.size * e); (r.m.material as THREE.MeshBasicMaterial).opacity = (1 - u) * (1 - u); } };

  // pacote
  const PW = 1.8, PH = 3.1, SEAM = PH / 2 - PH * .093;
  const jag = (x: number) => .05 * (Math.abs(((x * 7.3 + 5) % 1) * 2 - 1) - .5) + .02 * Math.sin(x * 23);
  const panel = (y0: number, y1: number, nx: number, ny: number, jb: boolean, jt: boolean) => {
    const g = new THREE.BufferGeometry(), pos: number[] = [], uv: number[] = [], idx: number[] = [];
    for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) { const x = (i / nx - .5) * PW; let y = y0 + (y1 - y0) * j / ny; if (j === 0 && jb) y += jag(x); if (j === ny && jt) y += jag(x); const z = .13 * (1 - Math.pow(2 * x / PW, 2)) + .07 * (1 - Math.pow(2 * y / PH, 2)); pos.push(x, y, z); uv.push(x / PW + .5, y / PH + .5); }
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1; idx.push(a, b, c, b, d, c); }
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g;
  };
  const loader = new THREE.TextureLoader(); const tex = (u: string) => new Promise<THREE.Texture | null>(res => loader.load(u, t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; res(t); }, undefined, () => res(null)));
  const pack = new THREE.Group(); scene.add(pack); const cardsG = new THREE.Group(); scene.add(cardsG);
  let packMat: THREE.MeshPhysicalMaterial, strip: THREE.Mesh, slit: THREE.Mesh; const cards: { g: THREE.Group; fm: THREE.MeshStandardMaterial; sm: THREE.ShaderMaterial; halo: THREE.Mesh; front: THREE.Mesh; info: OpenCard }[] = [];
  const N = o.cards.length;
  // Layout of the taps: the closed pile in the middle, the card being shown in front of it, and the cards already seen in a row at the bottom; at the end all of them are lined up.
  const visW = 2 * Math.tan(16 * Math.PI / 180) * 10 * (W / H), PILE_Y = .5, CARD_W = 1.5;
  const rowSp = Math.min(.62, (visW - .15) / Math.max(1, N)), rowS = rowSp * .9 / CARD_W;
  const rowSlot = (i: number) => ({ x: (i - (N - 1) / 2) * rowSp, y: -1.95, s: rowS });
  const cols = visW < 4.2 ? Math.min(3, N) : N, gridSp = Math.min(.98, (visW - .2) / cols), gridS = gridSp * .92 / CARD_W;
  const gridSlot = (i: number) => { const r = Math.floor(i / cols), n = Math.min(cols, N - r * cols), rows = Math.ceil(N / cols), gap = CARD_W * 1.343 * gridS * 1.08; return { x: (i % cols - (n - 1) / 2) * gridSp, y: .3 + ((rows - 1) / 2 - r) * gap, s: gridS }; };
  const sheenMat = (map: THREE.Texture | null, color: number, info: OpenCard) => {
    // brilho por raridade: a arte, as letras do nome (só onde o texto difere da placa) ou a carta inteira
    let plate = .5; const nameRect = info.isFullArt ? NAME_RECT_FULL : NAME_RECT_STD;
    try { if (map?.image) { const im = map.image as HTMLImageElement, c = document.createElement('canvas'); c.width = 64; c.height = 64; const g = c.getContext('2d', { willReadFrequently: true })!; const W0 = im.width, H0 = im.height; g.drawImage(im, nameRect[0] * W0, (1 - nameRect[3]) * H0, (nameRect[2] - nameRect[0]) * W0, (nameRect[3] - nameRect[1]) * H0, 0, 0, 64, 64); const d = g.getImageData(0, 0, 64, 64).data; const ls: number[] = []; for (let i = 0; i < d.length; i += 4) ls.push(d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11); ls.sort((a, b) => a - b); plate = ls[Math.floor(ls.length * .7)] / 255; } } catch { /* sem leitura: usa .5 */ }
    return new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { map: { value: map }, t: { value: 0 }, amt: { value: 0 }, tint: { value: new THREE.Color(HALO[info.rarity]) }, art: { value: info.shine === 'art' || info.shine === 'art+name' ? 1 : 0 }, name: { value: info.shine === 'name' || info.shine === 'art+name' ? 1 : 0 }, card: { value: info.shine === 'card' ? 1 : 0 }, artRect: { value: new THREE.Vector4(...ART_RECT) }, nameRect: { value: new THREE.Vector4(...nameRect) }, plate: { value: plate }, ultra: { value: info.rarity === 'ultra' || info.rarity === 'secreta' ? 1 : 0 } },
      vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'varying vec2 vUv;uniform sampler2D map;uniform float t,amt,art,name,card,plate,ultra;uniform vec3 tint;uniform vec4 artRect,nameRect;float inR(vec2 uv,vec4 r){return step(r.x,uv.x)*step(uv.x,r.z)*step(r.y,uv.y)*step(uv.y,r.w);}void main(){vec4 c=texture2D(map,vUv);if(c.a<.5)discard;float lum=dot(c.rgb,vec3(.3,.59,.11));float letters=inR(vUv,nameRect)*smoothstep(.09,.26,abs(lum-plate));float m=card+art*inR(vUv,artRect)+name*letters;if(m<.01)discard;float d=vUv.x*.8+vUv.y*.6;float band=smoothstep(.0,.5,sin((d-t)*6.2832*1.2)*.5+.5);band=pow(band,3.);vec3 rb=.5+.5*cos(6.2832*(vec3(0.,.33,.67)+d*1.5-t*2.));vec3 col=mix(tint,rb,.25+.5*ultra)*(.2+band*(.6+.3*ultra))*amt*min(m,1.)*(1.-.45*card);gl_FragColor=vec4(col,min(m,1.)*amt*.6);}' });
  };
  // The cards come out of the pack's opening: while they are inside it, only what is above its torn top edge is drawn (clipping plane that follows the pack).
  renderer.localClippingEnabled = true; const clip = new THREE.Plane(new THREE.Vector3(0, 1, 0), -SEAM);
  const S = { charge: 0, flash: 0, rays: 0, bloom: .28, shake: 0, camZ: 10, camY: 0, glow: 0, hover: 0 };
  let tl: gsap.core.Timeline, END = 9, lastT = -1, finished = false, raf = 0, ready = false;
  const lastIdx = N - 1, big = o.cards[lastIdx]?.rarity === 'ultra' || o.cards[lastIdx]?.rarity === 'secreta';
  const SHINE_AMT = (r: Rarity) => (r === 'comum' ? 0 : r === 'rara' ? .55 : .9);
  const flashEl = document.createElement('div'); flashEl.style.cssText = 'position:absolute;inset:0;background:#fff8e0;opacity:0;pointer-events:none;mix-blend-mode:screen'; host.appendChild(flashEl);

  const build = async () => {
    const [packTex, back, ...faces] = await Promise.all([o.packUrl ? tex(o.packUrl) : Promise.resolve(null), tex(o.backUrl), ...o.cards.map(c => c.faceUrl ? tex(c.faceUrl).then(t => (t ? stampCode(t, c.code, c.isFullArt) : t)) : Promise.resolve(null))]);
    if (dead) return;
    const pTex = packTex ?? cv(256, 440, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, o.accent); gr.addColorStop(1, '#2a1a0c'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 0, w, h * .09); g.fillRect(0, h * .91, w, h * .09); });
    packMat = new THREE.MeshPhysicalMaterial({ map: pTex, roughness: .36, metalness: .28, clearcoat: .85, clearcoatRoughness: .22, side: THREE.DoubleSide, alphaTest: .3, emissive: 0xffcf80, emissiveMap: pTex, emissiveIntensity: 0 });
    const body = new THREE.Mesh(panel(-PH / 2, SEAM, 22, 40, false, true), packMat); strip = new THREE.Mesh(panel(SEAM, PH / 2, 22, 5, true, false), packMat); strip.position.z = .001; pack.add(body, strip);
    slit = new THREE.Mesh(new THREE.PlaneGeometry(PW * .96, .5), additive(haloTex, 0xffe6a0, 0)); slit.position.set(0, SEAM, .2); pack.add(slit);
    faces.forEach((ft, i) => {
      const CW = 1.5, aspect = ft ? ft.image.height / ft.image.width : 1.343, CH = CW * aspect, g = new THREE.Group(), tier = o.cards[i].rarity;
      const faceTex = ft ?? back!;
      const fm = new THREE.MeshStandardMaterial({ map: faceTex, roughness: .5, metalness: .08, alphaTest: .4, emissive: 0xffffff, emissiveMap: faceTex, emissiveIntensity: 0, clippingPlanes: [clip] });
      const bm = new THREE.MeshStandardMaterial({ map: back, roughness: .55, metalness: .1, alphaTest: .4, clippingPlanes: [clip] });
      const front = new THREE.Mesh(new THREE.PlaneGeometry(CW, CH), fm); front.position.z = .004;
      const bk = new THREE.Mesh(new THREE.PlaneGeometry(CW, CH), bm); bk.rotation.y = Math.PI; bk.position.z = -.004;
      const sm = sheenMat(ft, 0, o.cards[i]); const sheen = new THREE.Mesh(new THREE.PlaneGeometry(CW, CH), sm); sheen.position.z = .008;
      const halo = new THREE.Mesh(new THREE.PlaneGeometry(CW * 2.1, CH * 1.8), additive(haloTex, HALO[tier], 0)); halo.position.z = -.05;
      (halo.material as THREE.Material).clippingPlanes = [clip];
      g.add(halo, bk, front, sheen); g.visible = false; cardsG.add(g); cards.push({ g, fm, sm, halo, front, info: o.cards[i] });
    });
  };
  const makeTimeline = () => {
    tl = gsap.timeline({ paused: true });
    tl.fromTo(pack.position, { y: 6.5 }, { y: 0, duration: 1.05, ease: 'elastic.out(1,.55)' }, 0);
    tl.fromTo(pack.rotation, { z: .5, y: -.4, x: 0 }, { z: 0, y: 0, duration: 1.1, ease: 'power3.out' }, 0);
    tl.call(() => { burst(0, -1.6, .5, 26, 0xffe2a0, 3.2, .08, .9, 3); S.shake = Math.max(S.shake, .05); }, undefined, .42);
    tl.fromTo(S, { charge: 0 }, { charge: 1, duration: 2.1, ease: 'power2.in' }, 1.1);
    tl.fromTo(S, { rays: 0 }, { rays: .55, duration: 2.1, ease: 'power2.in' }, 1.1);
    tl.fromTo(S, { hover: 0 }, { hover: 1, duration: 2.1, ease: 'sine.inOut' }, 1.1);
    tl.fromTo(S, { bloom: .28 }, { bloom: .5, duration: 2.1, ease: 'power2.in' }, 1.1);
    tl.call(() => { burst(0, SEAM, .4, 90, 0xfff0b0, 6.5, .12, 1.4, 1.6); burst(0, SEAM, .4, 40, 0xffffff, 3.5, .18, .8, 0); shock(0, SEAM, .5, 0xfff0c0, 5.2, .9); shock(0, SEAM, .45, 0xffc060, 3.4, .6); S.shake = .1; }, undefined, 3.2);
    tl.fromTo(S, { flash: 0 }, { flash: .5, duration: .08, ease: 'power2.out' }, 3.2).to(S, { flash: 0, duration: .55, ease: 'power2.in' }, 3.29);
    tl.to(S, { bloom: .65, duration: .1 }, 3.2).to(S, { bloom: .4, duration: 1.2, ease: 'power2.out' }, 3.3);
    tl.to(S, { rays: 1, duration: .15 }, 3.2).to(S, { rays: .5, duration: 1.8 }, 3.35).to(S, { shake: 0, duration: .5 }, 3.25);
    tl.fromTo(S, { camZ: 10 }, { camZ: 9.2, duration: .12, ease: 'power2.out' }, 3.2).to(S, { camZ: 10, duration: 1.1, ease: 'power2.inOut' }, 3.32);
    tl.fromTo(strip.position, { x: 0, y: 0, z: .001 }, { x: 1.9, y: 3.4, z: 2.2, duration: 1.15, ease: 'power2.out' }, 3.2);
    tl.fromTo(strip.rotation, { x: 0, y: 0, z: 0 }, { x: 3.4, y: 1.4, z: 2.2, duration: 1.15, ease: 'power1.out' }, 3.2);
    tl.fromTo(strip.scale, { x: 1, y: 1, z: 1 }, { x: .7, y: .7, z: .7, duration: 1.15 }, 3.2);
    tl.fromTo((slit.material as THREE.Material), { opacity: 0 }, { opacity: 1, duration: .1 }, 3.2).to(slit.material, { opacity: 0, duration: 1.4 }, 3.4);
    cards.forEach((c, i) => {
      tl.set(c.g, { visible: true }, 3.28);
      const cx0 = (i - (N - 1) / 2) * .06;
      tl.fromTo(c.g.position, { x: 0, y: -.5, z: -.06 - i * .004 }, { x: cx0, y: 1.55 + i * .05, z: -.06 - i * .004, duration: .85, ease: 'power3.out' }, 3.42 + i * .1);
      tl.fromTo(c.g.rotation, { x: 0, y: Math.PI, z: 0 }, { x: 0, y: Math.PI, z: (i - (N - 1) / 2) * .06, duration: .85, ease: 'power2.out' }, 3.42 + i * .1);
      tl.fromTo(c.g.scale, { x: .72, y: .72, z: .72 }, { x: .85, y: .85, z: .85, duration: .85, ease: 'power2.out' }, 3.42 + i * .1);
    });
    const T5 = 3.42 + (N - 1) * .1 + .85 + .3;   // as cartas terminaram de subir
    tl.to(pack.position, { y: -7.5, duration: .8, ease: 'power2.in' }, T5).to(pack.rotation, { z: -.5, x: .4, duration: .8, ease: 'power1.in' }, T5);
    tl.to(S, { rays: .22, duration: 1, ease: 'power1.out' }, T5 + .3);
    // the pack is gone: the cards close into one face-down pile (first card to be turned on top)
    cards.forEach((c, i) => { const d = T5 + .55; tl.to(c.g.position, { x: 0, y: PILE_Y, z: .03 + (N - 1 - i) * .012, duration: .6, ease: 'power3.inOut' }, d); tl.to(c.g.rotation, { z: ((i * 37) % 7 - 3) * .006, duration: .6, ease: 'power3.inOut' }, d); tl.to(c.g.scale, { x: 1, y: 1, z: 1, duration: .6, ease: 'power3.inOut' }, d); });
    END = T5 + 1.3; tl.set({}, {}, END);
  };
  // ── from here on the player drives it, one tap per card ──
  let phase: 'intro' | 'pile' | 'busy' | 'shown' | 'done' = 'intro', next = 0;
  const hint = document.createElement('div'); hint.style.cssText = "position:absolute;left:0;right:0;top:7%;text-align:center;font-family:'Cinzel',serif;letter-spacing:.2em;font-size:13px;color:#f3e7c6;text-shadow:0 1px 3px #000;pointer-events:none;opacity:0;transition:opacity .4s"; host.appendChild(hint);
  const setHint = (t: string) => { hint.textContent = t; hint.style.opacity = t ? '1' : '0'; };
  const toSlot = (i: number, slot: { x: number; y: number; s: number }, dur = .55, z = .01 * i) => { const c = cards[i]; gsap.to(c.g.position, { x: slot.x, y: slot.y, z, duration: dur, ease: 'power3.inOut' }); gsap.to(c.g.scale, { x: slot.s, y: slot.s, z: slot.s, duration: dur, ease: 'power3.inOut' }); gsap.to(c.g.rotation, { x: 0, y: 0, z: 0, duration: dur, ease: 'power3.inOut' }); };
  const flip = (i: number) => {
    phase = 'busy'; const c = cards[i], rare = c.info.rarity !== 'comum', col = HALO[c.info.rarity], isBig = big && i === lastIdx, k = isBig ? 1.6 : 1, tt = gsap.timeline({ onComplete: () => { phase = 'shown'; next = i + 1; setHint(i === N - 1 ? 'TOQUE PARA VER TODAS' : 'TOQUE PARA A PRÓXIMA'); } });
    setHint('');
    tt.to(c.g.position, { x: 0, y: PILE_Y + .1, z: 1.6, duration: .35 * k, ease: 'power2.out' }, 0).to(c.g.scale, { x: 1.08, y: 1.08, z: 1.08, duration: .35 * k, ease: 'power2.out' }, 0).to(c.g.rotation, { z: 0, duration: .35 * k }, 0);
    if (isBig) { tt.to(S, { camZ: 8.8, camY: .1, rays: .6, bloom: .55, glow: 1, duration: 1.2, ease: 'power2.inOut' }, 0).to(c.g.rotation, { y: Math.PI * .5, duration: .7, ease: 'power2.in' }, .6).to(c.g.rotation, { y: 0, duration: .55, ease: 'back.out(1.6)' }, 1.3); }
    else tt.to(c.g.rotation, { y: 0, duration: .6, ease: 'power2.inOut' }, .2);
    const tb = isBig ? 1.45 : .55;
    tt.call(() => { burst(0, PILE_Y + .1, 1.8, isBig ? 150 : rare ? 34 : 14, isBig ? 0xffd870 : col, isBig ? 7.5 : rare ? 3.2 : 2, isBig ? .13 : .07, isBig ? 1.7 : .9, 1.4); if (rare || isBig) { shock(0, PILE_Y + .1, 1.6, isBig ? 0xffe6a0 : col, isBig ? 6.2 : 2.4, isBig ? 1.1 : .7); } if (isBig) { burst(0, PILE_Y + .1, 1.9, 60, 0xffffff, 4.5, .2, .9, 0); S.shake = .08; gsap.to(S, { shake: 0, duration: .6 }); gsap.fromTo(S, { flash: 0 }, { flash: .4, duration: .08, onComplete: () => { gsap.to(S, { flash: 0, duration: .6 }); } }); gsap.to(S, { bloom: .4, camZ: 9.4, camY: 0, duration: 1.4 }); } }, undefined, tb);
    tt.fromTo(c.halo.material as THREE.Material, { opacity: 0 }, { opacity: isBig ? 1 : rare ? .85 : .4, duration: .2 }, tb).to(c.halo.material, { opacity: isBig ? .45 : rare ? .25 : 0, duration: 1.1 }, tb + .25);
    if (SHINE_AMT(c.info.rarity) > 0) tt.fromTo(c.sm.uniforms.amt, { value: 0 }, { value: SHINE_AMT(c.info.rarity), duration: .5 }, tb + .05);   // the shine stays on
    tt.set({}, {}, tb + (isBig ? 1.3 : .5));
  };
  const finishAll = () => { phase = 'busy'; cards.forEach((_, i) => { const g = gridSlot(i); toSlot(i, g, .8, .01 * i); }); gsap.to(S, { rays: .3, duration: 1 }); setTimeout(() => { if (dead) return; phase = 'done'; setHint('TOQUE NUMA CARTA PARA VER EM 3D'); if (!finished) { finished = true; o.onFinished(); } }, 850); };
  const onTap = (e: PointerEvent) => {
    if (phase === 'pile') { flip(next); return; }
    if (phase === 'shown') { const i = next - 1; if (next < N) { toSlot(i, rowSlot(i)); flip(next); } else { toSlot(i, rowSlot(i), .4); finishAll(); } return; }
    if (phase === 'done' && o.onInspect) {
      const r = host.getBoundingClientRect(), ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), rc = new THREE.Raycaster(); rc.setFromCamera(ndc, cam);
      const hit = rc.intersectObjects(cards.map(c => c.front), false)[0]; if (hit) { const i = cards.findIndex(c => c.front === hit.object); if (i >= 0) o.onInspect(i); }
    }
  };
  let downAt: { x: number; y: number } | null = null;
  const pd = (e: PointerEvent) => { downAt = { x: e.clientX, y: e.clientY }; }, pu = (e: PointerEvent) => { if (downAt && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) < 12) onTap(e); downAt = null; };
  host.addEventListener('pointerdown', pd); host.addEventListener('pointerup', pu);
  const nz = (t: number, f: number) => Math.sin(t * f * 6.283) * .6 + Math.sin(t * f * 11.1 + 1.3) * .4;
  const frame = (T: number) => {
    tNow = T; const dt = lastT < 0 ? 0 : Math.max(0, Math.min(.05, T - lastT)); lastT = T; if (phase === 'intro') { tl.seek(Math.min(T, END), false); if (T >= END) { phase = 'pile'; setHint('TOQUE PARA VIRAR A CARTA'); } }
    clip.constant = -(pack.position.y + SEAM);
    const spawnN = (rate: number, f: () => void) => { let n = rate * dt; while (n > 0) { if (rnd() < n) f(); n -= 1; } };
    if (T > 1.1 && T < 3.2) { const c = S.charge; spawnN(70 * c + 8, () => { const a = R(0, 6.283), r = R(1.7, 2.8), x = Math.cos(a) * r, y = Math.sin(a) * r * 1.25; emit(1, { x, y, z: R(-.3, .6), vx: -x * 1.5 - y * .9, vy: -y * 1.5 + x * .9, drag: .98, life: R(.5, .9), s: R(.05, .11), c: rnd() < .3 ? 0xffffff : 0xffcf70, a: .9 }); }); }
    if (T > 3.2 && T < 4.9) spawnN(80, () => emit(1, { x: R(-.7, .7), y: SEAM + R(0, .3), z: R(.1, .5), vx: R(-.6, .6), vy: R(.8, 2.6), g: -.2, drag: .985, life: R(.7, 1.3), s: R(.04, .1), c: 0xffe6a0, a: .9 }));
    spawnN(6, () => emit(1, { x: R(-1.8, 1.8), y: R(-3, 3), z: R(-2, 0), vx: R(-.05, .05), vy: R(.05, .25), drag: .995, life: R(3, 6), s: R(.025, .06), c: 0xd9b878, a: .45 }));
    let r = dt; while (r > 1e-6) { const h = Math.min(r, 1 / 60); simP(h); r -= h; }
    stepRings(); uploadP();
    const sx = S.shake * nz(T, 9), sy = S.shake * nz(T + .37, 11); cam.position.set(sx, S.camY + sy, S.camZ); cam.lookAt(0, S.camY * .5, 0);
    const pk = Math.min(1, Math.max(0, S.charge));
    pack.position.x = pk * .03 * nz(T, 17) * (T < 3.2 ? 1 : 0); if (T > 1.1 && T < 3.2) { pack.position.y += Math.sin(T * 3) * .05 * S.hover + pk * .02 * nz(T, 23); const s = 1 + pk * .06 + Math.sin(T * (6 + pk * 18)) * .012 * pk; pack.scale.setScalar(s); } else if (T >= 3.2) pack.scale.setScalar(1);
    if (packMat) packMat.emissiveIntensity = pk * .28 * (T < 3.2 ? 1 : Math.max(0, 1 - (T - 3.2) * 1.5));
    rim.position.set(Math.cos(T * 1.3) * 3, 1 + Math.sin(T * .9) * 1.5, 3); inner.intensity = pk * 16 * (T < 3.4 ? 1 : Math.max(0, 1 - (T - 3.4) * .8));
    (raysA.material as THREE.MeshBasicMaterial).opacity = S.rays * .3; (raysB.material as THREE.MeshBasicMaterial).opacity = S.rays * .2; raysA.rotation.z = T * .12; raysB.rotation.z = -T * .08 + 1; raysA.scale.setScalar(.8 + S.rays * .5); raysB.scale.setScalar(.7 + S.rays * .4);
    (coreGlow.material as THREE.MeshBasicMaterial).opacity = Math.min(1, pk * .2 + S.glow * .22) * (T > 3.2 && T < 4.6 ? 1.15 : 1);
    cards.forEach((c, i) => { c.sm.uniforms.t.value = T * .35 + i * .13; });
    bloom.strength = S.bloom; flashEl.style.opacity = String(S.flash);
    composer.render();
  };
  let t0 = 0, running = false;
  const loop = (ts: number) => { if (dead) return; if (running) frame((ts - t0) / 1000); raf = requestAnimationFrame(loop); };
  build().then(() => { if (dead) return; makeTimeline(); ready = true; frame(0); t0 = performance.now(); running = true; });
  raf = requestAnimationFrame(loop); void ready;
  return { destroy() { dead = true; host.removeEventListener('pointerdown', pd); host.removeEventListener('pointerup', pu); hint.remove(); gsap.killTweensOf(cards.flatMap(c => [c.g.position, c.g.scale, c.g.rotation])); cancelAnimationFrame(raf); tl?.kill(); gsap.killTweensOf(S); composer.dispose(); renderer.dispose(); renderer.domElement.remove(); flashEl.remove(); scene.traverse((ob: any) => { ob.geometry?.dispose?.(); const m = ob.material; if (m) (Array.isArray(m) ? m : [m]).forEach((x: any) => x.dispose?.()); }); } };
}
