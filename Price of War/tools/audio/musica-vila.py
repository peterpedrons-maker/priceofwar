"""Música da vila (menu principal), versão com INSTRUMENTOS REAIS GRAVADOS (amostras do soundfont FluidR3_GM, licença MIT, Frank Wen;
pacote npm `soundfont-for-samplers`, MP3 por nota). Mesma peça da versão sintetizada (`musica-vila-sintese.py`): folk sombrio de guerra em Ré menor/dórico,
74 BPM, 28 compassos (~91 s), laço sem emenda, estéreo.
Instrumentos: violão de nylon (alaúde), harpa, corne inglês/oboé/flauta (melodia, com vibrato leve), cordas em conjunto + viola, violoncelo e contrabaixo,
trompa, coro, tímpano e taiko (só nos refrões) + tambor de moldura sintetizado bem baixo.
Uso: python3 musica-vila.py <pasta com FluidR3_GM> <saida.wav>
  (pasta: `npm pack soundfont-for-samplers` e extrair `package/FluidR3_GM/<instrumento>-mp3/` dos instrumentos acima)
Depois: ffmpeg -i saida.wav -af "volume=2dB,alimiter=limit=0.95" -c:a libmp3lame -b:a 160k src/assets/music-vila.mp3"""
import sys, wave, subprocess
import numpy as np

SR = 44100
BPM = 74
BEAT = 60 / BPM
BAR = 4 * BEAT
NBARS = 28
TOTAL = NBARS * BAR
TAIL = 4.5
rng = np.random.default_rng(2027)
SAMPLES = sys.argv[1].rstrip('/')

NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def m(name):
    base = NOTE[name[0]]; i = 1
    if name[i] == 'b': base -= 1; i += 1
    elif name[i] == '#': base += 1; i += 1
    return 12 * (int(name[i:]) + 1) + base
def fname(midi_n): return f"{NAMES[midi_n % 12]}{midi_n // 12 - 1}"

N = int((TOTAL + TAIL) * SR)
L = np.zeros(N); R = np.zeros(N)
def put(x, t0, pan=0.0, gain=1.0):
    """x: (n,) mono ou (n,2) estéreo; pan -1..1 (estéreo: deslocamento da imagem)"""
    i = int(t0 * SR)
    if i >= N or i < 0: return
    if x.ndim == 1: x = np.stack([x, x], 1)
    x = x[:N - i]
    gl = np.cos((pan + 1) * np.pi / 4) * np.sqrt(2); gr = np.sin((pan + 1) * np.pi / 4) * np.sqrt(2)
    L[i:i + len(x)] += x[:, 0] * gl * gain; R[i:i + len(x)] += x[:, 1] * gr * gain

_cache = {}
def sample(inst, note):
    key = (inst, note)
    if key not in _cache:
        raw = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', f'{SAMPLES}/{inst}-mp3/{note}.mp3', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
        x = np.frombuffer(raw, dtype='<f4').reshape(-1, 2).astype(np.float64)
        x = x[int(0.0 * SR):]
        a = x[:int(0.5 * SR)]; rms = np.sqrt((a ** 2).mean()) or 1e-6   # nivela: cada amostra com o mesmo volume de partida
        _cache[key] = x * (0.05 / rms)
    return _cache[key]

def fade(x, a=0.0, r=0.0):
    x = x.copy(); na, nr = int(a * SR), int(r * SR)
    if na: x[:na] *= np.linspace(0, 1, na)[:, None] ** 1.3
    if nr and nr < len(x): x[-nr:] *= np.linspace(1, 0, nr)[:, None] ** 1.3
    return x

def held(x, dur, loop=(0.7, 2.7), xf=0.45, rel=0.28):
    """sustenta uma amostra longa repetindo o trecho estável com crossfade (arco do violoncelo, sopro, cordas)"""
    need = int((dur + rel) * SR)
    if need <= len(x): return fade(x[:need], 0.0, rel)
    ls, le = int(loop[0] * SR), int(loop[1] * SR); nxf = int(xf * SR)
    out = x[:le].copy(); seg = x[ls:le]
    while len(out) < need:
        w = np.linspace(0, 1, nxf)[:, None]
        out[-nxf:] = out[-nxf:] * (1 - w) + seg[:nxf] * w
        out = np.concatenate([out, seg[nxf:]])
    return fade(out[:need], 0.0, rel)

def vibrato(x, rate=5.0, cents=7.0, delay=0.35):
    """vibrato leve: relê a amostra com a velocidade modulada, entrando devagar"""
    n = len(x); tt = np.arange(n) / SR
    depth = cents / 1200 * np.log(2) * np.minimum(1, np.maximum(0, (tt - delay) / 0.5))
    warp = np.cumsum(1 + depth * np.sin(2 * np.pi * rate * tt)) ; warp = warp / warp[-1] * (n - 1) if False else np.cumsum(1 + depth * 2 * np.pi * rate * 0 + depth * np.sin(2 * np.pi * rate * tt))
    warp = np.minimum(warp, n - 1)
    return np.stack([np.interp(warp, np.arange(n), x[:, c]) for c in (0, 1)], 1)

def jit(): return rng.uniform(-0.011, 0.011)
def vel(db=1.5): return 10 ** (rng.uniform(-db, db) / 20)

# ── sons sintetizados só onde não há amostra (tambor de moldura e chocalho, bem baixos) ──
def lp(x, fc):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); return np.fft.irfft(X / np.sqrt(1 + (f / fc) ** 8), len(x))
def hp(x, fc):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); return np.fft.irfft(X / np.sqrt(1 + (fc / np.maximum(f, 1)) ** 4), len(x))
def frame_drum(v=1.0):
    d = 0.8; x = np.arange(int(d * SR)) / SR; f = 66 * (1 + 0.7 * np.exp(-x / 0.04)); ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) * np.exp(-x / 0.2) + lp(rng.standard_normal(len(x)), 800) * np.exp(-x / 0.03) * 0.8
    return y * v
def shaker(v=1.0):
    x = np.arange(int(0.11 * SR)) / SR; return lp(hp(rng.standard_normal(len(x)), 5500), 9500) * np.exp(-x / 0.025) * np.minimum(1, x / 0.004) * v

# ── música ──
CH = {  # acorde: (baixo, arpejo (6 notas), tríade das cordas, tom grave p/ tímpano)
    'Dm': ('D2', ['D3', 'A3', 'D4', 'F4', 'A4', 'D5'], ['D3', 'F3', 'A3', 'D4'], 'D2'),
    'Bb': ('Bb1', ['Bb2', 'F3', 'Bb3', 'D4', 'F4', 'Bb4'], ['Bb2', 'D3', 'F3', 'Bb3'], 'Bb1'),
    'C':  ('C2', ['C3', 'G3', 'C4', 'E4', 'G4', 'C5'], ['C3', 'E3', 'G3', 'C4'], 'C2'),
    'F':  ('F2', ['F2', 'C3', 'F3', 'A3', 'C4', 'F4'], ['F3', 'A3', 'C4', 'F4'], 'F2'),
    'Gm': ('G2', ['G2', 'D3', 'G3', 'Bb3', 'D4', 'G4'], ['G3', 'Bb3', 'D4', 'G4'], 'G2'),
    'A':  ('A1', ['A2', 'E3', 'A3', 'Db4', 'E4', 'A4'], ['A3', 'Db4', 'E4', 'A4'], 'A1'),
}
PA = ['Dm', 'Dm', 'Bb', 'C']; PB = ['Dm', 'F', 'Gm', 'A']; PC = ['Gm', 'Dm', 'Bb', 'A']
SECTIONS = [
    ('intro',   PA, dict(lute=1.35, bass=1.2, bell=1, harp1=1)),
    ('verso1',  PA, dict(lute=1, bass=1, lead=('english_horn', 'A'), cello=1)),
    ('verso2',  PB, dict(lute=1, bass=1, lead=('oboe', 'B'), cello=1, strings=.7)),
    ('refrao1', PA, dict(lute=1, bass=1, lead=('flute', 'A8'), lead2=('oboe', 'A'), cello=1, strings=1, drum=1, harp=1, horn=0)),
    ('refrao2', PB, dict(lute=1, bass=1, lead=('flute', 'B8'), lead2=('oboe', 'B'), cello=1, strings=1, drum=2, harp=1, horn=1, choir=.8)),
    ('ponte',   PC, dict(lute=.6, bass=1, strings=.9, bell=1, lead=('english_horn', 'C'), choir=1, horn=2)),
    ('final',   PA, dict(lute=1.1, bass=1.1, lead=('flute', 'D'), cello=.6, strings=.5, harp1=1)),
]
MEL = {
 'A': [[(0, 2, 'A4'), (2, 1, 'F4'), (3, 1, 'G4')], [(0, 1.5, 'A4'), (1.5, .5, 'D5'), (2, 1, 'C5'), (3, 1, 'A4')], [(0, 2, 'D5'), (2, 1, 'C5'), (3, 1, 'Bb4')], [(0, 2, 'C5'), (2, 1, 'D5'), (3, 1, 'C5')]],
 'B': [[(0, 1.5, 'D5'), (1.5, .5, 'E5'), (2, 2, 'F5')], [(0, 1, 'E5'), (1, 1, 'D5'), (2, 2, 'C5')], [(0, 1, 'D5'), (1, 1, 'Bb4'), (2, 1, 'G4'), (3, 1, 'Bb4')], [(0, 2.5, 'A4'), (2.5, .5, 'G4'), (3, 1, 'A4')]],
 'C': [[(0, 4, 'G4')], [(0, 3, 'A4'), (3, 1, 'F4')], [(0, 4, 'D5')], [(0, 3, 'Db5'), (3, 1, 'A4')]],
 'D': [[(0, 3, 'A4'), (3, 1, 'G4')], [(0, 4, 'F4')], [(0, 2, 'D4'), (2, 2, 'F4')], [(0, 4, 'A4')]],
 'A8': [[(0, 2, 'A4'), (2, 1, 'D5'), (3, 1, 'F5')], [(0, 1.5, 'A5'), (1.5, .5, 'F5'), (2, 1, 'E5'), (3, 1, 'D5')], [(0, 2, 'D5'), (2, 1, 'F5'), (3, 1, 'D5')], [(0, 3, 'E5'), (3, 1, 'G4')]],
 'B8': [[(0, 1.5, 'F5'), (1.5, .5, 'G5'), (2, 2, 'A5')], [(0, 1, 'G5'), (1, 1, 'F5'), (2, 2, 'E5')], [(0, 1, 'D5'), (1, 1, 'F5'), (2, 1, 'G5'), (3, 1, 'Bb5')], [(0, 3, 'A5'), (3, 1, 'E5')]],
}
ARP = [0, 2, 1, 3, 2, 4, 3, 1]; ARP2 = [0, 1, 2, 4, 3, 2, 5, 3]

def wind(inst, note, dur, g, pan, hold=True):
    x = sample(inst, note)
    x = held(x, dur, (0.8, 2.6), 0.4, 0.22) if hold else x[:int((dur + 0.2) * SR)]
    x = vibrato(x, rate=rng.uniform(4.8, 5.4), cents=6.5)
    x = fade(x, 0.05, 0.0)
    return x * g

bar_i = 0
for sname, prog, lay in SECTIONS:
    for k, chord in enumerate(prog):
        t0 = bar_i * BAR; bass, arp, tri, timp = CH[chord]
        if lay.get('bass'): put(held(sample('contrabass', bass), BAR * 1.02, (0.9, 2.7), 0.5, 0.5), t0 - 0.05, -0.1, 0.55)
        if lay.get('cello'): put(held(sample('cello', bass.replace('1', '2') if bass.endswith('1') else bass), BAR * 1.0, (0.8, 2.7), 0.4, 0.35), t0, -0.2, 0.9 * lay['cello'])
        if lay.get('strings'):
            for n in tri:
                put(held(sample('string_ensemble_1', n), BAR + 0.6, (0.8, 2.7), 0.6, 0.6), t0 - 0.12, 0.0, 0.62 * lay['strings'])
            for n in tri[:3]: put(held(sample('viola', n), BAR + 0.4, (0.8, 2.7), 0.5, 0.5), t0 - 0.05, 0.15, 0.35 * lay['strings'])
        if lay.get('lute'):
            pat = ARP if bar_i % 2 == 0 else ARP2
            for e in range(8):
                v = (1.0 if e % 4 == 0 else 0.72 if e % 2 == 0 else 0.55) * lay['lute'] * vel()
                put(sample('acoustic_guitar_nylon', arp[pat[e]])[:int(2.8 * SR)] * 1.0, t0 + e * BEAT / 2 + jit(), -0.35, 1.5 * v)
        if lay.get('harp') and k % 2 == 0:
            for j, n in enumerate(arp):   # arpejo ascendente rápido no começo do compasso
                put(sample('orchestral_harp', n)[:int(3.0 * SR)], t0 + j * 0.075 + jit() * .3, 0.45, 0.9 * vel())
        if lay.get('harp1') and k == 0:
            for j, n in enumerate(arp):
                put(sample('orchestral_harp', n)[:int(3.0 * SR)], t0 + j * 0.11, 0.4, 0.8)
        if lay.get('lead'):
            inst, key = lay['lead']
            hi = key in ('A8', 'B8')
            for (a, b, n) in MEL[key][k]:
                put(wind(inst, n, b * BEAT * 0.96, 1.0, 0.0), t0 + a * BEAT + jit(), 0.15, 1.35 if inst == 'flute' else 1.6)
        if lay.get('lead2'):
            inst, key = lay['lead2']
            base = 'A' if key == 'A' else 'B'
            for (a, b, n) in MEL[base][k]:
                put(wind(inst, n, b * BEAT * 0.96, 1.0, 0.0), t0 + a * BEAT + jit(), -0.15, 1.0)
        if lay.get('horn') and (k in (0, 2) or lay['horn'] == 2):
            put(held(sample('french_horn', bass.replace('1', '2') if bass.endswith('1') else bass), BAR * (1.0 if lay['horn'] == 2 else 2.0), (0.8, 2.7), 0.6, 0.6), t0, 0.0, 0.85)
        if lay.get('choir') and k % 2 == 0:
            for n in tri[:3]: put(held(sample('pad_4_choir', n), BAR * 2 + 0.3, (0.8, 2.7), 0.8, 0.8), t0, 0.0, 0.40 * lay['choir'])
        if lay.get('bell') and k in (0, 2):
            put(sample('orchestral_harp', 'A6' if k == 0 else 'D6')[:int(3.0 * SR)], t0 + BEAT * 2, 0.5, 0.55)
        if lay.get('drum'):
            hard = lay['drum'] == 2
            put(sample('timpani', timp)[:int(2.6 * SR)], t0, 0.0, 1.5 if hard else 1.15)
            put(frame_drum(1.0), t0, 0.1, 0.14)
            put(frame_drum(0.6), t0 + 2 * BEAT, -0.1, 0.10)
            if hard:
                put(sample('taiko_drum', 'D3' if chord != 'Bb' else 'Bb2')[:int(1.8 * SR)], t0, 0.0, 1.0)
                put(sample('taiko_drum', 'D3')[:int(1.2 * SR)], t0 + 3.5 * BEAT, 0.0, 0.5)
                put(sample('timpani', timp)[:int(1.5 * SR)], t0 + 2.5 * BEAT, 0.0, 0.7)
            for e in range(8): put(shaker(0.5 if e % 2 else 0.8), t0 + e * BEAT / 2, 0.45, 0.05)
        bar_i += 1
assert bar_i == NBARS

# ── reverb de salão (estéreo), cauda dobrada no começo (laço) e acabamento ──
def conv(x, ir):
    n = len(x) + len(ir) - 1; kk = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, kk) * np.fft.rfft(ir, kk), kk)[:n]
def make_ir(d, seed):
    g = np.random.default_rng(seed); n = int(d * SR); ir = g.standard_normal(n) * np.exp(-np.linspace(0, 6.8, n)); ir = lp(hp(ir, 160), 5600)
    ir[:int(0.025 * SR)] *= np.linspace(0, 1, int(0.025 * SR)); return ir / np.abs(ir).max()
ir1, ir2 = make_ir(2.9, 11), make_ir(2.9, 12)
wet = 0.075
L2 = L + conv(L, ir1)[:N] * wet; R2 = R + conv(R, ir2)[:N] * wet
tail = int(TAIL * SR); T = int(TOTAL * SR)
L2[:tail] += L2[T:T + tail]; R2[:tail] += R2[T:T + tail]
L2, R2 = L2[:T], R2[:T]
for ch in (L2, R2): ch[:] = hp(ch, 30)
pk = max(np.abs(L2).max(), np.abs(R2).max()); L2 /= pk; R2 /= pk
rms = np.sqrt((L2 ** 2 + R2 ** 2).mean() / 2); g = 0.15 / rms
L2 = np.tanh(L2 * g) * 0.92; R2 = np.tanh(R2 * g) * 0.92
out = (np.clip(np.stack([L2, R2], 1), -1, 1) * 32767).astype('<i2')
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes())
print(f'{T / SR:.1f} s, pico {np.abs(out).max() / 32767:.2f}, rms {np.sqrt((out.astype(float) ** 2).mean()) / 32767:.3f}')
