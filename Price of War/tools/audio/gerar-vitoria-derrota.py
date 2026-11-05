"""Sons de fim de partida, sintetizados (numpy), com o mesmo tom dos outros sons do jogo (Ré).
Vitória: fanfarra de metais em Ré maior (arpejo A3-D4-F#4-A4 subindo para um acorde aberto D5), tímpano, brilho de prato e sinos no fim. ~3,4 s.
Derrota: metais graves e abafados em Ré menor, descendo (A3-F3-D3), tímpano surdo, pulso fúnebre e um acorde que apaga. ~3,2 s.
Uso: python3 gerar-vitoria-derrota.py <pasta>   (gera vitoria.wav e derrota.wav; depois: ffmpeg -i vitoria.wav -c:a libmp3lame -b:a 128k src/assets/sfx-vitoria.mp3, idem derrota)"""
import sys, os, wave
import numpy as np
SR = 44100
rng = np.random.default_rng(5)
def lp(x, fc, o=2):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); return np.fft.irfft(X / np.sqrt(1 + (f / fc) ** (2 * o)), len(x))
def hp(x, fc, o=2):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); return np.fft.irfft(X / np.sqrt(1 + (fc / np.maximum(f, 1)) ** (2 * o)), len(x))
def adsr(n, a, d, s, r):
    e = np.ones(n); na, nd, nr = int(a * SR), int(d * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na); e[na:na + nd] = np.linspace(1, s, nd); e[na + nd:] = s; e[n - nr:] *= np.linspace(1, 0, nr); return e
def brass(f, dur, bright=3500, a=0.06, vib=5.0, vibd=0.003, g=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    out = np.zeros(n)
    for det in (-0.004, 0.0, 0.004):                       # três vozes levemente desafinadas (corpo de naipe)
        fi = f * (1 + det) * (1 + vibd * np.sin(2 * np.pi * vib * t + rng.uniform(0, 6)) * np.minimum(1, t / 0.4))
        ph = 2 * np.pi * np.cumsum(fi) / SR
        for h in range(1, 14): out += np.sin(h * ph) / (h ** 1.15)
    out = lp(out, bright, 2) * adsr(n, a, 0.08, 0.8, min(0.35, dur * 0.4))
    return out / 3 * g
def timp(f0=110, f1=58, dur=1.1, g=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / 0.05); ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / 0.28)
    hit = lp(hp(rng.standard_normal(n), 90), 700) * np.exp(-t / 0.018) * 0.7
    return np.tanh((body + hit) * 1.6) * g
def shimmer(dur, g=0.3):
    n = int(dur * SR); t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 5500) * (1 - np.exp(-t / 0.5)) * np.exp(-t / 0.9) * g * 0.35
def bell(f, dur, g=0.2):
    n = int(dur * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.76 * t) + 0.25 * np.sin(2 * np.pi * f * 5.4 * t)) * np.exp(-t / (dur * 0.35)) * g
def place(buf, x, t0):
    i = int(t0 * SR); n = min(len(x), len(buf) - i)
    if n > 0: buf[i:i + n] += x[:n]
def finish(x, name, ir_len=0.9, wet=0.22, dark=2600):
    n_ir = int(ir_len * SR); ir = rng.standard_normal(n_ir) * np.exp(-np.linspace(0, 6.5, n_ir)); ir = lp(hp(ir, 120), dark, 2); ir /= np.abs(ir).max()
    y = x + np.convolve(x, ir)[:len(x)] * wet
    y /= np.abs(y).max()
    y = np.tanh(y * 1.15) / np.tanh(1.15)                              # limitador suave: segura os picos sem achatar
    y *= 0.708 / np.abs(y).max()                                       # pico em -3 dB
    k = int(0.08 * SR); y[-k:] *= np.linspace(1, 0, k)
    pcm = (np.clip(y, -1, 1) * 32767).astype('<i2')
    with wave.open(name, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print(name, f'{len(y)/SR:.2f}s', f'rms {20*np.log10(np.sqrt((y**2).mean())):.1f} dB')
D3, F3, A3, D4, Fs4, A4, D5, Fs5, A5, D6 = 146.83, 174.61, 220.0, 293.66, 369.99, 440.0, 587.33, 739.99, 880.0, 1174.66
def vitoria():
    x = np.zeros(int(3.6 * SR))
    place(x, timp(g=1.0), 0.0); place(x, timp(130, 70, g=0.55), 0.36)
    for t0, f, d in ((0.0, A3, 0.34), (0.2, D4, 0.34), (0.4, Fs4, 0.34), (0.6, A4, 0.42)):
        place(x, brass(f, d, 4200, 0.03, g=0.8), t0)
    for f, g in ((D4, 0.55), (A4, 0.6), (D5, 0.7), (Fs5, 0.5), (A5, 0.4)):   # acorde aberto sustentado
        place(x, brass(f, 2.0, 4600, 0.07, g=g), 1.0)
    place(x, brass(D3, 2.0, 1800, 0.05, g=0.8), 1.0)
    place(x, timp(120, 62, g=0.9), 1.0)
    place(x, shimmer(2.2), 1.0)
    for i, f in enumerate((D6, A5, Fs5 * 2, D6 * 1.5)): place(x, bell(f, 1.4, 0.16), 1.55 + i * 0.11)
    finish(x, os.path.join(sys.argv[1], 'vitoria.wav'), 1.1, 0.22, 3200)
def derrota():
    x = np.zeros(int(3.4 * SR))
    place(x, timp(85, 44, 1.4, 1.0), 0.0)
    for t0, f, d in ((0.15, A3, 0.6), (0.85, F3, 0.6), (1.55, D3, 1.6)):
        place(x, brass(f, d, 1100, 0.14, 4.2, 0.004, g=0.9), t0)
        place(x, brass(f / 2, d, 700, 0.18, g=0.6), t0)
    place(x, brass(D3 * 1.189, 1.5, 900, 0.2, g=0.35), 1.55)        # terça menor: Dm
    place(x, brass(A3 / 1 * 0.75 * 2 / 2, 1.5, 900, 0.2, g=0.3), 1.55)
    for t0 in (0.9, 1.6): place(x, timp(70, 40, 1.0, 0.45), t0)       # pulso fúnebre
    place(x, timp(70, 36, 1.6, 0.8), 2.2)
    finish(x, os.path.join(sys.argv[1], 'derrota.wav'), 1.3, 0.28, 1500)
vitoria(); derrota()
