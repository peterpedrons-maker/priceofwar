"""Som da carta que vira cinza e vai para o cemitério (rodada 26; efeito visual em src/ashFx.ts). Síntese com numpy, 48 kHz, na mesma escala dos outros sons (Ré menor pentatônica).
Uso: python3 cinzas.py <pasta-saida> [arquivo-do-fogo.wav]
Linha do tempo (a mesma do efeito visual, medida no jogo): t=0 a carta começa a queimar (o som do fogo que o dono mandou toca aqui, 1,3 s); as primeiras
cinzas saem em ~0,2 s e as últimas em ~0,9 s; a nuvem viaja; t=2,33 ela chega ao cemitério e a carta aparece na pilha.
Camadas: vento de cinza (ruído com filtro que passeia) · rumor grave que cresce · brasas estalando (rareiam) · poeira brilhante (notas curtas que aumentam ao chegar) ·
chegada = baque surdo + sopro de cinza + a carta pousando na pilha + dois toques de sino descendo (réquiem)."""
import sys, os, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(23)
T_ARRIVE = 2.33                       # o instante em que a nuvem chega (medido no jogo)
TOTAL = 3.9

def t(d): return np.arange(int(SR * d)) / SR
def noise(d): return rng.standard_normal(int(SR * d))
def hz(note, octave=4):
    idx = {'D': 2, 'F': 5, 'G': 7, 'A': 9, 'C': 0}[note]; return 440 * 2 ** (((octave + 1) * 12 + idx - 69) / 12)
def smooth(x, a, b): u = np.clip((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u)
def filt(x, lo=None, hi=None, order=4):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    if lo: X *= 1 / (1 + (lo / np.maximum(f, 1)) ** order)
    if hi: X *= 1 / (1 + (f / hi) ** order)
    return np.fft.irfft(X, len(x))

def wander_band(d, center, width_oct=1.2, win=.12):
    """Ruído cujo centro de frequência muda no tempo (center(t) em Hz), em janelas sobrepostas: o vento da nuvem passeando."""
    n = noise(d + .3); L = len(n); out = np.zeros(L); N = int(win * SR); hop = N // 2; w = np.hanning(N)
    for i in range(0, L - N, hop):
        c = center(i / SR); seg = n[i:i + N] * w
        out[i:i + N] += filt(seg, c / 2 ** (width_oct / 2), c * 2 ** (width_oct / 2), 2)
    return out[:int(SR * d)]

def tone(f, d, tau=.2, a=.003, glide=None, harm=(), kind='sine'):
    x = t(d); ff = f * (np.ones_like(x) if glide is None else np.exp(np.log(glide) * np.minimum(1, x / d)))
    ph = 2 * np.pi * np.cumsum(ff) / SR; w = np.sin(ph) if kind == 'sine' else 2 / np.pi * np.arcsin(np.sin(ph))
    for k, am in harm: w = w + am * np.sin(k * ph)
    e = np.exp(-x / tau); na = int(a * SR); e[:na] *= np.linspace(0, 1, max(1, na)); return w * e

def put(buf, off, x, gain=1.0):
    i = int(off * SR)
    if i >= len(buf): return
    j = min(len(buf), i + len(x)); buf[i:j] += x[:j - i] * gain

def reverb(x, wet=.2, d=.45, seed=5):
    r = np.random.default_rng(seed); n = int(SR * d); ir = r.standard_normal(n) * np.exp(-np.linspace(0, 6.5, n)); ir = filt(ir, 250, 7000); ir /= np.abs(ir).max()
    return np.convolve(x, ir)[:len(x)] * wet

def build():
    L = int(SR * TOTAL); mix = np.zeros(L)
    # 1. vento de cinza: começa agudo e quente, esfria e engrossa, e aperta (sobe) quando a nuvem converge
    sw = lambda s: 1500 * np.exp(-s * .55) + 380 + 520 * np.sin(2 * np.pi * (.9 + .5 * s) * s) * np.exp(-s * .3) + 900 * smooth(s, 1.5, T_ARRIVE)
    wind = wander_band(T_ARRIVE + .15, sw, 1.3)
    env = smooth(t(len(wind) / SR), .05, .7) * (.55 + .45 * smooth(t(len(wind) / SR), 1.2, T_ARRIVE)) * (1 - smooth(t(len(wind) / SR), T_ARRIVE - .05, T_ARRIVE + .12))
    wind = wind / (np.abs(wind).max() or 1) * env
    put(mix, .12, wind, .55)
    # 2. rumor grave que cresce até a chegada (a nuvem "pesa")
    rumble = filt(noise(T_ARRIVE), None, 240, 2); rumble *= smooth(t(T_ARRIVE), .2, T_ARRIVE - .05) ** 1.4 * (1 - smooth(t(T_ARRIVE), T_ARRIVE - .03, T_ARRIVE))
    put(mix, 0, rumble / (np.abs(rumble).max() or 1), .32)
    # 3. brasas estalando: muitas no começo (queimando), poucas depois
    tt = 0.0
    while tt < 2.1:
        rate = 46 * np.exp(-tt * 1.45) + 6
        tt += rng.exponential(1 / rate)
        d = rng.uniform(.002, .009); n = filt(noise(d), 1800, 7500, 2) * np.exp(-t(d) / (d * .35)); a = rng.uniform(.06, .3) * (1.1 if tt < .9 else .75)
        put(mix, tt, n / (np.abs(n).max() or 1), a)
        if rng.random() < .2: put(mix, tt, tone(rng.uniform(500, 1300), .012, .004, glide=.7) * .6, a * .5)
    # 4. poeira brilhante: notas curtíssimas (pentatônica) que se multiplicam quando as cinzas entram na pilha
    scale = [('D', 5), ('F', 5), ('G', 5), ('A', 5), ('C', 6), ('D', 6), ('F', 6), ('A', 6)]
    tt = 1.15
    while tt < T_ARRIVE + .05:
        u = (tt - 1.15) / (T_ARRIVE - 1.15); rate = 4 + 40 * u ** 1.6
        tt += rng.exponential(1 / rate)
        f = hz(*scale[min(len(scale) - 1, int(rng.uniform(0, 3 + 5 * u)))]); d = rng.uniform(.08, .22)
        put(mix, tt, tone(f, d, rng.uniform(.04, .09), .002, harm=[(2, .22)]) , rng.uniform(.025, .07) * (.5 + u))
    # 5. a chegada ao cemitério
    A = T_ARRIVE
    thump = tone(95, .55, .2, .001, glide=.42) * 1.15; put(mix, A, thump, .85)                                  # baque surdo, grave que cai
    put(mix, A, filt(noise(.5), None, 1000, 2) * np.exp(-t(.5) / .16), .38)                                       # sopro de cinza (abafado)
    put(mix, A, filt(noise(.9), 700, 5200, 2) * np.exp(-t(.9) / .3), .13)                                        # fumaça subindo (aérea)
    slap = filt(noise(.03), 1400, 5200, 2) * np.exp(-t(.03) / .007); put(mix, A + .012, slap / (np.abs(slap).max() or 1), .5)   # a carta pousando na pilha
    put(mix, A + .05, slap / (np.abs(slap).max() or 1), .18)                                                        # e acomodando
    put(mix, A + .03, tone(hz('D', 4), 1.8, .62, .004, harm=[(2, .25), (3, .08)]), .17)                          # réquiem: dois toques de sino descendo
    put(mix, A + .2, tone(hz('A', 3), 1.9, .7, .004, harm=[(2, .22)]), .14)
    put(mix, A + .02, tone(hz('D', 3), 1.4, .45, .002, kind='tri'), .16)
    # 6. ar do lugar
    wet = reverb(mix, .24)
    return mix + wet

def save(path, x):
    x = x - x.mean(); x = np.tanh(x / (np.abs(x).max() or 1) * 1.5) / np.tanh(1.5) * .84
    with wave.open(path, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())

def read_wav(path):
    w = wave.open(path); n = w.getnframes(); ch = w.getnchannels(); sr = w.getframerate()
    a = np.frombuffer(w.readframes(n), dtype='<i2').astype(np.float64) / 32768
    a = a.reshape(-1, ch).mean(axis=1) if ch > 1 else a
    if sr != SR: a = np.interp(np.arange(int(len(a) * SR / sr)) / SR, np.arange(len(a)) / sr, a)
    return a

if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else '.'; os.makedirs(out, exist_ok=True)
    x = build(); save(os.path.join(out, 'cinzas-nuvem-e-chegada.wav'), x)
    if len(sys.argv) > 2:   # prévia: o fogo do dono (t=0) + a nuvem e a chegada
        fire = read_wav(sys.argv[2]); mixd = np.zeros(len(x)); put(mixd, 0, fire / (np.abs(fire).max() or 1), .9); mixd += x * .95
        save(os.path.join(out, 'cinzas-previa-com-fogo.wav'), mixd)
    print('ok', round(len(x) / SR, 2), 's')
