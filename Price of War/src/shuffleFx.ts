// Embaralhar o baralho (pedido do dono, rodada 26): o baralho desce do tabuleiro, flutua até o centro da tela numa vista em perspectiva 3D, é embaralhado
// (as duas metades se abrem, as cartas se intercalam uma a uma, depois um corte leva o bloco de cima para baixo e o monte é batido para alinhar) e volta ao lugar.
// Three.js só enquanto dura (canvas transparente por cima de tudo, criado e destruído a cada embaralhada); a coreografia é do GSAP; o tabuleiro não é tocado.
import * as THREE from 'three';
import gsap from 'gsap';
import cardBackUrl from './assets/card3d/_back.webp';

let busy = false;
const tex = (url: string) => new Promise<THREE.Texture>(res => new THREE.TextureLoader().load(url, t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; res(t); }));
const radial = (rgb: string) => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d')!, r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, `rgba(${rgb},1)`); r.addColorStop(.35, `rgba(${rgb},.4)`); r.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); };

// `deckEl`: o monte desenhado no tabuleiro (some enquanto o baralho flutua e volta no fim). Resolve quando acabou.
export async function fxShuffle(deckEl: HTMLElement | null, N = 16): Promise<void> {
  if (busy) return; busy = true;
  const W = window.innerWidth, H = window.innerHeight, rect = deckEl?.getBoundingClientRect();
  const dpx = rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, w: rect.width } : { x: W * .8, y: H * .5, w: 70 };
  const canvas = document.createElement('canvas'); canvas.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100dvh;pointer-events:none;z-index:292;opacity:0';
  document.body.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); renderer.setSize(W, H); renderer.setClearColor(0, 0);
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(32, W / H, .1, 60); cam.position.set(0, 0, 12);
  const viewH = 2 * 12 * Math.tan(16 * Math.PI / 180), wpp = viewH / H;   // unidades do mundo por pixel (no plano z = 0)
  const toWorld = (px: number, py: number) => ({ x: (px - W / 2) * wpp, y: -(py - H / 2) * wpp });
  scene.add(new THREE.AmbientLight(0xfff0dc, 1.5)); const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-3, 5, 7); scene.add(key);
  const back = await tex(cardBackUrl), CW = dpx.w * wpp, CH = CW * (back.image.height / back.image.width), gap = CW * .022;
  const stack = new THREE.Group(); scene.add(stack);
  const mat = new THREE.MeshStandardMaterial({ map: back, roughness: .55, metalness: .1, transparent: true, alphaTest: .4, side: THREE.DoubleSide });
  const geo = new THREE.PlaneGeometry(CW, CH), cards: THREE.Mesh[] = [];
  for (let i = 0; i < N; i++) { const m = new THREE.Mesh(geo, mat); m.position.set(0, 0, i * gap); stack.add(m); cards.push(m); }
  // brilho dourado atrás do monte e sombra no chão (dão a ideia de altura)
  const glowT = radial('255,210,120'), shadowT = radial('0,0,0');
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: glowT, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); glow.position.z = -1.5; scene.add(glow);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: shadowT, transparent: true, opacity: 0, depthWrite: false })); shadow.position.z = -2; scene.add(shadow);
  const start = toWorld(dpx.x, dpx.y), CENTER = { x: 0, y: .6 }, bigS = Math.min((viewH * W / H * .36) / CW, (viewH * .4) / CH);   // no centro a carta ocupa ~46% da largura da tela
  stack.position.set(start.x, start.y, 0); stack.scale.setScalar(1);
  glow.scale.setScalar(CW * 3); shadow.scale.set(CW * 2.6, CW * 1.1, 1); shadow.position.set(start.x, start.y - CH * .6, -2);
  if (deckEl) deckEl.style.visibility = 'hidden';
  const h = N >> 1, gz = (k: number) => k * gap, order = Array.from({ length: N }, (_, i) => i);   // order[k] = índice da carta na posição k do monte
  let done = false; const tl = gsap.timeline();
  gsap.set(canvas, { opacity: 1 });
  // 1. o monte levanta, flutua até o centro e se inclina em perspectiva
  tl.to(stack.position, { x: CENTER.x, y: CENTER.y, z: 0, duration: .85, ease: 'power3.inOut' }, 0);
  tl.to(stack.scale, { x: bigS, y: bigS, z: bigS, duration: .85, ease: 'power3.inOut' }, 0);
  tl.to(stack.rotation, { x: -.95, y: .38, z: .1, duration: .85, ease: 'power3.inOut' }, 0);
  tl.to(glow.material, { opacity: .55, duration: .6 }, .2);
  tl.to(shadow.material, { opacity: .38, duration: .6 }, .1);
  tl.to(shadow.position, { x: CENTER.x, y: CENTER.y - CH * bigS * .55, duration: .85, ease: 'power3.inOut' }, 0);
  tl.to(shadow.scale, { x: CW * bigS * 1.6, y: CW * bigS * .9, duration: .85, ease: 'power3.inOut' }, 0);
  // flutua um pouco (balanço leve)
  tl.to(stack.position, { y: `+=${.12}`, duration: .35, yoyo: true, repeat: 1, ease: 'sine.inOut' }, .85);
  // 2. riffle: as metades se abrem...
  const T1 = 1.3;
  cards.forEach((m, i) => { const left = i < h; tl.to(m.position, { x: left ? -CW * .56 : CW * .56, duration: .38, ease: 'power2.out' }, T1); tl.to(m.rotation, { z: left ? .24 : -.24, y: left ? .18 : -.18, duration: .38, ease: 'power2.out' }, T1); });
  // ...e as cartas caem intercaladas, uma de cada vez, SEM se atravessar: cada uma sobe acima do monte, desliza para o centro e desce por cima da anterior
  const T2 = T1 + .5, STEP = .075, hi = (N + 3) * gap;
  for (let k = 0; k < N; k++) { const i = k % 2 === 0 ? k / 2 : h + (k - 1) / 2, m = cards[i], t0 = T2 + k * STEP;
    tl.to(m.position, { z: hi, y: CH * .1, duration: .09, ease: 'power2.out' }, t0);                               // levanta
    tl.to(m.position, { x: 0, duration: .13, ease: 'power2.inOut' }, t0 + .07);                                    // desliza por cima do monte
    tl.to(m.rotation, { z: 0, y: 0, duration: .13, ease: 'power2.inOut' }, t0 + .07);
    tl.to(m.position, { z: gz(k), y: 0, duration: .1, ease: 'power2.in' }, t0 + .19); }                            // pousa sobre a anterior
  const newOrder = Array.from({ length: N }, (_, k) => (k % 2 === 0 ? k / 2 : h + (k - 1) / 2)); newOrder.forEach((v, k) => { order[k] = v; });
  tl.to(glow.material, { opacity: .85, duration: .25, yoyo: true, repeat: 1 }, T2 + .1);
  // 3. corte: o bloco de cima sai para o lado; os de baixo sobem; só depois o bloco entra por baixo (nunca ao mesmo tempo no mesmo lugar)
  const T3 = T2 + N * STEP + .4, B = 6;
  for (let k = 0; k < N; k++) { const m = cards[order[k]], top = k >= N - B, nk = top ? k - (N - B) : k + B;
    if (top) { tl.to(m.position, { x: CW * 1.12, y: CH * .1, z: gz(k) + 3 * gap, duration: .34, ease: 'power2.out' }, T3); tl.to(m.rotation, { z: -.18, duration: .34, ease: 'power2.out' }, T3); tl.to(m.position, { x: 0, y: 0, z: gz(nk), duration: .36, ease: 'power2.inOut' }, T3 + .85); tl.to(m.rotation, { z: 0, duration: .36 }, T3 + .85); }
    else tl.to(m.position, { z: gz(nk), duration: .4, ease: 'power2.inOut' }, T3 + .4); }
  // 4. bate o monte para alinhar (pequeno quique) e brilha
  const T4 = T3 + 1.3;
  tl.to(stack.scale, { y: bigS * .94, duration: .08, ease: 'power2.in' }, T4).to(stack.scale, { y: bigS, duration: .22, ease: 'back.out(3)' }, T4 + .08);
  tl.to(glow.material, { opacity: .95, duration: .12 }, T4).to(glow.material, { opacity: .35, duration: .5 }, T4 + .12);
  // 5. volta para o lugar do baralho
  const T5 = T4 + .55;
  tl.to(stack.position, { x: start.x, y: start.y, z: 0, duration: .7, ease: 'power3.inOut' }, T5);
  tl.to(stack.scale, { x: 1, y: 1, z: 1, duration: .7, ease: 'power3.inOut' }, T5);
  tl.to(stack.rotation, { x: 0, y: 0, z: 0, duration: .7, ease: 'power3.inOut' }, T5);
  tl.to(glow.material, { opacity: 0, duration: .5 }, T5).to(shadow.material, { opacity: 0, duration: .5 }, T5);
  tl.to(shadow.position, { x: start.x, y: start.y - CH * .6, duration: .7 }, T5);
  let raf = 0; const loop = () => { renderer.render(scene, cam); raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop);
  const follow = () => { glow.position.x = stack.position.x; glow.position.y = stack.position.y; }; gsap.ticker.add(follow);
  function finish() {
    if (done) return; done = true; gsap.ticker.remove(follow); cancelAnimationFrame(raf); if (deckEl) deckEl.style.visibility = '';
    geo.dispose(); mat.dispose(); back.dispose(); glowT.dispose(); shadowT.dispose(); (glow.material as THREE.Material).dispose(); (shadow.material as THREE.Material).dispose(); renderer.dispose(); canvas.remove(); busy = false;
  }
  await new Promise<void>(res => { tl.eventCallback('onComplete', () => { finish(); res(); }); });
}
