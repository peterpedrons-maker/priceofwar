"""Gera efeitos sonoros do jogo por síntese (numpy), todos afinados na mesma escala (Ré menor pentatônica) e com o mesmo "ar" (reverb curto).
Uso: python3 gerar-sons.py <pasta-saida>
Cada som tem duas versões: A (suave, mais musical) e B (seca, mais percussiva). WAV 16 bits, 44,1 kHz, mono."""
import sys, os, wave
import numpy as np
SR = 44100
rng = np.random.default_rng(7)
def hz(note, octave=4):  # notas da escala Ré menor pentatônica: D F G A C
    idx = {'D': 2, 'F': 5, 'G': 7, 'A': 9, 'C': 0, 'E': 4, 'B': 11, 'Bb': 10}[note]; return 440 * 2 ** (((octave + 1) * 12 + idx - 69) / 12)
def t(d): return np.arange(int(SR * d)) / SR
def env(n, a=.005, d=.1, s=.0, r=.1, sl=0.0):
    e = np.zeros(n); na, nd, nr = int(a * SR), int(d * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, max(1, na)); e[na:na + nd] = np.linspace(1, sl, max(1, nd)) if sl else np.exp(-np.linspace(0, 6, max(1, nd)))
    e[na + nd:] = 0 if sl == 0 else sl
    if sl: e[n - nr:] *= np.linspace(1, 0, nr)
    return e
def expenv(n, a=.003, tau=.12):
    x = np.arange(n) / SR; e = np.exp(-x / tau); na = int(a * SR); e[:na] *= np.linspace(0, 1, max(1, na)); return e
def tone(f, d, kind='sine', tau=.15, a=.004, glide=None, harm=None):
    x = t(d); ff = f * (1 if glide is None else np.exp(np.log(glide) * np.minimum(1, x / d)))
    ph = 2 * np.pi * np.cumsum(ff) / SR
    w = np.sin(ph) if kind == 'sine' else (2 / np.pi * np.arcsin(np.sin(ph)) if kind == 'tri' else np.sign(np.sin(ph)) * .5)
    for k, am in (harm or []): w = w + am * np.sin(k * ph)
    return w * expenv(len(x), a, tau)
def noise(d): return rng.standard_normal(int(SR * d))
def filt(x, lo=None, hi=None):  # filtro de passa-faixa por FFT
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    if lo: X *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi: X *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X, len(x))
def sweep_noise(d, f0, f1, q=3):  # whoosh: ruído filtrado cujo centro anda de f0 a f1
    n = noise(d); out = np.zeros(len(n)); seg = 24; L = len(n) // seg
    for i in range(seg):
        c = f0 * (f1 / f0) ** (i / (seg - 1)); s = n[i * L:(i + 1) * L if i < seg - 1 else None]
        out[i * L:i * L + len(s)] = filt(s, c / q * 1.3, c * q / 1.3)
    return out
def mix(parts, total):
    out = np.zeros(int(SR * total))
    for off, x in parts:
        i = int(off * SR); out[i:i + len(x)] += x[:len(out) - i]
    return out
def reverb(x, wet=.18, d=.35):
    n = int(SR * d); ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n)); ir = filt(ir, 300, 6000); ir /= np.abs(ir).max()
    y = np.convolve(x, ir)[:len(x) + n] * wet; y[:len(x)] += x; return y
def fin(x, peak=.8):
    x = x - x.mean(); m = np.abs(x).max() or 1; x = np.tanh(x / m * 1.4) / np.tanh(1.4) * peak
    fade = int(.01 * SR); x[-fade:] *= np.linspace(1, 0, fade); return x
def save(name, x, out):
    x = fin(reverb(x)); a = (np.clip(x, -1, 1) * 32767).astype('<i2')
    with wave.open(os.path.join(out, name + '.wav'), 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes())
    print(name, round(len(x) / SR, 2), 's')

def impacto(v):   # golpe de ataque: grave que cai + estalo + faísca
    thump = tone(110 if v == 'A' else 140, .35, 'sine', tau=.09, glide=.45) * 1.4
    crack = filt(noise(.12), 1500, 9000) * expenv(int(SR * .12), .0005, .03 if v == 'B' else .045) * (.7 if v == 'B' else .45)
    ring = tone(hz('D', 5), .5, 'tri', tau=.18, harm=[(2, .3)]) * (.12 if v == 'A' else .05)
    return mix([(0, thump), (0, crack), (.01, ring)], .7)
def cura(v):      # acorde de Ré menor subindo (D F A D) com brilho
    ns = [('D', 4), ('F', 4), ('A', 4), ('D', 5)] if v == 'A' else [('A', 4), ('D', 5), ('F', 5)]
    parts = [(i * (.09 if v == 'A' else .07), tone(hz(*n), .9, 'sine', tau=.35, harm=[(2, .25), (3, .08)]) * .55) for i, n in enumerate(ns)]
    parts.append((.0, filt(noise(.6), 5000, 12000) * expenv(int(SR * .6), .05, .25) * .06))
    return mix(parts, 1.1)
def comprar(v):   # carta saindo do baralho: sopro de papel + 'tick' afinado
    sl = sweep_noise(.28, 1800, 5200) * expenv(int(SR * .28), .02, .1) * (.5 if v == 'A' else .7)
    tick = tone(hz('A', 5), .12, 'sine', tau=.04) * (.35 if v == 'A' else .2)
    flip = filt(noise(.05), 2500, 9000) * expenv(int(SR * .05), .0005, .012) * .5
    return mix([(0, sl), (.2, tick), (.16 if v == 'A' else .18, flip)], .5)
def pegar():      # pegar a carta (segurar): tec curto, grave suave
    return mix([(0, tone(hz('D', 3), .1, 'sine', tau=.04) * .8), (.0, filt(noise(.04), 2000, 8000) * expenv(int(SR * .04), .0005, .01) * .35)], .2)
def arrastando():  # carta deslizando no ar: sopro leve contínuo (laço de 0,5 s)
    n = filt(noise(.5), 1200, 4500); e = np.sin(np.linspace(0, np.pi, len(n))) ** 2; return n * e * .35
def soltar():     # soltou sem jogar: tec leve
    return mix([(0, tone(hz('G', 3), .08, 'sine', tau=.03) * .6)], .15)
def clique():     # clique de interface: dois tons curtos (D e A)
    return mix([(0, tone(hz('D', 5), .07, 'sine', tau=.025) * .6), (.04, tone(hz('A', 5), .09, 'sine', tau=.03) * .4)], .2)
# convocar em partes
def conv_voo():   # carta flutuando até a casa: whoosh que sobe
    return sweep_noise(.55, 500, 2600) * np.sin(np.linspace(0, np.pi, int(SR * .55))) ** 1.5 * .8 + tone(hz('D', 4), .55, 'sine', tau=.4, glide=1.5) * .08
def conv_impacto():  # batida na casa: grave + madeira + estalo
    return mix([(0, tone(95, .4, 'sine', tau=.1, glide=.5) * 1.5), (0, filt(noise(.15), 400, 3500) * expenv(int(SR * .15), .0005, .05) * .8), (0, filt(noise(.06), 3000, 9000) * expenv(int(SR * .06), .0005, .015) * .4)], .6)
def conv_brilho():   # brilho depois do impacto: arpejo curto D A D
    return mix([(i * .06, tone(hz(n, o), .7, 'sine', tau=.3, harm=[(2, .3), (4, .1)]) * .5) for i, (n, o) in enumerate([('D', 5), ('A', 5), ('D', 6)])], 1.0)

if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else 'sons'; os.makedirs(out, exist_ok=True)
    for v in 'AB':
        save('impacto-ataque-' + v, impacto(v), out); save('cura-' + v, cura(v), out); save('comprar-carta-' + v, comprar(v), out)
    save('carta-pegar', pegar(), out); save('carta-arrastando', arrastando(), out); save('carta-soltar', soltar(), out); save('clique-ui', clique(), out)
    save('convocar-1-voo', conv_voo(), out); save('convocar-2-impacto', conv_impacto(), out); save('convocar-3-brilho', conv_brilho(), out)
