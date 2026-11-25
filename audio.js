/* ==========================================================================
   Procedural Web Audio API Horror & Financial Advisor Soundscape Engine
   Adapts continuously from friendly brokerage chimes -> manipulative dread -> climax
   ========================================================================== */

class HorrorAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.initialized = false;
    this.currentP = 0;
    this.heartbeatTimer = null;
    this.lastBeatTime = 0;

    this.masterGain = null;
    this.humGain = null;
    this.droneGain = null;
    this.droneFilter = null;
    this.dissonanceGain = null;
    this.staticGain = null;
    this.staticFilter = null;
  }

  init() {
    if (this.initialized) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    const now = this.ctx.currentTime;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0001, now);
    this.masterGain.connect(this.ctx.destination);

    // 1. Subtle 58Hz Office Fluorescent Tube Hum (Acts 2-5)
    const humOsc = this.ctx.createOscillator();
    humOsc.type = "sine";
    humOsc.frequency.setValueAtTime(58, now);
    const humHarm = this.ctx.createOscillator();
    humHarm.type = "triangle";
    humHarm.frequency.setValueAtTime(116.4, now);
    const humFilter = this.ctx.createBiquadFilter();
    humFilter.type = "lowpass";
    humFilter.frequency.setValueAtTime(240, now);
    this.humGain = this.ctx.createGain();
    this.humGain.gain.setValueAtTime(0.0, now);

    humOsc.connect(humFilter);
    humHarm.connect(humFilter);
    humFilter.connect(this.humGain);
    this.humGain.connect(this.masterGain);
    humOsc.start(now);
    humHarm.start(now);

    // 2. Deep Ominous Sub-Drone (detuned dark sawtooth pair)
    const d1 = this.ctx.createOscillator();
    const d2 = this.ctx.createOscillator();
    d1.type = "sawtooth";
    d2.type = "sawtooth";
    d1.frequency.setValueAtTime(41.2, now);
    d2.frequency.setValueAtTime(42.08, now);

    this.droneFilter = this.ctx.createBiquadFilter();
    this.droneFilter.type = "lowpass";
    this.droneFilter.frequency.setValueAtTime(92, now);
    this.droneFilter.Q.setValueAtTime(4.2, now);

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.0, now);

    d1.connect(this.droneFilter);
    d2.connect(this.droneFilter);
    this.droneFilter.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);
    d1.start(now);
    d2.start(now);

    // 3. Psychological Tension Dissonance Cluster (Acts 5-7)
    const dissFreqs = [277.18, 293.66, 311.13];
    const dissFilter = this.ctx.createBiquadFilter();
    dissFilter.type = "bandpass";
    dissFilter.frequency.setValueAtTime(450, now);
    dissFilter.Q.setValueAtTime(6.0, now);

    this.dissonanceGain = this.ctx.createGain();
    this.dissonanceGain.gain.setValueAtTime(0.0, now);

    dissFreqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.12 + idx * 0.05, now);
      lfoGain.gain.setValueAtTime(3.4, now);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(dissFilter);
      osc.start(now);
      lfo.start(now);
    });
    dissFilter.connect(this.dissonanceGain);
    this.dissonanceGain.connect(this.masterGain);

    // 4. Whispering Broadcast Static Floor
    const bufLen = this.ctx.sampleRate * 3;
    const noiseBuf = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufLen; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.04 * white) / 1.04;
      lastOut = data[i];
      data[i] *= 2.4;
    }

    const noiseSrc = this.ctx.createBufferSource();
    noiseSrc.buffer = noiseBuf;
    noiseSrc.loop = true;

    this.staticFilter = this.ctx.createBiquadFilter();
    this.staticFilter.type = "bandpass";
    this.staticFilter.frequency.setValueAtTime(980, now);
    this.staticFilter.Q.setValueAtTime(2.6, now);

    this.staticGain = this.ctx.createGain();
    this.staticGain.gain.setValueAtTime(0.0, now);

    noiseSrc.connect(this.staticFilter);
    this.staticFilter.connect(this.staticGain);
    this.staticGain.connect(this.masterGain);
    noiseSrc.start(now);

    this.initialized = true;
    this.startHeartbeatLoop();
  }

  enable() {
    this.init();
    if (!this.ctx) return false;
    if (this.ctx.state === "suspended") this.ctx.resume();
    this.enabled = true;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(0.75, now, 0.25);
    this.updateScroll(this.currentP);
    return true;
  }

  disable() {
    this.enabled = false;
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(0.0001, now, 0.15);
  }

  toggle() {
    if (this.enabled) {
      this.disable();
      return false;
    }
    return this.enable();
  }

  updateScroll(p) {
    this.currentP = Math.max(0, Math.min(1, p));
    if (!this.initialized || !this.enabled || !this.ctx) return;

    const now = this.ctx.currentTime;
    const humLvl = p < 0.16 ? 0 : Math.min(0.075, (p - 0.16) * 0.14) * (1 - Math.max(0, (p - 0.85) * 3));
    this.humGain.gain.setTargetAtTime(Math.max(0, humLvl), now, 0.2);

    const droneLvl = p < 0.26 ? 0 : Math.min(0.28, (p - 0.26) * 0.42);
    this.droneGain.gain.setTargetAtTime(droneLvl, now, 0.25);
    this.droneFilter.frequency.setTargetAtTime(85 + p * 235, now, 0.3);

    const dissLvl = p < 0.54 ? 0 : Math.min(0.115, (p - 0.54) * 0.26);
    this.dissonanceGain.gain.setTargetAtTime(dissLvl, now, 0.3);

    const staticLvl = p < 0.40 ? 0 : Math.min(0.14, (p - 0.40) * 0.24);
    this.staticGain.gain.setTargetAtTime(staticLvl, now, 0.25);
    this.staticFilter.frequency.setTargetAtTime(740 + Math.sin(now * 0.7) * 320 + p * 500, now, 0.35);
  }

  // Advisor message notification chime: warm two-tone ding at top -> warped eerie detuned chime deeper down!
  playAdvisorPing(stage = 1) {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;

    if (stage <= 2) {
      // Friendly warm WeChat / VIP wealth advisory chime (C6 -> E6)
      [1046.5, 1318.5].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.085);
        g.gain.setValueAtTime(0.0001, now + idx * 0.085);
        g.gain.linearRampToValueAtTime(0.08, now + idx * 0.085 + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.085 + 0.24);
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(now + idx * 0.085);
        osc.stop(now + idx * 0.085 + 0.26);
      });
    } else {
      // Unsettling downward tritone / pitch-sagging haunted notification ping
      const base = stage === 3 ? 520 : stage === 4 ? 360 : 210;
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = "triangle";
      osc2.type = "sawtooth";
      osc.frequency.setValueAtTime(base, now);
      osc.frequency.exponentialRampToValueAtTime(base * 0.62, now + 0.42);
      osc2.frequency.setValueAtTime(base * 1.414, now); // Tritone
      osc2.frequency.exponentialRampToValueAtTime(base * 0.58, now + 0.42);
      g.gain.setValueAtTime(0.095, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);
      osc.connect(g);
      osc2.connect(g);
      g.connect(this.masterGain);
      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.5);
      osc2.stop(now + 0.5);
    }
  }

  playUiTick(corrupted = false) {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = corrupted ? "sawtooth" : "sine";
    osc.frequency.setValueAtTime(corrupted ? 185 : 880, now);
    osc.frequency.exponentialRampToValueAtTime(corrupted ? 62 : 420, now + 0.06);
    gain.gain.setValueAtTime(corrupted ? 0.12 : 0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  playGlitchBurst(intensity = 0.5) {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const dur = 0.09 + intensity * 0.14;
    const buf = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * dur), this.ctx.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < ch.length; i++) {
      ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ch.length * 0.55));
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1400 + Math.random() * 1400, now);
    filter.Q.setValueAtTime(1.8, now);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.18 * intensity, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);

    src.connect(filter);
    filter.connect(g);
    g.connect(this.masterGain);
    src.start(now);
  }

  startHeartbeatLoop() {
    const tick = () => {
      if (this.enabled && this.ctx && this.currentP >= 0.42 && this.currentP < 0.995) {
        const bpm = 78 + (this.currentP - 0.42) * 168;
        const intervalMs = 60000 / bpm;
        const nowMs = performance.now();
        if (nowMs - this.lastBeatTime >= intervalMs) {
          this.lastBeatTime = nowMs;
          this.triggerHeartbeat(Math.min(1, (this.currentP - 0.40) * 1.8));
        }
      }
      this.heartbeatTimer = requestAnimationFrame(tick);
    };
    this.heartbeatTimer = requestAnimationFrame(tick);
  }

  triggerHeartbeat(intensity) {
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const pulse = (offset, freqStart, amp) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freqStart, now + offset);
      osc.frequency.exponentialRampToValueAtTime(28, now + offset + 0.14);
      g.gain.setValueAtTime(0.0001, now + offset);
      g.gain.linearRampToValueAtTime(amp * intensity, now + offset + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.18);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now + offset);
      osc.stop(now + offset + 0.2);
    };
    pulse(0, 68, 0.34);
    pulse(0.19, 54, 0.24);
  }

  dropToSilence() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.humGain.gain.setTargetAtTime(0.0001, now, 0.04);
    this.droneGain.gain.setTargetAtTime(0.0001, now, 0.04);
    this.dissonanceGain.gain.setTargetAtTime(0.0001, now, 0.04);
    this.staticGain.gain.setTargetAtTime(0.0001, now, 0.04);
  }

  playClimaxStrike() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;

    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(84, now);
    subOsc.frequency.exponentialRampToValueAtTime(24, now + 1.6);
    subGain.gain.setValueAtTime(0.86, now);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);
    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(now);
    subOsc.stop(now + 2.5);

    const crackDur = 0.55;
    const crackBuf = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * crackDur), this.ctx.sampleRate);
    const ch = crackBuf.getChannelData(0);
    for (let i = 0; i < ch.length; i++) {
      const env = Math.exp(-i / (ch.length * 0.22));
      const spike = Math.random() > 0.92 ? 2.2 : 0.7;
      ch[i] = (Math.random() * 2 - 1) * env * spike;
    }
    const crackSrc = this.ctx.createBufferSource();
    crackSrc.buffer = crackBuf;
    const hp = this.ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.setValueAtTime(2100, now);
    const crackGain = this.ctx.createGain();
    crackGain.gain.setValueAtTime(0.54, now);
    crackSrc.connect(hp);
    hp.connect(crackGain);
    crackGain.connect(this.masterGain);
    crackSrc.start(now);

    const freqs = [587.33, 622.25, 830.61, 1174.66];
    freqs.forEach((f, idx) => {
      const car = this.ctx.createOscillator();
      const mod = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();
      const g = this.ctx.createGain();

      car.type = "sawtooth";
      car.frequency.setValueAtTime(f, now);
      car.frequency.exponentialRampToValueAtTime(f * (idx % 2 === 0 ? 0.88 : 1.07), now + 2.2);

      mod.type = "sine";
      mod.frequency.setValueAtTime(24 + idx * 11, now);
      modGain.gain.setValueAtTime(48, now);
      mod.connect(modGain);
      modGain.connect(car.frequency);

      const bp = this.ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(1400 + idx * 320, now);
      bp.Q.setValueAtTime(3.5, now);

      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.11, now + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

      car.connect(bp);
      bp.connect(g);
      g.connect(this.masterGain);

      car.start(now);
      mod.start(now);
      car.stop(now + 2.9);
      mod.stop(now + 2.9);
    });

    setTimeout(() => {
      if (this.enabled) this.updateScroll(this.currentP);
    }, 2400);
  }
}

window.horrorAudio = new HorrorAudioEngine();
