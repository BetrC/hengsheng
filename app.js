/* ==========================================================================
   盈息 · Hearthly-Inspired Slow-Burn FinTech Horror Engine
   Continuous decay --d, Pixel Noise, Midnight Presence Monitor, Idle Whispers,
   Sticky Terminal, Pixelated Eye Wall, Climax Scare & Retroactive Top Corruption
   ========================================================================== */

(() => {
  "use strict";

  const audio = window.hsAudio;
  const startMs = Date.now();

  const state = {
    d: 0,
    mouseX: window.innerWidth * 0.5,
    mouseY: window.innerHeight * 0.5,
    corrupted: false,
    scareFired: false,
    lastScrollAt: performance.now(),
    whisperShown: false,
    whisperIdx: 0,
    simBuyCount: 0,
    stopClickCount: 0,
    presenceHover: false,
    presenceSpike: 0
  };

  const el = {
    body: document.body,
    noise: document.getElementById("noise"),
    vig: document.getElementById("vig"),
    scan: document.getElementById("scan"),
    whisper: document.getElementById("whisper"),
    toast: document.getElementById("toast"),
    scare: document.getElementById("scare"),

    audioToggle: document.getElementById("audioToggle"),
    audioToggleText: document.getElementById("audioToggleText"),
    heroAudioLink: document.getElementById("heroAudioLink"),
    navLinks: document.querySelectorAll(".nav-links a"),
    navCta: document.getElementById("navCta"),

    retroSub: document.getElementById("retroSub"),
    heroDesc: document.getElementById("heroDesc"),
    heroFootnoteLead: document.getElementById("heroFootnoteLead"),
    heroStartBtn: document.getElementById("heroStartBtn"),
    swHead: document.getElementById("swHead"),
    swIndex: document.getElementById("swIndex"),
    swStopLoss: document.getElementById("swStopLoss"),
    swWatchers: document.getElementById("swWatchers"),
    miniBuyBtn: document.getElementById("miniBuyBtn"),
    miniStopBtn: document.getElementById("miniStopBtn"),
    trustCaption: document.getElementById("trustCaption"),
    heroSparkCanvas: document.getElementById("heroSparkCanvas"),

    presenceStage: document.getElementById("presenceStage"),
    presenceCanvas: document.getElementById("presenceCanvas"),
    presenceClock: document.getElementById("presenceClock"),
    presenceNote: document.getElementById("presenceNote"),
    pbGreed: document.getElementById("pbGreed"),
    pbStopWill: document.getElementById("pbStopWill"),
    pbBpm: document.getElementById("pbBpm"),
    simDipBtn: document.getElementById("simDipBtn"),
    killEngineBtn: document.getElementById("killEngineBtn"),

    eternalBtn: document.getElementById("eternalBtn"),
    cfAccount: document.getElementById("cfAccount"),
    cfFear: document.getElementById("cfFear"),
    cfSubmit: document.getElementById("cfSubmit"),
    contactForm: document.getElementById("contactForm"),

    logStage: document.getElementById("logStage"),
    termBody: document.getElementById("termBody"),
    eyesStage: document.getElementById("eyesStage"),
    eyesCanvas: document.getElementById("eyesCanvas"),
    endStage: document.getElementById("endStage"),
    endPreWhisper: document.getElementById("endPreWhisper"),
    endReveal: document.getElementById("endReveal"),
    endFooter: document.getElementById("endFooter"),
    backTopBtn: document.getElementById("backTopBtn")
  };

  // =========================================================================
  // 1. UTILITIES: COLOR INTERPOLATION, TOAST, AUDIO TOGGLE, JITTER SPANS
  // =========================================================================
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp01(v) { return Math.max(0, Math.min(1, v)); }

  function lerpRgb(c1, c2, t) {
    const r = Math.round(lerp(c1[0], c2[0], t));
    const g = Math.round(lerp(c1[1], c2[1], t));
    const b = Math.round(lerp(c1[2], c2[2], t));
    return `rgb(${r}, ${g}, ${b})`;
  }

  function multiColor(stops, t) {
    const n = stops.length - 1;
    const scaled = clamp01(t) * n;
    const idx = Math.min(n - 1, Math.floor(scaled));
    return lerpRgb(stops[idx], stops[idx + 1], scaled - idx);
  }

  let toastTimer = null;
  function showToast(msg, isBlood = false) {
    el.toast.textContent = msg;
    el.toast.className = isBlood ? "show blood" : "show";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.toast.classList.remove("show"); }, 3400);
  }

  function syncAudioUI() {
    el.audioToggle.setAttribute("aria-pressed", String(audio.enabled));
    el.audioToggleText.textContent = audio.enabled ? "氛围音效：开" : "氛围音效：关";
    if (el.heroAudioLink) {
      el.heroAudioLink.textContent = audio.enabled ? "氛围音效已开启" : "开启氛围音效";
    }
  }

  function toggleSound() {
    audio.toggle();
    syncAudioUI();
    if (audio.enabled) {
      audio.playClick(state.d > 0.45);
      audio.updateDecay(state.d);
    }
  }

  el.audioToggle.addEventListener("click", toggleSound);
  if (el.heroAudioLink) el.heroAudioLink.addEventListener("click", () => { if (!audio.enabled) toggleSound(); });

  // Wrap FAQ answers in per-character jitter spans (exact Hearthly tactile detail)
  document.querySelectorAll(".jit-target").forEach((p) => {
    const txt = p.textContent;
    p.textContent = "";
    [...txt].forEach((ch, idx) => {
      const sp = document.createElement("span");
      sp.className = "jit-char";
      sp.style.animationDelay = `${(idx * 0.13) % 2.4}s`;
      sp.textContent = ch;
      p.appendChild(sp);
    });
  });

  // =========================================================================
  // 2. INTERACTIVE HERO & EMOTIONAL TRAPS
  // =========================================================================
  let shVal = 3384.62;
  let shPct = 0.84;

  el.heroStartBtn.addEventListener("click", () => {
    audio.playClick(state.corrupted);
    if (state.corrupted) {
      showToast("你已经在仓位里面了，无需重复试用。", true);
      return;
    }
    document.getElementById("features").scrollIntoView({ behavior: "smooth" });
  });

  el.miniBuyBtn.addEventListener("click", () => {
    state.simBuyCount++;
    audio.playClick(state.corrupted);
    if (state.corrupted) {
      showToast("已追加十倍杠杆。你的账户已没有退路。", true);
      return;
    }
    shPct += 0.34;
    shVal += 11.4;
    el.swIndex.textContent = `${shVal.toFixed(2)} +${shPct.toFixed(2)}%`;
    showToast(`模拟买入成功 · 浮盈扩大至 +${(1.42 + state.simBuyCount * 0.58).toFixed(2)}%，感觉很轻松吧？`);
  });

  el.miniStopBtn.addEventListener("click", () => {
    state.stopClickCount++;
    audio.playClick(state.corrupted || state.stopClickCount >= 2);
    if (state.corrupted || state.stopClickCount >= 2) {
      el.swStopLoss.textContent = "已永久移除";
      el.swStopLoss.className = "sw-v danger-val";
      showToast("止损请求被驳回：行情马上反转，现在割肉你会后悔的。", true);
    } else {
      showToast("自动止损运行正常（提示：过于频繁止损会让你错过主升浪）。");
    }
  });

  el.simDipBtn.addEventListener("click", () => {
    audio.playClick(true);
    state.presenceSpike = 1.0;
    el.pbGreed.textContent = "98.9%";
    el.pbStopWill.textContent = "0.0%";
    el.pbBpm.textContent = "142 BPM";
    el.presenceNote.textContent = "恭喜，你的不甘心已被成功录入情绪样本库。";
    showToast("模拟抄底已成交：系统检测到你的多巴胺与恐惧同步飙升。", true);
  });

  let killClicks = 0;
  el.killEngineBtn.addEventListener("click", () => {
    audio.playClick(true);
    killClicks++;
    const replies = [
      "关闭失败：你其实还想再看一眼回本，对吗？",
      "权限不足：该情绪引擎已与你的仓位绑定。",
      "别点这个按钮了。往下滑吧。"
    ];
    el.killEngineBtn.textContent = killClicks >= 3 ? "无法关闭" : "关闭失败";
    showToast(replies[Math.min(killClicks - 1, replies.length - 1)], true);
  });

  document.querySelectorAll(".p-btn[data-tier]").forEach((btn) => {
    btn.addEventListener("click", () => {
      audio.playClick(true);
      showToast(`已为你记录「${btn.dataset.tier}」意向——但我们知道你最终会选最右边那一个。`, true);
    });
  });

  el.eternalBtn.addEventListener("click", () => {
    audio.playClick(true);
    el.eternalBtn.textContent = "早就归我们了";
    showToast("账户与情绪托管已生效。冷静期：0 秒。", true);
  });

  // Pre-filled contact form that stubbornly restores "我们早就知道了"
  el.cfAccount.addEventListener("blur", () => {
    if (!el.cfAccount.value.trim()) el.cfAccount.value = "我们早就知道了";
  });

  el.contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    audio.playClick(true);
    el.cfSubmit.textContent = "已收到。你不用再掩饰不甘心了。";
    el.cfFear.value = "";
    showToast("留言已归档。放心，我们已经比你更了解你的软肋。", true);
  });

  el.navCta.addEventListener("click", (e) => {
    if (state.d > 0.72) {
      e.preventDefault();
      audio.playClick(true);
      showToast("已经封盘了。逃不出去的。", true);
    }
  });

  el.backTopBtn.addEventListener("click", () => {
    applyRetroactiveCorruption();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // =========================================================================
  // 3. PERMANENT RETROACTIVE TOP CORRUPTION (Hearthly's Best Psychological Trick!)
  // =========================================================================
  function applyRetroactiveCorruption() {
    if (state.corrupted) return;
    state.corrupted = true;
    el.body.classList.add("corrupted");

    el.retroSub.hidden = false;
    el.heroDesc.textContent = "盈息连接每一条行情、每一次呼吸、每一个失眠的凌晨——从此你再也无法离场。";
    el.heroFootnoteLead.textContent = "止损权限已移交，无法取消。";
    el.swHead.textContent = "03:14 仍在盯盘";
    el.swIndex.textContent = "已封盘 · -∞%";
    el.swIndex.className = "sw-v danger-val tabular";
    el.swStopLoss.textContent = "已永久移除";
    el.swStopLoss.className = "sw-v danger-val";
    el.swWatchers.textContent = "2";
    el.swWatchers.className = "sw-v danger-val tabular";
    el.trustCaption.textContent = "超过 12,000 位投资者的信赖之选。还剩 11,998 位。";
  }

  // =========================================================================
  // 4. PIXELATED FILM NOISE OVERLAY CANVAS (#noise)
  // =========================================================================
  const noiseCtx = el.noise.getContext("2d");
  const NOISE_W = 240;
  const NOISE_H = 150;
  el.noise.width = NOISE_W;
  el.noise.height = NOISE_H;
  const noiseImg = noiseCtx.createImageData(NOISE_W, NOISE_H);
  let lastNoiseFrame = 0;

  function renderNoise(nowMs) {
    const activeOpacity = state.corrupted
      ? Math.max(0.24, Math.min(0.62, state.d * 0.72))
      : clamp01((state.d - 0.2) * 0.82);

    el.noise.style.opacity = activeOpacity.toFixed(3);
    if (activeOpacity <= 0.01 || nowMs - lastNoiseFrame < 75) return;
    lastNoiseFrame = nowMs;

    const data = noiseImg.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 255;
    }
    noiseCtx.putImageData(noiseImg, 0, 0);
  }

  // =========================================================================
  // 5. HERO BREATHING SPARKLINE CANVAS (#heroSparkCanvas)
  // =========================================================================
  function renderHeroSpark(nowMs) {
    const c = el.heroSparkCanvas;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    if (rect.bottom < -50 || rect.top > window.innerHeight + 50) return;

    const ctx = c.getContext("2d");
    const w = c.width, h = c.height;
    const t = nowMs * 0.0014;
    ctx.clearRect(0, 0, w, h);

    ctx.beginPath();
    for (let x = 0; x <= w; x += 4) {
      const nx = x / w;
      let y;
      if (state.corrupted) {
        // Jagged erratic heartbeat flatline once corrupted
        const p = ((nx * 3.5 - t * 1.4) % 1 + 1) % 1;
        let spike = 0;
        if (p > 0.25 && p < 0.3) spike = -26;
        else if (p >= 0.3 && p < 0.34) spike = 12;
        y = h * 0.56 + spike + (Math.random() - 0.5) * 3;
      } else {
        // Smooth gentle bullish breathing wave
        y = h * 0.72 - nx * 28 - Math.sin(nx * 6.5 - t) * 7 - Math.sin(nx * 13 + t * 0.6) * 2.5;
      }
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = state.corrupted ? "#b91216" : "#ef5b44";
    ctx.lineWidth = 2.6;
    ctx.lineCap = "round";
    ctx.stroke();
  }

  // =========================================================================
  // 6. MIDNIGHT TRADING DESK MONITOR CANVAS (#presenceCanvas — Native Code Art)
  // =========================================================================
  el.presenceStage.addEventListener("mouseenter", () => { state.presenceHover = true; });
  el.presenceStage.addEventListener("mouseleave", () => { state.presenceHover = false; });

  function renderPresence(nowMs) {
    const c = el.presenceCanvas;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;

    const ctx = c.getContext("2d");
    const w = c.width, h = c.height;
    const t = nowMs * 0.001;

    // Dark grainy monochrome night room
    const bg = ctx.createRadialGradient(w * 0.5, h * 0.44, 40, w * 0.5, h * 0.5, w * 0.65);
    bg.addColorStop(0, "#242221");
    bg.addColorStop(0.55, "#111010");
    bg.addColorStop(1, "#040404");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Perspective room walls & doorway behind the desk
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1.5;
    // Back wall
    ctx.strokeRect(w * 0.24, h * 0.14, w * 0.52, h * 0.54);
    // Perspective lines
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(w * 0.24, h * 0.14);
    ctx.moveTo(w, 0); ctx.lineTo(w * 0.76, h * 0.14);
    ctx.moveTo(0, h); ctx.lineTo(w * 0.24, h * 0.68);
    ctx.moveTo(w, h); ctx.lineTo(w * 0.76, h * 0.68);
    ctx.stroke();

    // Open dark doorway on back wall (classic Hearthly silhouette horror beat!)
    const doorX = w * 0.43, doorY = h * 0.19, doorW = w * 0.14, doorH = h * 0.49;
    ctx.fillStyle = "#030203";
    ctx.fillRect(doorX, doorY, doorW, doorH);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.09)";
    ctx.strokeRect(doorX, doorY, doorW, doorH);

    // Tall shadowed silhouette standing motionless inside the doorway
    const sway = Math.sin(t * 0.55) * 2.5;
    const figX = doorX + doorW * 0.5 + sway;
    const figAlpha = 0.62 + (state.presenceHover ? 0.28 : 0) + state.presenceSpike * 0.2;
    ctx.fillStyle = `rgba(6, 5, 6, ${Math.min(0.98, figAlpha)})`;
    // Head + shoulders
    ctx.beginPath(); ctx.ellipse(figX, doorY + 72, 22, 29, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(figX - 46, doorY + 118);
    ctx.quadraticCurveTo(figX, doorY + 96, figX + 46, doorY + 118);
    ctx.lineTo(figX + 40, doorY + doorH);
    ctx.lineTo(figX - 40, doorY + doorH);
    ctx.closePath();
    ctx.fill();

    // Two pinpoint staring white/red eyes inside the dark silhouette
    const eyeGlow = 0.65 + Math.sin(t * 2.2) * 0.2 + (state.presenceHover ? 0.2 : 0);
    [figX - 8, figX + 8].forEach((ex) => {
      ctx.fillStyle = `rgba(255, ${state.presenceSpike > 0.1 ? 120 : 244}, ${state.presenceSpike > 0.1 ? 120 : 244}, ${eyeGlow})`;
      ctx.beginPath(); ctx.arc(ex, doorY + 70, 2.5, 0, Math.PI * 2); ctx.fill();
    });

    // Foreground desk silhouette + glowing K-line monitor reflection
    ctx.fillStyle = "#0a0909";
    ctx.fillRect(0, h * 0.74, w, h * 0.26);

    // Subtle red-green trading candlesticks reflected across the dark glass
    const candles = 32;
    for (let i = 0; i < candles; i++) {
      const cx = w * 0.16 + i * ((w * 0.68) / candles);
      const wave = Math.sin(i * 0.5 + t * 0.7) * 34 + (state.presenceSpike * 55 * Math.sin(i * 1.4));
      const cy = h * 0.58 + wave;
      const ch = 12 + Math.abs(Math.cos(i * 1.1 + t * 0.4)) * 34;
      const isRed = i % 3 !== 0 || state.presenceSpike > 0.15;
      ctx.fillStyle = isRed ? "rgba(215, 24, 28, 0.24)" : "rgba(42, 165, 102, 0.2)";
      ctx.fillRect(cx, cy - ch * 0.5, 9, ch);
      ctx.fillRect(cx + 4, cy - ch * 0.9, 1.5, ch * 1.8);
    }

    // Racing red ECG line across lower monitor HUD
    ctx.beginPath();
    const baseY = h * 0.84;
    for (let x = 30; x < w - 30; x += 3) {
      const p = (((x / w) * 4.5 - t * 1.7) % 1 + 1) % 1;
      let a = 0;
      if (p > 0.22 && p < 0.25) a = -46 * (1 + state.presenceSpike * 0.5);
      else if (p >= 0.25 && p < 0.28) a = 18;
      else if (p >= 0.36 && p < 0.44) a = -10;
      const y = baseY + a + (Math.random() - 0.5) * 2;
      if (x === 30) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(225, 36, 36, 0.72)";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Heavy grainy speckles + horizontal VHS tear
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    for (let i = 0; i < 140; i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 2, 2);
    }
    if (Math.random() < 0.12) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
      ctx.fillRect(0, Math.random() * h, w, 3 + Math.random() * 14);
    }

    state.presenceSpike = Math.max(0, state.presenceSpike - 0.015);
    const dObj = new Date();
    el.presenceClock.textContent = state.d > 0.48 ? "03:14:44" : dObj.toTimeString().slice(0, 8);
  }

  // =========================================================================
  // 7. STICKY META-AWARE TERMINAL LOG (Section 9)
  // =========================================================================
  function getOSName() {
    const ua = navigator.userAgent;
    if (ua.includes("Windows")) return "一台 Windows 电脑";
    if (ua.includes("Mac")) return "一台 Mac 电脑";
    if (ua.includes("iPhone") || ua.includes("Android")) return "一台随身手机";
    return "一台联网终端";
  }

  const TERM_LINES = [
    { txt: () => "> [yingxi-core] 正在建立情绪直连通道……", red: false },
    { txt: () => `> 已识别观看者设备：${getOSName()}（${window.innerWidth} × ${window.innerHeight}）`, red: false },
    { txt: () => `> 当地时间：${new Date().toTimeString().slice(0, 8)} ｜ 你已与我们共处：${Math.max(1, Math.round((Date.now() - startMs) / 1000))} 秒`, red: false },
    { txt: () => "> 正在评估情绪指标：贪婪 [极高] ｜ 不甘心 [极高] ｜ 止损理智 [0.4%]", red: false },
    { txt: () => "> 正在撤除「自动止损」保护开关…… [已永久移除]", red: true },
    { txt: () => "> 正在调整融资杠杆：1x → 5x → 10x → ∞", red: false },
    { txt: () => "> 扫描屏幕前盯盘人数：预期 1 人", red: false },
    { txt: () => "> 检测到当前盯盘人数：2 人（第二位就在观看者椅背之后）", red: true },
    { txt: () => "> 全部退路已封盘。准备接管。", red: true }
  ];

  const termNodes = TERM_LINES.map(() => {
    const d = document.createElement("div");
    d.className = "term-line";
    el.termBody.appendChild(d);
    return d;
  });

  function updateTerminalStage() {
    const rect = el.logStage.getBoundingClientRect();
    const total = Math.max(1, el.logStage.offsetHeight - window.innerHeight);
    const prog = clamp01(-rect.top / total);

    const visibleCount = Math.floor(prog * (TERM_LINES.length + 1));
    termNodes.forEach((node, idx) => {
      if (idx < visibleCount) {
        node.textContent = TERM_LINES[idx].txt();
        node.className = `term-line vis${TERM_LINES[idx].red ? " red" : ""}`;
      } else {
        node.className = "term-line";
      }
    });
  }

  // =========================================================================
  // 8. STICKY PIXELATED CRIMSON EYE WALL CANVAS (Section 10 — Hearthly Style)
  // =========================================================================
  const EYES = Array.from({ length: 34 }, (_, i) => {
    // Organic scatter across 1440x900
    const col = i % 7;
    const row = Math.floor(i / 7);
    const jx = ((i * 73) % 130) - 65;
    const jy = ((i * 41) % 90) - 45;
    return {
      x: 110 + col * 204 + jx,
      y: 88 + row * 176 + jy,
      r: 34 + ((i * 29) % 44),
      threshold: (i / 34) * 0.42,
      blinkAt: performance.now() + 1400 + Math.random() * 5000,
      blinkDur: 160 + Math.random() * 140
    };
  });

  function renderEyesStage(nowMs) {
    const rect = el.eyesStage.getBoundingClientRect();
    if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;

    const total = Math.max(1, el.eyesStage.offsetHeight - window.innerHeight);
    const prog = clamp01((-rect.top + window.innerHeight * 0.45) / (total + window.innerHeight * 0.45));

    const c = el.eyesCanvas;
    const ctx = c.getContext("2d");
    const w = c.width, h = c.height;
    ctx.clearRect(0, 0, w, h);

    const mx = (state.mouseX / Math.max(1, window.innerWidth)) * w;
    const my = (state.mouseY / Math.max(1, window.innerHeight)) * h;

    EYES.forEach((eye) => {
      let open = clamp01((prog - eye.threshold) * 3.6);
      if (open <= 0.02) return;

      if (nowMs >= eye.blinkAt) {
        const dt = nowMs - eye.blinkAt;
        if (dt < eye.blinkDur) open *= Math.max(0.04, 1 - Math.sin((dt / eye.blinkDur) * Math.PI));
        else eye.blinkAt = nowMs + 2200 + Math.random() * 5800;
      }

      const rx = eye.r;
      const ry = eye.r * 0.56 * open;

      ctx.save();
      ctx.translate(eye.x, eye.y);

      // Almond outline clip
      ctx.beginPath();
      ctx.moveTo(-rx, 0);
      ctx.quadraticCurveTo(0, -ry * 1.45, rx, 0);
      ctx.quadraticCurveTo(0, ry * 1.45, -rx, 0);
      ctx.closePath();
      ctx.clip();

      // Bone-off-white sclera with dark outer rim (stark Hearthly graphic aesthetic)
      const sc = ctx.createRadialGradient(0, 0, rx * 0.2, 0, 0, rx);
      sc.addColorStop(0, "#e6ddd6");
      sc.addColorStop(0.75, "#b3a59c");
      sc.addColorStop(1, "#453330");
      ctx.fillStyle = sc;
      ctx.fillRect(-rx, -ry * 1.6, rx * 2, ry * 3.2);

      // Mouse-tracking deep crimson iris & pitch-black pupil
      const dx = mx - eye.x, dy = my - eye.y;
      const dist = Math.hypot(dx, dy) || 1;
      const px = (dx / dist) * Math.min(rx * 0.3, dist * 0.045);
      const py = (dy / dist) * Math.min(ry * 0.28, dist * 0.045);

      const irisR = eye.r * 0.42;
      ctx.fillStyle = "#5c080b";
      ctx.beginPath(); ctx.arc(px, py, irisR, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = "#8a1115";
      ctx.beginPath(); ctx.arc(px, py, irisR * 0.78, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = "#060102";
      ctx.beginPath(); ctx.arc(px, py, irisR * 0.46, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = "rgba(255, 240, 240, 0.85)";
      ctx.beginPath(); ctx.arc(px - irisR * 0.25, py - irisR * 0.25, Math.max(2, irisR * 0.14), 0, Math.PI * 2); ctx.fill();

      ctx.restore();
    });
  }

  // =========================================================================
  // 9. STICKY CLIMAX SCARE & STARK ENDING (Section 11)
  // =========================================================================
  function fireClimaxScare() {
    if (state.scareFired) return;
    state.scareFired = true;
    applyRetroactiveCorruption();

    el.scare.classList.add("active");
    el.body.classList.add("shaking");
    audio.playJumpscare();

    setTimeout(() => {
      el.scare.classList.remove("active");
      el.body.classList.remove("shaking");
      audio.updateDecay(state.d, false);
    }, 340);
  }

  function updateEndStage() {
    const rect = el.endStage.getBoundingClientRect();
    const total = Math.max(1, el.endStage.offsetHeight - window.innerHeight);
    const prog = clamp01(-rect.top / total);

    const inSilenceZone = prog > 0.08 && prog < 0.44 && !state.scareFired;
    el.endPreWhisper.classList.toggle("show", inSilenceZone);
    if (inSilenceZone) audio.updateDecay(state.d, true);

    if (prog >= 0.44 && !state.scareFired) {
      fireClimaxScare();
    }

    const showFinal = prog >= 0.54 || (state.scareFired && prog > 0.2);
    el.endReveal.classList.toggle("show", showFinal);
    el.endFooter.classList.toggle("show", showFinal);
  }

  // =========================================================================
  // 10. CONTINUOUS SCROLL DECAY ENGINE (--d: 0 -> 1) & IDLE WHISPERS
  // =========================================================================
  const BG_STOPS = [
    [251, 247, 242], // 0.00 Warm Hearthly Cream #FBF7F2
    [237, 232, 224], // 0.25 Muted Warm Stone
    [156, 148, 140], // 0.45 Desaturated Cold Taupe
    [34, 28, 26],    // 0.65 Dark Charcoal-Brown
    [3, 2, 3]        // 1.00 Pitch-Black Void
  ];

  const CARD_STOPS = [
    [255, 255, 255],
    [247, 243, 238],
    [208, 201, 194],
    [28, 22, 22],
    [10, 6, 7]
  ];

  const INK_STOPS = [
    [31, 27, 22],
    [34, 29, 25],
    [28, 23, 20],
    [226, 214, 208],
    [240, 226, 222]
  ];

  const MUTED_STOPS = [
    [110, 100, 89],
    [106, 97, 88],
    [82, 74, 68],
    [152, 136, 130],
    [146, 122, 122]
  ];

  const ACCENT_STOPS = [
    [239, 91, 68],   // Warm coral-bullish red
    [214, 68, 49],
    [176, 30, 28],
    [156, 18, 20],
    [175, 14, 18]
  ];

  const IDLE_WHISPERS = [
    "你为什么停下了？",
    "继续往下啊。",
    "我们听得到你的呼吸。",
    "别盯着大盘了，看看屏幕反光。",
    "你舍不得认亏，对不对？"
  ];

  function onScroll() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const d = clamp01(window.scrollY / maxScroll);
    state.d = d;
    state.lastScrollAt = performance.now();

    if (state.whisperShown) {
      state.whisperShown = false;
      el.whisper.classList.remove("show");
    }

    const root = document.documentElement.style;
    root.setProperty("--d", d.toFixed(4));
    root.setProperty("--bg", multiColor(BG_STOPS, d));
    root.setProperty("--card", multiColor(CARD_STOPS, d));
    root.setProperty("--ink", multiColor(INK_STOPS, d));
    root.setProperty("--muted", multiColor(MUTED_STOPS, d));
    root.setProperty("--accent", multiColor(ACCENT_STOPS, d));

    const borderAlpha = d > 0.55 ? 0.14 : 0.08;
    const borderRgb = d > 0.55 ? "220, 180, 180" : "31, 27, 22";
    root.setProperty("--card-border", `rgba(${borderRgb}, ${borderAlpha})`);

    const navBg = multiColor(BG_STOPS, d).replace("rgb(", "rgba(").replace(")", ", 0.84)");
    root.setProperty("--nav-bg", navBg);

    // Atmosphere layers
    el.vig.style.opacity = clamp01((d - 0.18) * 1.18).toFixed(3);
    el.scan.style.opacity = clamp01((d - 0.34) * 1.1).toFixed(3);

    // Mutate Navbar labels & CTA progressively (just like Hearthly!)
    const navCorrupt = d > 0.42;
    el.navLinks.forEach((a) => { a.textContent = navCorrupt ? a.dataset.c : a.dataset.n; });
    if (d > 0.72) el.navCta.textContent = "逃出去";
    else if (d > 0.44) el.navCta.textContent = "别走";
    else el.navCta.textContent = "开始使用";

    // Mutate browser tab title progressively
    if (d < 0.25) document.title = state.corrupted ? "盈息 · 我们已经替你满仓了" : "盈息 · 你的财富，终于学会呼吸了";
    else if (d < 0.52) document.title = "盈息 · 正在监测你的情绪";
    else if (d < 0.78) document.title = "不要再点止损了";
    else document.title = "我们已经替你全仓了。";

    audio.updateDecay(d, false);
    updateTerminalStage();
    updateEndStage();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("mousemove", (e) => {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
  }, { passive: true });

  // Master Animation Loop
  function tick(nowMs) {
    renderNoise(nowMs);
    renderHeroSpark(nowMs);
    renderPresence(nowMs);
    renderEyesStage(nowMs);

    // Idle-Scroll Red Whisper (triggers after pausing ~2.6s when d >= 0.38)
    if (state.d >= 0.38 && !state.whisperShown && nowMs - state.lastScrollAt > 2600) {
      state.whisperShown = true;
      el.whisper.textContent = IDLE_WHISPERS[state.whisperIdx % IDLE_WHISPERS.length];
      state.whisperIdx++;
      el.whisper.classList.add("show");
    }

    requestAnimationFrame(tick);
  }

  onScroll();
  requestAnimationFrame(tick);
})();
