"""Música da vila (menu principal): folk sombrio de guerra, Ré menor/dórico, 74 BPM, 28 compassos (~91 s) em laço, estéreo, toda sintetizada (numpy).
Instrumentos: bordão grave + cordas em conjunto (pad), alaúde (arpejos), flauta/duduk (melodia), tambor de moldura e taiko (só no refrão), sinos de vidro (raros).
Uso: python3 musica-vila.py <saida.wav>     (depois: ffmpeg -i saida.wav -c:a libmp3lame -b:a 160k music-vila.mp3)
O fim se dobra sobre o começo (cauda do reverb somada ao início), então o laço não tem emenda."""
import sys, wave
import numpy as np

SR = 44100
BPM = 74
BEAT = 60 / BPM
BAR = 4 * BEAT
NBARS = 28
TOTAL = NBARS * BAR
TAIL = 4.0
rng = np.random.default_rng(2026)

def midi(n): return 440.0 * 2 ** ((n - 69) / 12)
NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def m(name):  # 'D4', 'Bb3', 'C#4'
    base = NOTE[name[0]]; i = 1
    if name[i] == 'b': base -= 1; i += 1
    elif name[i] == '#': base += 1; i += 1
    return 12 * (int(name[i:]) + 1) + base
def hz(name): return midi(m(name))

N = int((TOTAL + TAIL) * SR)
L = np.zeros(N); R = np.zeros(N)
def put(x, t0, pan=0.0, gain=1.0):
    """soma x (mono) no estéreo a partir de t0 segundos; pan -1 (esq) .. 1 (dir)"""
    i = int(t0 * SR)
    if i >= N: return
    x = x[:N - i]
    th = (pan + 1) * np.pi / 4
    L[i:i + len(x)] += x * np.cos(th) * gain; R[i:i + len(x)] += x * np.sin(th) * gain

def tt(d): return np.arange(int(d * SR)) / SR
def lp(x, fc, order=4):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / (1 + (f / fc) ** (2 * order) ** .5) if False else 1 / np.sqrt(1 + (f / fc) ** (2 * order)); return np.fft.irfft(X, len(x))
def hp(x, fc, order=2):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / np.sqrt(1 + (fc / np.maximum(f, 1)) ** (2 * order)); return np.fft.irfft(X, len(x))
def bp(x, lo, hi): return hp(lp(x, hi), lo)

def adsr(n, a, r, sustain=1.0):
    e = np.ones(n) * sustain; na = max(1, int(a * SR)); nr = max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na) ** 1.5 * sustain if na < n else e[:na]
    if nr < n: e[n - nr:] *= np.linspace(1, 0, nr) ** 1.5
    return e

# ── instrumentos ─────────────────────────────────────────────────────────────
def pluck(f, d=2.2, tau=0.9, bright=1.0):
    """alaúde/harpa: parciais que decaem (agudos mais rápido), pequeno 'clique' da palheta"""
    x = tt(d); y = np.zeros(len(x))
    for k in range(1, 11):
        fk = f * k * (1 + 0.0004 * k * k)
        if fk > 9000: break
        y += (1 / k ** (1.15 / bright)) * np.sin(2 * np.pi * fk * x + rng.uniform(0, 6.28)) * np.exp(-x / (tau / (1 + 0.55 * k)))
    n = rng.standard_normal(int(0.012 * SR)); n = bp(n, 1200, 5000) * np.linspace(1, 0, len(n)) ** 2
    y[:len(n)] += n * 0.35
    y *= np.minimum(1, x / 0.002)
    return y

def flute(f, d, vib=0.0045, breath=0.05, warm=0.5):
    """flauta/duduk: seno + harmônicos ímpares, vibrato que entra devagar, sopro filtrado"""
    x = tt(d); depth = vib * np.minimum(1, np.maximum(0, (x - 0.22) / 0.35))
    ph = 2 * np.pi * np.cumsum(f * (1 + depth * np.sin(2 * np.pi * 5.1 * x + 0.8))) / SR
    y = np.sin(ph) + 0.28 * np.sin(2 * ph) * warm + 0.22 * np.sin(3 * ph) + 0.09 * np.sin(5 * ph)
    saw = (2 * ((ph / (2 * np.pi)) % 1) - 1); y += lp(saw, 2200) * 0.22 * warm
    y += bp(rng.standard_normal(len(x)), 2500, 5200) * breath * (0.5 + 0.5 * np.minimum(1, x / 0.1))
    return y * adsr(len(x), 0.07, min(0.2, d * 0.4)) * (0.88 + 0.12 * np.sin(2 * np.pi * 4.3 * x))

def strings(freqs, d, det=(-9, -3, 0, 4, 10), cut=1700):
    """cordas em conjunto: serras levemente desafinadas, filtro passa-baixa, ataque lento e respiração"""
    x = tt(d); y = np.zeros(len(x))
    for f in freqs:
        for c in det:
            ff = f * 2 ** (c / 1200); ph = 2 * np.pi * ff * x + rng.uniform(0, 6.28)
            y += (2 * ((ph / (2 * np.pi)) % 1) - 1) * 0.25 + np.sin(ph) * 0.2
    y = lp(y, cut)
    sw = 0.85 + 0.15 * np.sin(2 * np.pi * 0.17 * x + rng.uniform(0, 6.28))
    return y / max(1, len(freqs) * len(det) / 5) * sw

def cello(f, d):
    x = tt(d); ph = 2 * np.pi * f * x
    y = (2 * ((ph / (2 * np.pi)) % 1) - 1) * 0.5 + np.sin(ph) * 0.8 + 0.3 * np.sin(2 * ph)
    y = lp(y, 520) * (0.9 + 0.1 * np.sin(2 * np.pi * 5 * x))
    return y * adsr(len(x), 0.35, 0.5)

def drone(f, d):
    x = tt(d); y = np.zeros(len(x))
    for c, a in ((-6, .5), (0, 1), (7, .5)):
        ph = 2 * np.pi * f * 2 ** (c / 1200) * x; y += a * ((2 * ((ph / (2 * np.pi)) % 1) - 1) * .35 + np.sin(ph))
    y = lp(y, 320)
    return y * (0.8 + 0.2 * np.sin(2 * np.pi * 0.08 * x)) * adsr(len(x), 3.0, 3.0)

def frame_drum(vel=1.0, low=1.0):
    d = 0.9; x = tt(d); f = 62 * low * (1 + 0.8 * np.exp(-x / 0.045)); ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) * np.exp(-x / 0.22)
    n = lp(rng.standard_normal(len(x)), 700) * np.exp(-x / 0.03) * 0.9
    return (y + n) * vel

def taiko(vel=1.0):
    d = 1.4; x = tt(d); f = 48 * (1 + 1.2 * np.exp(-x / 0.06)); ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) * np.exp(-x / 0.45) + 0.3 * np.sin(2 * ph) * np.exp(-x / 0.12)
    n = lp(rng.standard_normal(len(x)), 1400) * np.exp(-x / 0.025) * 0.6
    return (y + n) * vel

def shaker(vel=1.0):
    d = 0.12; x = tt(d); n = lp(hp(rng.standard_normal(len(x)), 5500), 9500) * np.exp(-x / 0.025) * np.minimum(1, x / 0.004)
    return n * vel

def bell(f, d=3.2):
    x = tt(d); y = np.zeros(len(x))
    for ratio, a, tau in ((1, 1, 1.6), (2.01, .5, 1.0), (2.76, .35, 0.8), (5.4, .18, 0.35), (8.9, .08, 0.2)):
        y += a * np.sin(2 * np.pi * f * ratio * x + rng.uniform(0, 6.28)) * np.exp(-x / tau)
    return y * np.minimum(1, x / 0.003)

# ── música ───────────────────────────────────────────────────────────────────
CH = {  # acorde: (baixo, notas do arpejo (6), triade das cordas)
    'Dm': ('D2', ['D3', 'A3', 'D4', 'F4', 'A4', 'D5'], ['D3', 'F3', 'A3', 'D4']),
    'Bb': ('Bb1', ['Bb2', 'F3', 'Bb3', 'D4', 'F4', 'Bb4'], ['Bb2', 'D3', 'F3', 'Bb3']),
    'C':  ('C2', ['C3', 'G3', 'C4', 'E4', 'G4', 'C5'], ['C3', 'E3', 'G3', 'C4']),
    'F':  ('F2', ['F2', 'C3', 'F3', 'A3', 'C4', 'F4'], ['F3', 'A3', 'C4', 'F4']),
    'Gm': ('G2', ['G2', 'D3', 'G3', 'Bb3', 'D4', 'G4'], ['G3', 'Bb3', 'D4', 'G4']),
    'A':  ('A1', ['A2', 'E3', 'A3', 'C#4', 'E4', 'A4'], ['A3', 'C#4', 'E4', 'A4']),
}
PA = ['Dm', 'Dm', 'Bb', 'C']; PB = ['Dm', 'F', 'Gm', 'A']; PC = ['Gm', 'Dm', 'Bb', 'A']
# seção -> (compassos, progressão, camadas)
SECTIONS = [
    ('intro', PA, dict(lute=1, drone=1, bell=1)),
    ('verso1', PA, dict(lute=1, drone=1, flute='A', cello=1)),
    ('verso2', PB, dict(lute=1, drone=1, flute='B', cello=1, strings=.6)),
    ('refrao1', PA, dict(lute=1, drone=1, flute='A8', cello=1, strings=1, drum=1)),
    ('refrao2', PB, dict(lute=1, drone=1, flute='B8', cello=1, strings=1, drum=2)),
    ('ponte', PC, dict(lute=.7, drone=1, strings=.8, bell=1, flute='C')),
    ('final', PA, dict(lute=.8, drone=1, flute='D', cello=.6, strings=.5)),
]
# melodias: lista por compasso de (início em tempos, duração em tempos, nota)
MEL = {
 'A': [[(0, 2, 'A4'), (2, 1, 'F4'), (3, 1, 'G4')], [(0, 1.5, 'A4'), (1.5, .5, 'D5'), (2, 1, 'C5'), (3, 1, 'A4')], [(0, 2, 'D5'), (2, 1, 'C5'), (3, 1, 'Bb4')], [(0, 2, 'C5'), (2, 1, 'D5'), (3, 1, 'C5')]],
 'B': [[(0, 1.5, 'D5'), (1.5, .5, 'E5'), (2, 2, 'F5')], [(0, 1, 'E5'), (1, 1, 'D5'), (2, 2, 'C5')], [(0, 1, 'D5'), (1, 1, 'Bb4'), (2, 1, 'G4'), (3, 1, 'Bb4')], [(0, 2.5, 'A4'), (2.5, .5, 'G4'), (3, 1, 'A4')]],
 'C': [[(0, 4, 'G4')], [(0, 3, 'A4'), (3, 1, 'F4')], [(0, 4, 'D5')], [(0, 3, 'C#5'), (3, 1, 'A4')]],
 'D': [[(0, 3, 'A4'), (3, 1, 'G4')], [(0, 4, 'F4')], [(0, 2, 'D4'), (2, 2, 'F4')], [(0, 4, 'A4')]],
}
def up(mel, st=12): return [[(a, b, n if False else _tr(n, st)) for (a, b, n) in bar] for bar in mel]
def _tr(n, st):
    v = m(n) + st; names = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']; return f"{names[v % 12]}{v // 12 - 1}"
MEL['A8'] = [[(0, 2, 'A4'), (2, 1, 'D5'), (3, 1, 'F5')], [(0, 1.5, 'A5'), (1.5, .5, 'F5'), (2, 1, 'E5'), (3, 1, 'D5')], [(0, 2, 'D5'), (2, 1, 'F5'), (3, 1, 'D5')], [(0, 3, 'E5'), (3, 1, 'G4')]]
MEL['B8'] = [[(0, 1.5, 'F5'), (1.5, .5, 'G5'), (2, 2, 'A5')], [(0, 1, 'G5'), (1, 1, 'F5'), (2, 2, 'E5')], [(0, 1, 'D5'), (1, 1, 'F5'), (2, 1, 'G5'), (3, 1, 'Bb5')], [(0, 3, 'A5'), (3, 1, 'E5')]]

bar_i = 0
ARP = [0, 2, 1, 3, 2, 4, 3, 1]       # padrão de arpejo em colcheias
ARP2 = [0, 1, 2, 4, 3, 2, 5, 3]
for sname, prog, lay in SECTIONS:
    for k, chord in enumerate(prog):
        t0 = bar_i * BAR; bass, arp, tri = CH[chord]
        dens = 1.0
        if lay.get('drone'): put(drone(hz(bass), BAR + 0.5), t0, 0.0, 0.34)
        if lay.get('cello'): put(cello(hz(bass), BAR * 0.98), t0, -0.15, 0.30 * lay['cello'])
        if lay.get('strings'): put(strings([hz(n) for n in tri], BAR + 0.7), t0, 0.0, 0.22 * lay['strings'])
        if lay.get('lute'):
            pat = ARP if (bar_i % 2 == 0) else ARP2
            for e in range(8):
                vel = (1.0 if e % 4 == 0 else 0.7 if e % 2 == 0 else 0.55) * lay['lute']
                put(pluck(hz(arp[pat[e]]), 2.0, 0.9), t0 + e * BEAT / 2 + rng.uniform(-0.006, 0.006), -0.35, 0.40 * vel)
        if lay.get('flute'):
            for (a, b, n) in MEL[lay['flute']][k]:
                hi = lay['flute'] in ('A8', 'B8')
                put(flute(hz(n), b * BEAT * 0.97, breath=0.05), t0 + a * BEAT, 0.25 if hi else 0.18, 0.34 if hi else 0.30)
        if lay.get('bell') and k in (0, 2):
            put(bell(hz('A5' if k == 0 else 'D5')), t0 + BEAT * 2, 0.5, 0.10)
        if lay.get('drum'):
            hard = lay['drum'] == 2
            put(frame_drum(1.0, 1.0), t0, 0.1, 0.52)
            put(frame_drum(0.55, 1.1), t0 + 2 * BEAT, -0.1, 0.34)
            if hard:
                put(frame_drum(0.4, 1.2), t0 + 3.5 * BEAT, 0.0, 0.26)
                put(taiko(1.0), t0, 0.0, 0.36)
            else:
                put(taiko(0.8), t0 + 0.0, 0.0, 0.28) if k == 0 else None
            for e in range(8): put(shaker(0.5 if e % 2 else 0.8), t0 + e * BEAT / 2, 0.45, 0.07)
        bar_i += 1
assert bar_i == NBARS, bar_i

# ── reverb estéreo (cauda se dobra no começo) e acabamento ───────────────────
def conv(x, ir):
    n = len(x) + len(ir) - 1; k = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, k) * np.fft.rfft(ir, k), k)[:n]
def make_ir(d, seed):
    g = np.random.default_rng(seed); n = int(d * SR); ir = g.standard_normal(n) * np.exp(-np.linspace(0, 6.5, n)); ir = lp(hp(ir, 180), 5200)
    ir[:int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR)); return ir / np.abs(ir).max()
ir1, ir2 = make_ir(2.6, 1), make_ir(2.6, 2)
wet = 0.34
rl = conv(L, ir1)[:N] * wet * 0.06; rr = conv(R, ir2)[:N] * wet * 0.06
L2 = L + rl; R2 = R + rr
# laço: soma a cauda no começo
tail = int(TAIL * SR); T = int(TOTAL * SR)
L2[:tail] += L2[T:T + tail]; R2[:tail] += R2[T:T + tail]
L2, R2 = L2[:T], R2[:T]
# corta graves extremos e agudos ásperos, normaliza (RMS parecido com o das músicas do jogo) e limita com tanh
for ch in (L2, R2):
    ch[:] = hp(lp(ch, 11000, 2), 28, 2)
peak = max(np.abs(L2).max(), np.abs(R2).max()); L2 /= peak; R2 /= peak
rms = np.sqrt((L2 ** 2 + R2 ** 2).mean() / 2); target = 0.16
g = target / rms; L2 = np.tanh(L2 * g * 1.0) * 0.92; R2 = np.tanh(R2 * g * 1.0) * 0.92
# fade de 8 ms nas pontas só para não estalar se tocar fora do laço sample-accurate
out = (np.clip(np.stack([L2, R2], 1), -1, 1) * 32767).astype('<i2')
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes())
print(f'{T / SR:.1f} s, pico {np.abs(out).max() / 32767:.2f}, rms {np.sqrt((out.astype(float) ** 2).mean()) / 32767:.3f}')
