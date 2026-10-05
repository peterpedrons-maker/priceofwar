// The 3D card viewer (collection): a card with a gold edge you turn with a finger. Loaded on demand (React.lazy), so three.js is only
// downloaded the first time a card is opened in 3D. The faces are the card as the game draws it, rendered ahead of time
// (tools/card3d) and kept in src/assets/card3d; the back is the game's own card back, cut to its art so it is exactly as large as the front.
import { useEffect, useRef, type CSSProperties } from 'react';
import * as THREE from 'three';
import { cardSlug } from './card3d';

export type Viewer3DCard = { name: string; type?: string; full?: boolean };

const FILES = import.meta.glob('./assets/card3d/*.webp', { query: '?url', import: 'default' }) as Record<string, () => Promise<string>>;
const urlOf = async (slug: string): Promise<string | null> => { const f = FILES[`./assets/card3d/${slug}.webp`]; return f ? f() : null; };

// size of the card body (2.24 x 3.2 = the 224 x 320 card box at 1/100); the captured face adds the wings of the frame and a margin around it
const W = 2.24, H = 3.2, DEPTH = 0.045, RAD = 0.15, FACE_W = W * 1.32, FACE_H = H * 1.24;

function roundedShape(w: number, h: number, r: number) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
}
// The back plate: the same rectangle as the card body, its corners cut by the art's own alpha (the mesh is turned around, so its UVs stay as they are)
function backGeometry() {
  return new THREE.PlaneGeometry(W, H);
}

export default function CardViewer3D({ cards, index, onIndex, onClose }: { cards: Viewer3DCard[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const apiRef = useRef<{ setCard: (c: Viewer3DCard) => void } | null>(null);
  const card = cards[index];

  useEffect(() => {
    const canvas = canvasRef.current!;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); } catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.95; renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0d0905);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50); camera.position.set(0, 0, 9.4);

    // lights: a soft fill, a warm key from the upper left, a cool rim, and a point light that follows the finger (it moves the gold edge's shine and the foil)
    scene.add(new THREE.AmbientLight(0xffe9c8, 0.35));
    const key = new THREE.DirectionalLight(0xfff0d8, 0.9); key.position.set(-3, 4, 6); scene.add(key);
    const rim = new THREE.DirectionalLight(0x6aa0ff, 0.45); rim.position.set(4, -2, -5); scene.add(rim);
    const finger = new THREE.PointLight(0xffd9a0, 8, 14, 1.6); finger.position.set(0, 0, 4); scene.add(finger);

    const loader = new THREE.TextureLoader(); const aniso = renderer.capabilities.getMaxAnisotropy();
    const textures: THREE.Texture[] = [];
    const load = async (url: string) => new Promise<THREE.Texture>((resolve, reject) => loader.load(url, t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; textures.push(t); resolve(t); }, undefined, reject));

    const pivot = new THREE.Group(); scene.add(pivot);
    const bodyGeo = new THREE.ExtrudeGeometry(roundedShape(W * 0.975, H * 0.975, RAD), { depth: DEPTH, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, curveSegments: 20 });
    bodyGeo.translate(0, 0, -DEPTH / 2);
    pivot.add(new THREE.Mesh(bodyGeo, new THREE.MeshStandardMaterial({ color: 0xc79a32, metalness: 0.95, roughness: 0.32 })));
    const frontMat = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0, transparent: true, alphaTest: 0.4, emissive: 0xffffff, emissiveIntensity: 0.62 });
    const faceGeo = new THREE.PlaneGeometry(FACE_W, FACE_H);
    const front = new THREE.Mesh(faceGeo, frontMat); front.position.z = DEPTH / 2 + 0.0105; pivot.add(front);
    const foilMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTilt: { value: new THREE.Vector2() }, uStrength: { value: 0.4 }, uTime: { value: 0 }, uMap: { value: null as THREE.Texture | null } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `varying vec2 vUv; uniform vec2 uTilt; uniform float uStrength; uniform float uTime; uniform sampler2D uMap;
        void main(){
          vec4 face = texture2D(uMap, vUv); if (face.a < 0.5) discard;
          float d = vUv.x*0.85 + vUv.y*0.55 - uTilt.x*1.1 - uTilt.y*0.9;
          vec3 rb = 0.5 + 0.5*cos(6.2831*(vec3(0.0,0.33,0.67) + d*1.4 + uTime*0.02));
          float band = smoothstep(0.0,0.5, 1.0 - abs(fract(d*0.9) - 0.5)*2.0);
          float glare = pow(smoothstep(0.55,0.0, abs(fract(d*0.9+0.18) - 0.5)*2.0), 3.0);
          vec3 col = rb*band*0.38 + vec3(1.0,0.96,0.85)*glare*0.38;
          gl_FragColor = vec4(col*uStrength*(0.35+0.65*dot(face.rgb, vec3(0.299,0.587,0.114))), 1.0);
        }`,
    });
    const foil = new THREE.Mesh(faceGeo, foilMat); foil.position.z = DEPTH / 2 + 0.0125; pivot.add(foil);
    const backMat = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.05, transparent: true, alphaTest: 0.4 });
    const back = new THREE.Mesh(backGeometry(), backMat); back.rotation.y = Math.PI; back.position.z = -DEPTH / 2 - 0.0105; pivot.add(back);
    urlOf('_back').then(u => u && load(u)).then(t => { if (t) { backMat.map = t; backMat.needsUpdate = true; } }).catch(() => {});

    // a soft contact shadow under the card, and a few embers behind it for depth
    const shCanvas = document.createElement('canvas'); shCanvas.width = shCanvas.height = 128;
    { const g = shCanvas.getContext('2d')!; const gr = g.createRadialGradient(64, 64, 4, 64, 64, 62); gr.addColorStop(0, 'rgba(0,0,0,0.85)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }
    const shMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shCanvas), transparent: true, depthWrite: false });
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.1), shMat); sh.position.set(0, -2.35, -0.6); sh.rotation.x = -Math.PI / 2.6; scene.add(sh);
    const N = 60, pos = new Float32Array(N * 3), seed = new Float32Array(N);
    for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 9; pos[i * 3 + 1] = (Math.random() - 0.5) * 9; pos[i * 3 + 2] = -1.5 - Math.random() * 3; seed[i] = Math.random() * 10; }
    const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const embers = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xffc66a, size: 0.05, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(embers);

    // state: yaw / pitch with inertia, then a spring that settles on the nearest face; a double tap flips the card
    let yaw = 0, pitch = 0, vYaw = 0, dragging = false, lastX = 0, lastY = 0, flipTo: number | null = null, lastTap = 0, alive = true, raf = 0, t = 0, last = performance.now(), loadId = 0;
    const target = { x: 0, y: 0 };
    apiRef.current = {
      setCard: (c) => {
        const id = ++loadId; yaw = Math.PI * 1.2; vYaw = 0; flipTo = 0; foilMat.uniforms.uStrength.value = c.full || c.type === 'General' ? 0.95 : 0.35;
        urlOf(cardSlug(c.name)).then(u => (u ? load(u) : null)).then(tx => { if (!tx || id !== loadId) return; frontMat.map = tx; frontMat.emissiveMap = tx; frontMat.needsUpdate = true; foilMat.uniforms.uMap.value = tx; }).catch(() => {});
      },
    };

    const onDown = (e: PointerEvent) => { dragging = true; lastX = e.clientX; lastY = e.clientY; vYaw = 0; flipTo = null; canvas.setPointerCapture(e.pointerId); };
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1; target.y = -((e.clientY / window.innerHeight) * 2 - 1);
      if (!dragging) return; const dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY;
      yaw += dx * 0.011; pitch = Math.max(-0.7, Math.min(0.7, pitch + dy * 0.008)); vYaw = dx * 0.011;
    };
    const onUp = () => { dragging = false; };
    const onClick = () => { const n = performance.now(); if (n - lastTap < 320) flipTo = Math.round(yaw / Math.PI) * Math.PI + Math.PI; lastTap = n; };
    canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove); canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', onUp); canvas.addEventListener('click', onClick);

    const resize = () => { const w = window.innerWidth, h = window.innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = w / h < 0.8 ? 40 : 32; camera.updateProjectionMatrix(); };
    window.addEventListener('resize', resize); resize();

    const frame = (now: number) => {
      if (!alive) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
      if (!dragging) {
        if (flipTo !== null) { const k = 1 - Math.exp(-dt * 7); vYaw = (flipTo - yaw) * k; yaw += vYaw; if (Math.abs(flipTo - yaw) < 0.002) { yaw = flipTo; flipTo = null; } }
        else { yaw += vYaw; vYaw *= Math.pow(0.04, dt); if (Math.abs(vYaw) < 0.004) { const face = Math.round(yaw / Math.PI) * Math.PI; yaw += (face - yaw) * (1 - Math.exp(-dt * 3.2)); } }
        pitch += (0 - pitch) * (1 - Math.exp(-dt * 3));
      }
      pivot.rotation.y = yaw + (dragging ? 0 : Math.sin(t * 0.7) * 0.05); pivot.rotation.x = pitch + (dragging ? 0 : Math.cos(t * 0.5) * 0.03);
      foilMat.uniforms.uTilt.value.set(Math.sin(yaw) * 0.9 + target.x * 0.25, Math.sin(pitch) * 1.4 + target.y * 0.25); foilMat.uniforms.uTime.value = t;
      finger.position.set(target.x * 3.2, target.y * 3.6 + 0.5, 3.2);
      const facing = Math.abs(Math.cos(pivot.rotation.y)); shMat.opacity = 0.35 + 0.65 * facing; sh.scale.x = 0.7 + 0.3 * facing;
      const a = pg.attributes.position as THREE.BufferAttribute; for (let i = 0; i < N; i++) { let y = a.getY(i) + dt * (0.12 + seed[i] * 0.01); if (y > 4.6) y = -4.6; a.setY(i, y); a.setX(i, a.getX(i) + Math.sin(t * 0.6 + seed[i]) * dt * 0.05); } a.needsUpdate = true;
      renderer.render(scene, camera); raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    apiRef.current.setCard(cards[index]);

    return () => {
      alive = false; cancelAnimationFrame(raf); window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp); canvas.removeEventListener('click', onClick);
      textures.forEach(x => x.dispose()); [bodyGeo, faceGeo, back.geometry, sh.geometry, pg].forEach(g => g.dispose()); [frontMat, foilMat, backMat, shMat].forEach(m => m.dispose()); shMat.map?.dispose(); renderer.dispose();
      apiRef.current = null;
    };
  }, []);

  // another card chosen from outside (the arrows): same scene, new faces
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } if (card) apiRef.current?.setCard(card); }, [index]);

  const arrow = (dir: -1 | 1): CSSProperties => ({
    position: 'absolute', top: '50%', [dir < 0 ? 'left' : 'right']: 6, transform: 'translateY(-50%)', width: 40, height: 64, borderRadius: 10, border: '1px solid rgba(201,169,90,0.45)',
    background: 'rgba(14,10,6,0.55)', color: '#ffe9b0', fontSize: 26, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
  });
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 900, background: '#0d0905', touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, padding: 'max(14px, env(safe-area-inset-top)) 56px 0', textAlign: 'center', pointerEvents: 'none', background: 'linear-gradient(#0d0905cc, #0d090500)', fontFamily: "'Cinzel', serif" }}>
        <div style={{ fontSize: 19, fontWeight: 700, marginTop: 4, letterSpacing: '0.04em', color: '#ffe9b0', textShadow: '0 2px 6px #000' }}>{card?.name.split(',')[0]}</div>
        <div style={{ fontSize: 11, letterSpacing: '0.18em', color: '#cdbd97', textTransform: 'uppercase', marginTop: 2 }}>{card?.type ?? ''}</div>
      </div>
      <button onClick={onClose} aria-label="Fechar" style={{ position: 'absolute', top: 'max(10px, env(safe-area-inset-top))', right: 10, width: 40, height: 40, borderRadius: 10, border: '1px solid rgba(201,169,90,0.5)', background: 'rgba(14,10,6,0.65)', color: '#ffe9b0', fontSize: 22, lineHeight: 1 }}>×</button>
      {index > 0 && <button style={arrow(-1)} aria-label="Carta anterior" onClick={() => onIndex(index - 1)}>‹</button>}
      {index < cards.length - 1 && <button style={arrow(1)} aria-label="Próxima carta" onClick={() => onIndex(index + 1)}>›</button>}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '0 12px max(18px, env(safe-area-inset-bottom))', textAlign: 'center', pointerEvents: 'none', font: '600 11px system-ui, sans-serif', letterSpacing: '0.06em', color: '#a89a78', background: 'linear-gradient(#0d090500, #0d0905dd 60%)' }}>
        Arraste para girar · toque duas vezes para virar
      </div>
    </div>
  );
}
