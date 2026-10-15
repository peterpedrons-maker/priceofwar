"""Som da carta que vira cinza e vai para o cemitério (rodada 26; efeito visual em src/ashFx.ts), versão 2: POUCOS sons, todos dos que o dono já aprovou no jogo.
(A versão 1, toda sintetizada, tinha barulho demais e sem sentido: foi descartada.)
Uso: python3 cinzas.py <pasta-saida> <pasta-assets>   (pasta-assets = src/assets)
Linha do tempo medida no jogo: t=0 a carta começa a queimar; as cinzas saem de 0,2 a 0,9 s; a nuvem chega ao cemitério em t=2,33 s e a carta aparece na pilha.
  t=0     o fogo do dono (sfx-destruicao-fogo.wav, 1,3 s)
  t=0,55  (só na versão A) o brilho mágico do dono (sfx-efeito-magico.mp3) bem suave, como a nuvem viajando; termina na chegada
  t=2,33  a carta pousando na pilha (sfx-jogar-carta.wav, abafado) + um baque grave curto
Versão A = fogo + nuvem + chegada · Versão B = fogo + chegada (sem nada no meio)."""
import sys, os, subprocess, wave
import numpy as np

SR = 48000
T_ARRIVE = 2.33

def load(path):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', path, '-f', 's16le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
    return (np.frombuffer(raw, dtype='<i2').astype(np.float64) / 32768).reshape(-1, 2)

def lowpass(x, hz):
    X = np.fft.rfft(x, axis=0); f = np.fft.rfftfreq(len(x), 1 / SR)[:, None]; X *= 1 / (1 + (f / hz) ** 4); return np.fft.irfft(X, len(x), axis=0)

def put(buf, off, x, gain=1.0):
    i = int(off * SR); j = min(len(buf), i + len(x)); buf[i:j] += x[:j - i] * gain

def thump(d=.45):
    t = np.arange(int(SR * d)) / SR; f = 78 * np.exp(np.log(.62) * np.minimum(1, t / d)); ph = 2 * np.pi * np.cumsum(f) / SR
    e = np.exp(-t / .12); e[:int(.002 * SR)] *= np.linspace(0, 1, int(.002 * SR)); w = np.sin(ph) * e; return np.stack([w, w], axis=1)

def build(assets, with_cloud):
    out = np.zeros((int(SR * 3.6), 2))
    fire = load(os.path.join(assets, 'sfx-destruicao-fogo.wav')); put(out, 0, fire, 1.0)
    if with_cloud:
        mag = load(os.path.join(assets, 'sfx-efeito-magico.mp3')); mag = lowpass(mag, 3200)
        n = int((T_ARRIVE - .55) * SR); mag = mag[:n].copy()
        fi, fo = int(.35 * SR), int(.25 * SR); mag[:fi] *= np.linspace(0, 1, fi)[:, None]; mag[-fo:] *= np.linspace(1, 0, fo)[:, None]
        put(out, .55, mag, .42)
    land = lowpass(load(os.path.join(assets, 'sfx-jogar-carta.wav')), 4200); put(out, T_ARRIVE, land, .85)
    put(out, T_ARRIVE, thump(), .55)
    return out

def save(path, x):
    m = np.abs(x).max() or 1; x = x / m * .85
    with wave.open(path, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())

if __name__ == '__main__':
    out, assets = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
    save(os.path.join(out, 'cinzas-A-fogo-nuvem-chegada.wav'), build(assets, True))
    save(os.path.join(out, 'cinzas-B-fogo-chegada.wav'), build(assets, False))
    print('ok')
