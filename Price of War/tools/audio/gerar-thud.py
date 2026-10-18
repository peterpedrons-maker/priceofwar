"""Som de jogar uma carta: algo PESADO caindo no chão (uma rocha batendo na terra), "tum".
Camadas: (1) sub-baixo que desce de ~110 a ~38 Hz com saturação (os harmônicos fazem o grave aparecer em alto-falante de celular), (2) corpo grave-médio de ruído filtrado,
(3) estalo seco do contato (ruído 1,5–5 kHz, ~10 ms), (4) pedregulhos: 6 estalinhos curtos que se espalham, (5) poeira: sopro grave que cai, (6) sala curta e escura.
O golpe forte fica a ~12 ms do início (o jogo toca o som no quadro do impacto). Uso: python3 gerar-thud.py saida.wav  (depois: ffmpeg -i saida.wav -c:a libmp3lame -b:a 128k src/assets/sfx-convocar-pedra.mp3)"""
import sys, wave
import numpy as np
SR = 44100
rng = np.random.default_rng(11)
N = int(0.95 * SR)
t = np.arange(N) / SR
def lp(x, fc, o=4):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); return np.fft.irfft(X / np.sqrt(1 + (f / fc) ** (2 * o)), len(x))
def hp(x, fc, o=2):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); return np.fft.irfft(X / np.sqrt(1 + (fc / np.maximum(f, 1)) ** (2 * o)), len(x))
def env(tau, a=0.002, n=N):
    e = np.exp(-np.arange(n) / SR / tau); k = int(a * SR); e[:k] *= np.linspace(0, 1, k); return e
T0 = int(0.012 * SR)
def at(x, off=T0, g=1.0):
    y = np.zeros(N); n = min(len(x), N - off); y[off:off + n] = x[:n] * g; return y
# 1) sub-baixo: frequência cai rápido (golpe) e depois assenta
dur = 0.7; tt = np.arange(int(dur * SR)) / SR
f = 38 + 78 * np.exp(-tt / 0.055); ph = 2 * np.pi * np.cumsum(f) / SR
sub = np.sin(ph) * np.exp(-tt / 0.14) * np.minimum(1, (dur - tt) / 0.12); sub = np.tanh(sub * 2.6) * 0.95
# 2) corpo (terra/pedra): ruído grave filtrado
body = lp(hp(rng.standard_normal(int(0.5 * SR)), 55), 420) * env(0.07, 0.001, int(0.5 * SR)) * 1.8 * np.minimum(1, (0.5 - np.arange(int(0.5 * SR)) / SR) / 0.1)
# 3) estalo do contato
crack = hp(lp(rng.standard_normal(int(0.05 * SR)), 5200), 1500) * env(0.006, 0.0005, int(0.05 * SR)) * 0.9
# 4) pedregulhos: estalinhos curtos depois do impacto
deb = np.zeros(N)
for i in range(7):
    off = int((0.03 + i * rng.uniform(0.014, 0.028)) * SR); L = int(0.03 * SR)
    c = bp = hp(lp(rng.standard_normal(L), rng.uniform(1800, 4200)), rng.uniform(500, 1100)) * env(rng.uniform(.004, .01), 0.0004, L) * rng.uniform(.12, .32)
    if off + L < N: deb[off:off + L] += c
# 5) poeira: sopro grave que cai
dust = lp(hp(rng.standard_normal(int(0.55 * SR)), 120), 900) * env(0.17, 0.02, int(0.55 * SR)) * 0.22
x = at(sub, T0, 1.0) + at(body, T0, 0.75) + at(crack, T0, 0.55) + deb + at(dust, T0 + int(0.01 * SR), 0.5)
# 6) sala curta e escura
n_ir = int(0.5 * SR); ir = rng.standard_normal(n_ir) * np.exp(-np.linspace(0, 8, n_ir)); ir = lp(hp(ir, 90), 1800); ir /= np.abs(ir).max()
wet = np.convolve(x, ir)[:N] * 0.05
x = x + wet
x = x - x.mean()
x = np.tanh(x / np.abs(x).max() * 1.5) / np.tanh(1.5)        # limitação suave: dá "peso" sem estourar
x *= 0.93 / np.abs(x).max()
fade = int(0.04 * SR); x[-fade:] *= np.linspace(1, 0, fade)
out = (np.clip(x, -1, 1) * 32767).astype('<i2')
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes())
print(f'{N / SR:.2f} s, pico {np.abs(out).max() / 32767:.2f}, rms {np.sqrt((out.astype(float) ** 2).mean()) / 32767:.3f}')
