/* ==========================================================================
   Hearthly-Inspired Minimalist Procedural Web Audio Soundscape Engine
   Smooth transition: Warm calming ambient pad -> Detuned dread -> Silence -> Strike
   ========================================================================== */

class HengshengAudio {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.initialized = false;
    this.d = 0;

    this.master = null;
    this.warmGain = null;
    this.warmOscs = [];
    this.droneGain = null;
    this.droneFilter = null;
    this.hissGain = null;
    this.dissGain = null;
    this.lastBeat = 0;
  }

  init() {
    if (this.initialized) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    const now = this.ctx.currentTime;

    this.master = this.ctx.createGain();
    this.master.gain.setValueAtTime(0.0001, now);
    this.master.connect(this.ctx.destination);

    // 1. Warm Calming FinTech Pad (C major 9 shimmer at top, subtly detunes downward with --d!)
    const warmFilter = this.ctx.createBiquadFilter();
    warmFilter.type = "lowpass";
    warmFilter.frequency.setValueAtTime(520, now);
    this.warmGain = this.ctx.createGain();
    this.warmGain.gain.setValueAtTime(0.045, now);
    warmFilter.connect(this.warmGain);
    this.warmGain.connect(this.master);

    [130.81, 196.0, 246.94, 293.66].forEach((baseFreq) => {
      const osc = this.ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.connect(warmFilter);
      osc.start(now);
      this.warmOscs.push({ osc, baseFreq });
    });

    // 2. Dark Detuned Sub-Drone (emerges smoothly past d = 0.28)
    const d1 = this.ctx.createOscillator();
    const d2 = this.ctx.createOscillator();
    d1.type = "sawtooth";
    d2.type = "sawtooth";
    d1.frequency.setValueAtTime(41.2, now);
    d2.frequency.setValueAtTime(41.95, now);

    this.droneFilter = this.ctx.createBiquadFilter();
    this.droneFilter.type = "lowpass";
    this.droneFilter.frequency.setValueAtTime(90, now);
    this.droneFilter.Q.setValueAtTime(4.0, now);

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.0, now);
    d1.connect(this.droneFilter);
    d2.connect(this.droneFilter);
    this.droneFilter.connect(this.droneGain);
    this.droneGain.connect(this.master);
    d1.start(now);
    d2.start(now);

    // 3. Eerie Bowed-Metal Dissonance (past d = 0.52)
    const dissFilter = this.ctx.createBiquadFilter();
    dissFilter.type = "bandpass";
    dissFilter.frequency.setValueAtTime(480, now);
    dissFilter.Q.setValueAtTime(6.5, now);
    this.dissGain = this.ctx.createGain();
    this.dissGain.gain.setValueAtTime(0.0, now);
    dissFilter.connect(this.dissGain);
    this.dissGain.connect(this.master);

    [277.18, 293.66, 311.13].forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator();
      const lfoG = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now);
      lfo.frequency.setValueAtTime(0.11 + idx * 0.06, now);
      lfoG.gain.setValueAtTime(3.6, now);
      lfo.connect(lfoG);
      lfoG.connect(osc.frequency);
      osc.connect(dissFilter);
      osc.start(now);
      lfo.start(now);
    });

    // 4. Filtered Tape Grain / Breath Hiss
    const len = this.ctx.sampleRate * 3;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const ch = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      ch[i] = (last + 0.04 * w) / 1.04;
      last = ch[i];
      ch[i] *= 2.2;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    const hissFilter = this.ctx.createBiquadFilter();
    hissFilter.type = "bandpass";
    hissFilter.frequency.setValueAtTime(1050, now);
    hissFilter.Q.setValueAtTime(2.2, now);
    this.hissGain = this.ctx.createGain();
    this.hissGain.gain.setValueAtTime(0.0, now);
    src.connect(hissFilter);
    hissFilter.connect(this.hissGain);
    this.hissGain.connect(this.master);
    src.start(now);

    this.initialized = true;
    this.loopHeartbeat();
  }

  enable() {
    this.init();
    if (!this.ctx) return false;
    if (this.ctx.state === "suspended") this.ctx.resume();
    this.enabled = true;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(0.72, now, 0.25);
    this.updateDecay(this.d);
    return true;
  }

  disable() {
    this.enabled = false;
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(0.0001, now, 0.16);
  }

  toggle() {
    return this.enabled ? (this.disable(), false) : this.enable();
  }

  updateDecay(d, silence = false) {
    this.d = Math.max(0, Math.min(1, d));
    if (!this.initialized || !this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;

    if (silence) {
      this.warmGain.gain.setTargetAtTime(0.0001, now, 0.05);
      this.droneGain.gain.setTargetAtTime(0.0001, now, 0.05);
      this.dissGain.gain.setTargetAtTime(0.0001, now, 0.05);
      this.hissGain.gain.setTargetAtTime(0.0001, now, 0.05);
      return;
    }

    // Warm pad fades out and sags slightly out of tune as d rises
    const warmLvl = Math.max(0, 0.045 * (1 - this.d * 2.1));
    this.warmGain.gain.setTargetAtTime(warmLvl, now, 0.25);
    this.warmOscs.forEach(({ osc, baseFreq }, idx) => {
      const detuneFactor = 1 - this.d * (0.045 + idx * 0.015);
      osc.frequency.setTargetAtTime(baseFreq * detuneFactor, now, 0.35);
    });

    const droneLvl = this.d < 0.24 ? 0 : Math.min(0.26, (this.d - 0.24) * 0.38);
    this.droneGain.gain.setTargetAtTime(droneLvl, now, 0.25);
    this.droneFilter.frequency.setTargetAtTime(85 + this.d * 220, now, 0.3);

    const dissLvl = this.d < 0.5 ? 0 : Math.min(0.11, (this.d - 0.5) * 0.25);
    this.dissGain.gain.setTargetAtTime(dissLvl, now, 0.3);

    const hissLvl = this.d < 0.34 ? 0 : Math.min(0.13, (this.d - 0.34) * 0.22);
    this.hissGain.gain.setTargetAtTime(hissLvl, now, 0.25);
  }

  playClick(eerie = false) {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = eerie ? "sawtooth" : "sine";
    osc.frequency.setValueAtTime(eerie ? 210 : 760, now);
    osc.frequency.exponentialRampToValueAtTime(eerie ? 72 : 420, now + 0.07);
    g.gain.setValueAtTime(eerie ? 0.11 : 0.045, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    osc.connect(g);
    g.connect(this.master);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playJumpscare() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Massive sub-bass boom
    const sub = this.ctx.createOscillator();
    const subG = this.ctx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(92, now);
    sub.frequency.exponentialRampToValueAtTime(24, now + 1.4);
    subG.gain.setValueAtTime(0.85, now);
    subG.gain.exponentialRampToValueAtTime(0.0001, now + 2.1);
    sub.connect(subG);
    subG.connect(this.master);
    sub.start(now);
    sub.stop(now + 2.2);

    // Piercing dissonant chord + static burst
    [554.37, 587.33, 830.61, 1174.66].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(f, now);
      osc.frequency.exponentialRampToValueAtTime(f * (i % 2 === 0 ? 0.85 : 1.09), now + 1.6);
      const bp = this.ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(1600, now);
      bp.Q.setValueAtTime(2.6, now);
      g.gain.setValueAtTime(0.11, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 1.9);
      osc.connect(bp);
      bp.connect(g);
      g.connect(this.master);
      osc.start(now);
      osc.stop(now + 2.0);
    });

    const dur = 0.45;
    const buf = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * dur), this.ctx.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ch.length * 0.3));
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const ng = this.ctx.createGain();
    ng.gain.setValueAtTime(0.42, now);
    src.connect(ng);
    ng.connect(this.master);
    src.start(now);
  }

  loopHeartbeat() {
    const step = () => {
      if (this.enabled && this.ctx && this.d >= 0.42 && this.d < 0.91) {
        const bpm = 76 + (this.d - 0.42) * 140;
        const nowMs = performance.now();
        if (nowMs - this.lastBeat >= 60000 / bpm) {
          this.lastBeat = nowMs;
          const intensity = Math.min(0.85, (this.d - 0.4) * 1.6);
          const t = this.ctx.currentTime;
          const thump = (offset, freq, amp) => {
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            o.type = "sine";
            o.frequency.setValueAtTime(freq, t + offset);
            o.frequency.exponentialRampToValueAtTime(28, t + offset + 0.14);
            g.gain.setValueAtTime(0.0001, t + offset);
            g.gain.linearRampToValueAtTime(amp * intensity, t + offset + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, t + offset + 0.18);
            o.connect(g);
            g.connect(this.master);
            o.start(t + offset);
            o.stop(t + offset + 0.2);
          };
          thump(0, 66, 0.3);
          thump(0.18, 52, 0.2);
        }
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}

window.hsAudio = new HengshengAudio();
