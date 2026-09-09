class AudioService {
  private ctx: AudioContext | null = null;
  private enabled = true;
  private initialized = false;

  public init() {
    if (this.initialized) return;
    if (typeof window !== 'undefined') {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
        this.initialized = true;
      } catch (e) {
        console.warn('AudioContext not supported');
      }
    }
  }

  public enable() {
    this.enabled = true;
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public disable() {
    this.enabled = false;
  }

  public toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + duration);
      
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e) {}
  }

  private playNoise(duration: number, vol: number = 0.1, highpass = false) {
    if (!this.enabled || !this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
      
      if (highpass) {
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;
        noise.connect(filter);
        filter.connect(gain);
      } else {
        noise.connect(gain);
      }
      
      gain.connect(this.ctx.destination);
      noise.start();
    } catch(e) {}
  }

  playDrawCard = () => {
    this.playNoise(0.15, 0.05, true);
  }

  playPlayCard = () => {
    this.playTone(150, 'sine', 0.2, 0.15);
    this.playNoise(0.1, 0.05);
  }

  playAttack = () => {
    this.playNoise(0.2, 0.2, true);
    this.playTone(400, 'sawtooth', 0.1, 0.05);
  }

  playDamage = () => {
    this.playTone(80, 'square', 0.3, 0.2);
    this.playNoise(0.3, 0.2);
  }

  playHeal = () => {
    if (!this.ctx || !this.enabled) return;
    this.playTone(523.25, 'sine', 0.4, 0.05); 
    setTimeout(() => this.playTone(659.25, 'sine', 0.4, 0.05), 100); 
    setTimeout(() => this.playTone(783.99, 'sine', 0.6, 0.05), 200); 
  }

  playClick = () => {
    this.playTone(800, 'sine', 0.05, 0.02);
  }

  playHover = () => {
    this.playTone(600, 'sine', 0.02, 0.01);
  }
  
  playPhaseChange = () => {
    if (!this.ctx || !this.enabled) return;
    this.playTone(300, 'triangle', 0.2, 0.05);
    setTimeout(() => this.playTone(450, 'triangle', 0.4, 0.05), 150);
  }
  
  playVictory = () => {
    if (!this.ctx || !this.enabled) return;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'square', 0.5, 0.1), i * 150);
    });
  }
  
  playDefeat = () => {
    if (!this.ctx || !this.enabled) return;
    [300, 280, 250, 200].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sawtooth', 0.6, 0.1), i * 250);
    });
  }
}

export const audio = new AudioService();
