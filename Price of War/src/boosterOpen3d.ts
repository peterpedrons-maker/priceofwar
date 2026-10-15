// Abertura de booster em 3D (mockup aprovado: public/mockups/abertura-booster/, docs/animacoes.md): o pacote cai, carrega energia, rasga, as cartas sobem, abrem em leque
// e são viradas uma a uma (da menos rara para a melhor); se a melhor for forte, ela ganha aproximação e explosão dourada. Three.js + GSAP, só enquanto dura.
// Um único relógio T comanda timeline, partículas, luzes e câmera. Sem som (decisão do dono: os sons virão depois, escolhidos por ele).
import * as THREE from 'three';
import gsap from 'gsap';
import type { Shine, Rarity } from './rarity';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

// Sem legenda de raridade (decisão do dono): quem diz que a carta é especial é só o efeito dela aparecendo na tela.
export type OpenCard = { name: string; faceUrl: string | null; rarity: Rarity; isFullArt: boolean; shine: Shine };
export type OpenOpts = { packUrl: string | null; accent: string; backUrl: string; cards: OpenCard[]; onFinished: () => void };
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
  let packMat: THREE.MeshPhysicalMaterial, strip: THREE.Mesh, slit: THREE.Mesh; const cards: { g: THREE.Group; fm: THREE.MeshStandardMaterial; sm: THREE.ShaderMaterial; halo: THREE.Mesh; info: OpenCard }[] = [];
  const N = o.cards.length, fan = (i: number) => ({ x: (i - (N - 1) / 2) * Math.min(.56, 2.3 / Math.max(1, N - 1)), y: -.55 - .04 * Math.pow(i - (N - 1) / 2, 2), rz: -(i - (N - 1) / 2) * .075, s: .6 });
  const sheenMat = (map: THREE.Texture | null, color: number, info: OpenCard) => {
    // brilho por raridade: a arte, as letras do nome (só onde o texto difere da placa) ou a carta inteira
    let plate = .5; const nameRect = info.isFullArt ? NAME_RECT_FULL : NAME_RECT_STD;
    try { if (map?.image) { const im = map.image as HTMLImageElement, c = document.createElement('canvas'); c.width = 64; c.height = 64; const g = c.getContext('2d', { willReadFrequently: true })!; const W0 = im.width, H0 = im.height; g.drawImage(im, nameRect[0] * W0, (1 - nameRect[3]) * H0, (nameRect[2] - nameRect[0]) * W0, (nameRect[3] - nameRect[1]) * H0, 0, 0, 64, 64); const d = g.getImageData(0, 0, 64, 64).data; const ls: number[] = []; for (let i = 0; i < d.length; i += 4) ls.push(d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11); ls.sort((a, b) => a - b); plate = ls[Math.floor(ls.length * .7)] / 255; } } catch { /* sem leitura: usa .5 */ }
    return new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { map: { value: map }, t: { value: 0 }, amt: { value: 0 }, tint: { value: new THREE.Color(HALO[info.rarity]) }, art: { value: info.shine === 'art' || info.shine === 'art+name' ? 1 : 0 }, name: { value: info.shine === 'name' || info.shine === 'art+name' ? 1 : 0 }, card: { value: info.shine === 'card' ? 1 : 0 }, artRect: { value: new THREE.Vector4(...ART_RECT) }, nameRect: { value: new THREE.Vector4(...nameRect) }, plate: { value: plate }, ultra: { value: info.rarity === 'ultra' || info.rarity === 'secreta' ? 1 : 0 } },
      vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'varying vec2 vUv;uniform sampler2D map;uniform float t,amt,art,name,card,plate,ultra;uniform vec3 tint;uniform vec4 artRect,nameRect;float inR(vec2 uv,vec4 r){return step(r.x,uv.x)*step(uv.x,r.z)*step(r.y,uv.y)*step(uv.y,r.w);}void main(){vec4 c=texture2D(map,vUv);if(c.a<.5)discard;float lum=dot(c.rgb,vec3(.3,.59,.11));float letters=inR(vUv,nameRect)*smoothstep(.09,.26,abs(lum-plate));float m=card+art*inR(vUv,artRect)+name*letters;if(m<.01)discard;float d=vUv.x*.8+vUv.y*.6;float band=smoothstep(.0,.5,sin((d-t)*6.2832*1.2)*.5+.5);band=pow(band,3.);vec3 rb=.5+.5*cos(6.2832*(vec3(0.,.33,.67)+d*1.5-t*2.));vec3 col=mix(tint,rb,.25+.5*ultra)*(.2+band*(.6+.3*ultra))*amt*min(m,1.)*(1.-.45*card);gl_FragColor=vec4(col,min(m,1.)*amt*.6);}' });
  };
  const S = { charge: 0, flash: 0, rays: 0, bloom: .28, shake: 0, camZ: 10, camY: 0, glow: 0, hover: 0 };
  let tl: gsap.core.Timeline, END = 9, lastT = -1, finished = false, raf = 0, ready = false;
  const lastIdx = N - 1, big = o.cards[lastIdx]?.rarity === 'ultra' || o.cards[lastIdx]?.rarity === 'secreta';
  const SHINE_AMT = (r: Rarity) => (r === 'comum' ? 0 : r === 'rara' ? .55 : .9);
  const flashEl = document.createElement('div'); flashEl.style.cssText = 'position:absolute;inset:0;background:#fff8e0;opacity:0;pointer-events:none;mix-blend-mode:screen'; host.appendChild(flashEl);

  const build = async () => {
    const [packTex, back, ...faces] = await Promise.all([o.packUrl ? tex(o.packUrl) : Promise.resolve(null), tex(o.backUrl), ...o.cards.map(c => c.faceUrl ? tex(c.faceUrl) : Promise.resolve(null))]);
    if (dead) return;
    const pTex = packTex ?? cv(256, 440, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, o.accent); gr.addColorStop(1, '#2a1a0c'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 0, w, h * .09); g.fillRect(0, h * .91, w, h * .09); });
    packMat = new THREE.MeshPhysicalMaterial({ map: pTex, roughness: .36, metalness: .28, clearcoat: .85, clearcoatRoughness: .22, side: THREE.DoubleSide, alphaTest: .3, emissive: 0xffcf80, emissiveMap: pTex, emissiveIntensity: 0 });
    const body = new THREE.Mesh(panel(-PH / 2, SEAM, 22, 40, false, true), packMat); strip = new THREE.Mesh(panel(SEAM, PH / 2, 22, 5, true, false), packMat); strip.position.z = .001; pack.add(body, strip);
    slit = new THREE.Mesh(new THREE.PlaneGeometry(PW * .96, .5), additive(haloTex, 0xffe6a0, 0)); slit.position.set(0, SEAM, .2); pack.add(slit);
    faces.forEach((ft, i) => {
      const CW = 1.5, aspect = ft ? ft.image.height / ft.image.width : 1.343, CH = CW * aspect, g = new THREE.Group(), tier = o.cards[i].rarity;
      const faceTex = ft ?? back!;
      const fm = new THREE.MeshStandardMaterial({ map: faceTex, roughness: .5, metalness: .08, alphaTest: .4, emissive: 0xffffff, emissiveMap: faceTex, emissiveIntensity: 0 });
      const bm = new THREE.MeshStandardMaterial({ map: back, roughness: .55, metalness: .1, alphaTest: .4 });
      const front = new THREE.Mesh(new THREE.PlaneGeometry(CW, CH), fm); front.position.z = .004;
      const bk = new THREE.Mesh(new THREE.PlaneGeometry(CW, CH), bm); bk.rotation.y = Math.PI; bk.position.z = -.004;
      const sm = sheenMat(ft, 0, o.cards[i]); const sheen = new THREE.Mesh(new THREE.PlaneGeometry(CW, CH), sm); sheen.position.z = .008;
      const halo = new THREE.Mesh(new THREE.PlaneGeometry(CW * 2.1, CH * 1.8), additive(haloTex, HALO[tier], 0)); halo.position.z = -.05;
      g.add(halo, bk, front, sheen); g.visible = false; cardsG.add(g); cards.push({ g, fm, sm, halo, info: o.cards[i] });
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
    cards.forEach((c, i) => { const f = fan(i), d = T5 + .35 + i * .06; tl.to(c.g.position, { x: f.x, y: f.y, z: i * .01, duration: .65, ease: 'power3.inOut' }, d); tl.to(c.g.rotation, { z: f.rz, duration: .65, ease: 'power3.inOut' }, d); tl.to(c.g.scale, { x: f.s, y: f.s, z: f.s, duration: .65, ease: 'power3.inOut' }, d); });
    const T6 = T5 + 1.3, STEP = .6;
    const reveal = (i: number, at: number) => { const c = cards[i], rare = c.info.rarity !== 'comum', f = fan(i), col = HALO[c.info.rarity];
      tl.to(c.g.position, { x: f.x * .3, y: .1, z: 1.6, duration: .35, ease: 'power2.out' }, at).to(c.g.position, { x: f.x, y: f.y, z: i * .01, duration: .4, ease: 'power2.inOut' }, at + .75);
      tl.to(c.g.scale, { x: .95, y: .95, z: .95, duration: .35, ease: 'power2.out' }, at).to(c.g.scale, { x: f.s, y: f.s, z: f.s, duration: .4, ease: 'power2.inOut' }, at + .75);
      tl.to(c.g.rotation, { z: 0, duration: .35, ease: 'power2.out' }, at).to(c.g.rotation, { z: f.rz, duration: .4, ease: 'power2.inOut' }, at + .75);
      tl.to(c.g.rotation, { y: 0, duration: .55, ease: 'power2.inOut' }, at + .2);
      tl.call(() => { burst(f.x * .3, .1, 1.7, rare ? 34 : 14, col, rare ? 3.2 : 2, .07, .9, 1.4); if (rare) shock(f.x * .3, .1, 1.5, col, 2.2, .7); }, undefined, at + .5);
      tl.fromTo((c.halo.material as THREE.Material), { opacity: 0 }, { opacity: rare ? .85 : .4, duration: .2 }, at + .5).to(c.halo.material, { opacity: rare ? .3 : 0, duration: 1 }, at + .7);
      if (SHINE_AMT(c.info.rarity) > 0) tl.fromTo(c.sm.uniforms.amt, { value: 0 }, { value: SHINE_AMT(c.info.rarity), duration: .5 }, at + .55); };   // o brilho da raridade fica ligado
    const normal = big ? N - 1 : N;
    for (let i = 0; i < normal; i++) reveal(i, T6 + i * STEP);
    let tEnd = T6 + normal * STEP + .9;
    if (big) {   // a melhor carta, lendária: pausa, aproximação, virada lenta e explosão dourada
      const L = cards[lastIdx], a = tEnd; const lf = fan(lastIdx);
      tl.to(S, { camZ: 8.6, camY: .15, duration: 1.7, ease: 'power2.inOut' }, a);
      cards.forEach((c, i) => { if (i === lastIdx) return; tl.to(c.g.position, { y: -2.3 - .04 * Math.pow(i - (N - 1) / 2, 2), duration: .7, ease: 'power2.inOut' }, a).to(c.g.scale, { x: .48, y: .48, z: .48, duration: .7, ease: 'power2.inOut' }, a); });
      tl.to(L.g.position, { x: 0, y: .55, z: 1.7, duration: .8, ease: 'power3.inOut' }, a).to(L.g.rotation, { z: 0, duration: .8, ease: 'power3.inOut' }, a).to(L.g.scale, { x: 1.45, y: 1.45, z: 1.45, duration: .8, ease: 'power3.inOut' }, a);
      tl.to(S, { rays: .6, bloom: .55, glow: 1, duration: 1.3, ease: 'power2.in' }, a + .2);
      tl.to(L.g.rotation, { y: Math.PI * .5, duration: .7, ease: 'power2.in' }, a + 1.05).to(L.g.rotation, { y: 0, duration: .55, ease: 'back.out(1.6)' }, a + 1.75);
      tl.call(() => { burst(0, .55, 1.9, 150, 0xffd870, 7.5, .13, 1.7, 1.2); burst(0, .55, 1.9, 60, 0xffffff, 4.5, .2, .9, 0); shock(0, .55, 1.6, 0xffe6a0, 6.2, 1.1); shock(0, .55, 1.65, 0xffb040, 4.2, .8); S.shake = .08; }, undefined, a + 1.9);
      tl.fromTo(S, { flash: 0 }, { flash: .4, duration: .08 }, a + 1.9).to(S, { flash: 0, duration: .6, ease: 'power2.in' }, a + 1.98).to(S, { shake: 0, duration: .6 }, a + 2);
      tl.to(S, { bloom: .85, duration: .1 }, a + 1.9).to(S, { bloom: .4, duration: 1.4 }, a + 2);
      tl.fromTo((L.halo.material as THREE.Material), { opacity: 0 }, { opacity: 1, duration: .15 }, a + 1.9).to(L.halo.material, { opacity: .55, duration: 1.2 }, a + 2.05);
      tl.fromTo(L.sm.uniforms.amt, { value: 0 }, { value: 1, duration: .4 }, a + 2);
      tl.to(S, { camZ: 9.4, duration: 1.6, ease: 'power1.out' }, a + 2); void lf;
      tEnd = a + 3.4;
    }
    END = tEnd; tl.set({}, {}, END);
  };
  const nz = (t: number, f: number) => Math.sin(t * f * 6.283) * .6 + Math.sin(t * f * 11.1 + 1.3) * .4;
  const frame = (T: number) => {
    tNow = T; const dt = lastT < 0 ? 0 : Math.max(0, Math.min(.05, T - lastT)); lastT = T; tl.seek(T, false);
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
    if (T >= END && !finished) { finished = true; o.onFinished(); }
  };
  let t0 = 0, running = false;
  const loop = (ts: number) => { if (dead) return; if (running) frame(Math.min((ts - t0) / 1000, END + .001)); raf = requestAnimationFrame(loop); };
  build().then(() => { if (dead) return; makeTimeline(); ready = true; frame(0); t0 = performance.now(); running = true; });
  raf = requestAnimationFrame(loop); void ready;
  return { destroy() { dead = true; cancelAnimationFrame(raf); tl?.kill(); gsap.killTweensOf(S); composer.dispose(); renderer.dispose(); renderer.domElement.remove(); flashEl.remove(); scene.traverse((ob: any) => { ob.geometry?.dispose?.(); const m = ob.material; if (m) (Array.isArray(m) ? m : [m]).forEach((x: any) => x.dispose?.()); }); } };
}
