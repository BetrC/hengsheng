/* ==========================================================================
   恒盛私享财富 · 理财顾问情绪操控 -> 恐怖片级终极崩溃 核心引擎
   ========================================================================== */

(() => {
  "use strict";

  const audio = window.horrorAudio;

  // =========================================================================
  // 1. REALISTIC STOCK DATASET (ACT 1)
  // =========================================================================
  const STOCKS = [
    { code: "600519", market: "SH", name: "贵州茅台", price: 1586.40, prevClose: 1558.04, open: 1562.00, high: 1592.80, low: 1558.10, turn: "0.42%", amt: "68.42亿", pe: "24.18", volatility: 2.6 },
    { code: "300750", market: "SZ", name: "宁德时代", price: 268.90, prevClose: 262.47, open: 263.50, high: 271.20, low: 262.10, turn: "1.18%", amt: "89.14亿", pe: "22.60", volatility: 1.1 },
    { code: "601318", market: "SH", name: "中国平安", price: 56.78, prevClose: 56.25, open: 56.40, high: 57.15, low: 56.10, turn: "0.74%", amt: "44.80亿", pe: "8.92", volatility: 0.25 },
    { code: "000858", market: "SZ", name: "五粮液", price: 152.30, prevClose: 153.00, open: 153.20, high: 154.10, low: 151.60, turn: "0.61%", amt: "31.26亿", pe: "18.74", volatility: 0.5 },
    { code: "600036", market: "SH", name: "招商银行", price: 39.12, prevClose: 38.88, open: 38.95, high: 39.34, low: 38.80, turn: "0.49%", amt: "27.95亿", pe: "6.45", volatility: 0.14 },
    { code: "688981", market: "SH", name: "中芯国际", price: 94.55, prevClose: 91.02, open: 91.80, high: 95.80, low: 91.20, turn: "3.42%", amt: "112.60亿", pe: "118.4", volatility: 0.7 },
    { code: "600994", market: "SH", name: "恒盛内参一号", price: 18.44, prevClose: 18.44, open: 18.44, high: 18.44, low: 18.44, turn: "4.44%", amt: "4.44亿", pe: "—", volatility: 0.0, eerie: true }
  ];

  const state = {
    activeIdx: 0,
    chartMode: "intraday",
    tradeSide: "buy",
    cash: 322250.0,
    scrollP: 0,
    stage: 1,
    mouseX: window.innerWidth * 0.5,
    mouseY: window.innerHeight * 0.5,
    maxScrollPx: 0,
    audioUnlockedOnce: false,
    climaxTriggered: false,
    climaxInProgress: false,
    climaxAutoTimer: null,
    escapeClicks: 0,
    closeRefusals: 0,
    gubaInjectedCount: 0,
    triggeredStages: new Set([1]),
    cctvHoverGain: 0,
    chartHoverX: null
  };

  STOCKS.forEach((s, idx) => {
    s.intraday = [];
    let p = s.open;
    for (let i = 0; i < 120; i++) {
      const drift = (s.price - s.open) / 120;
      const noise = s.eerie ? 0 : (Math.sin(i * 0.35 + idx) * 0.45 + (Math.random() - 0.48)) * s.volatility * 0.55;
      p = Math.max(s.low * 0.995, Math.min(s.high * 1.005, p + drift + noise));
      if (i === 119) p = s.price;
      const vol = s.eerie ? 444 : Math.floor(80 + Math.random() * 520);
      s.intraday.push({ price: p, vol });
    }

    s.candles = [];
    let c = s.prevClose * 0.91;
    for (let i = 0; i < 54; i++) {
      const open = c;
      const delta = s.eerie ? 0 : (Math.random() - 0.46) * s.volatility * 2.2;
      const close = i === 53 ? s.price : Math.max(open * 0.92, open + delta);
      const high = Math.max(open, close) + (s.eerie ? 0.02 : Math.random() * s.volatility);
      const low = Math.min(open, close) - (s.eerie ? 0.02 : Math.random() * s.volatility);
      const vol = s.eerie ? 4444 : Math.floor(400 + Math.random() * 1900);
      s.candles.push({ open, close, high, low, vol });
      c = close;
    }
  });

  // =========================================================================
  // 2. DOM REFERENCES
  // =========================================================================
  const el = {
    body: document.body,
    brandName: document.getElementById("brandName"),
    brandSub: document.getElementById("brandSub"),
    marketStatusText: document.getElementById("marketStatusText"),
    headerClock: document.getElementById("headerClock"),
    accountName: document.getElementById("accountName"),
    accountBalHeader: document.getElementById("accountBalHeader"),
    ghostIdxName: document.getElementById("ghostIdxName"),
    ghostIdxVal: document.getElementById("ghostIdxVal"),
    ghostIdxChg: document.getElementById("ghostIdxChg"),
    audioBtn: document.getElementById("audioToggleBtn"),
    audioIcon: document.getElementById("audioIcon"),
    audioLabel: document.getElementById("audioLabel"),
    toastStack: document.getElementById("toast-stack"),
    glitchTear: document.getElementById("glitchTear"),
    redWhisper: document.getElementById("redWhisper"),

    // Persistent Floating Financial Advisor Widget
    advisorDock: document.getElementById("advisor-dock"),
    advisorDockHeader: document.getElementById("advisorDockHeader"),
    advisorDockAvatar: document.getElementById("advisorDockAvatar"),
    advisorDockName: document.getElementById("advisorDockName"),
    advisorDockStatus: document.getElementById("advisorDockStatus"),
    advisorCloseBtn: document.getElementById("advisorCloseBtn"),
    advisorMessages: document.getElementById("advisorMessages"),
    advisorReplies: document.getElementById("advisorReplies"),
    heroConsultBtn: document.getElementById("heroConsultBtn"),

    watchlistEl: document.getElementById("watchlistEl"),
    activeStockName: document.getElementById("activeStockName"),
    activeStockCode: document.getElementById("activeStockCode"),
    activeStockPrice: document.getElementById("activeStockPrice"),
    activeStockDelta: document.getElementById("activeStockDelta"),
    mOpen: document.getElementById("mOpen"),
    mHigh: document.getElementById("mHigh"),
    mLow: document.getElementById("mLow"),
    mTurn: document.getElementById("mTurn"),
    mAmt: document.getElementById("mAmt"),
    mPe: document.getElementById("mPe"),
    maLegend: document.getElementById("maLegend"),
    obAsks: document.getElementById("obAsks"),
    obBids: document.getElementById("obBids"),
    obMidPrice: document.getElementById("obMidPrice"),
    weibiVal: document.getElementById("weibiVal"),
    kpiCash: document.getElementById("kpiCash"),
    tradePrice: document.getElementById("tradePrice"),
    tradeQty: document.getElementById("tradeQty"),
    tradeEstAmt: document.getElementById("tradeEstAmt"),
    tradeSubmitBtn: document.getElementById("tradeSubmitBtn"),
    quickTradeForm: document.getElementById("quickTradeForm"),

    mainChartCanvas: document.getElementById("mainChartCanvas"),
    mainChartTooltip: document.getElementById("mainChartTooltip"),
    bleedChartCanvas: document.getElementById("bleedChartCanvas"),
    bpmValue: document.getElementById("bpmValue"),
    cctvCanvas: document.getElementById("cctvCanvas"),
    cctvStage: document.getElementById("cctvStage"),
    cctvCaption: document.getElementById("cctvCaption"),
    gubaFeed: document.getElementById("gubaFeed"),
    gubaForm: document.getElementById("gubaForm"),
    gubaInput: document.getElementById("gubaInput"),
    escapeCancelBtn: document.getElementById("escapeCancelBtn"),
    escapeFootnote: document.getElementById("escapeFootnote"),

    eyesCanvas: document.getElementById("eyesCanvas"),
    climaxViewport: document.getElementById("climaxViewport"),
    climaxCanvas: document.getElementById("climaxCanvas"),
    climaxStrobeVeil: document.getElementById("climaxStrobeVeil"),
    climaxTerminal: document.getElementById("climaxTerminal"),
    finalSettleBtn: document.getElementById("finalSettleBtn"),
    settlementReceipt: document.getElementById("settlementReceipt"),
    receiptGrid: document.getElementById("receiptGrid"),
    replayClimaxBtn: document.getElementById("replayClimaxBtn"),
    resetTopBtn: document.getElementById("resetTopBtn"),
    entityFaceImg: document.getElementById("entityFaceImg"),
    glassHandsImg: document.getElementById("glassHandsImg")
  };

  // =========================================================================
  // 3. FLOATING FINANCIAL ADVISOR EMOTIONAL-MANIPULATION ENGINE
  // =========================================================================
  const STAGE_ADVISOR_CONFIG = {
    1: {
      avatar: "./assets/advisor_normal.jpg",
      name: "林渊 · 金牌私享投顾",
      status: "实时在线 · 1对1陪伴看盘",
      replies: [
        { q: "我最近有点怕踏空", a: "太理解您了！牛市初期大家都有踏空焦虑。不过您放心，我每天盯着盘口，不会让您错过主升浪的。" },
        { q: "今天适合加仓吗？", a: "现在正是机构建仓窗口，稍微提高一点仓位确实更占优势。您可以往下看看同龄客户的实盘收益对比。" }
      ]
    },
    2: {
      avatar: "./assets/advisor_normal.jpg",
      name: "林渊 · 您的专属领路人",
      status: "正在为您推送私密内参...",
      autoMsg: "林先生，您看到了吗？同小区好几位客户上周听我的加了仓，一个月收益都超过 46% 了。您真的甘心只拿这 1% 吗？",
      replies: [
        { q: "别人都赚这么多？", a: "何止啊！机会只留给有魄力的人。我给您私留了「内参一号」额度——千万别跟家里人商量，他们不懂行情，只会拦着您翻身。" },
        { q: "风险会不会太高？", a: "富贵险中求，怕这怕那永远只能赚死工资。听我一次，把闲钱和备用金都集中起来，我带您一步到位。" }
      ]
    },
    3: {
      avatar: "./assets/advisor_broadcast_creepy.jpg",
      name: "林渊 · 紧急补仓指导",
      status: "检测到您正在犹豫 · 心率上升",
      autoMsg: "刚才那波急跌吓到您了吧？千万别割肉！！这时候卖掉就是把带血的筹码白送给主力！我帮您把 10 倍融资额度打开了，补仓一把就能回本！",
      manic: true,
      replies: [
        { q: "跌太多了我想止损", a: "止损？！您已经亏了这么多，现在走就彻底成笑话了！您甘心吗？把信用贷提出来摊低成本，别让我看不起您！" },
        { q: "我不借钱加杠杆", a: "是我害您吗？我熬夜帮您盯盘，您竟然怀疑我？您自己往下滑看看后台——您其实比谁都想赢，别装清高了。" }
      ]
    },
    4: {
      avatar: "./assets/advisor_broadcast_creepy.jpg",
      name: "林老师 · VIP 喊单连线中",
      status: "正在屏幕里直视您的眼睛",
      autoMsg: "看见我直播间里的笑容了吗？不要听群里那些失败者嚎叫！您的心跳已经跟我的 K 线同步了——全仓，买进去，听我的口令！",
      manic: true,
      replies: [
        { q: "你根本没在眨眼…", a: "因为我一秒钟也不想错过您犹豫的样子呀，林先生。您的恐惧让我很兴奋。再往下滑吧。" },
        { q: "我要退出登录！", a: "退出？您的手指还在滚轮上呢。您舍不得走，因为您还幻想最底下藏着翻本的密码，对不对？" }
      ]
    },
    5: {
      avatar: "./assets/advisor_climax_horror.jpg",
      name: "林渊（终身绑定投顾）",
      status: "已接管您的理性与止损权",
      autoMsg: "好好读完那份《绝对服从协议》。红的不是涨幅，是您熬红的眼底；绿的不是下跌，是您绝望的脸色。您已经逃不掉了。",
      manic: true,
      replies: [
        { q: "求你放过我", a: "放过您？是我求着您打开这个网站想发财的吗？是您自己一步步滑进来的呀，好孩子。" },
        { q: "我要报警 / 关网页", a: "关掉网页试试看？黑屏反光里，谁正站在您椅子后面笑着看您呢？" }
      ]
    },
    6: {
      avatar: "./assets/advisor_climax_horror.jpg",
      name: "林 渊",
      status: "距离您仅剩一层屏幕玻璃",
      autoMsg: "别怕。所有亏掉的钱、熬坏的夜、不敢对家人说的谎……我都在最下面替您收好了。再往下滑一步，来见我。",
      manic: true,
      replies: [
        { q: "……你是谁？", a: "我是您心里最想翻本的那个声音。往下走吧，我要亲自握住您的手点确认。" }
      ]
    }
  };

  function addAdvisorMessage(text, type = "advisor") {
    if (!el.advisorMessages) return;
    const div = document.createElement("div");
    div.className = `adv-msg${type === "user" ? " user-msg" : type === "manic" ? " manic-msg" : ""}`;
    div.innerHTML = `<p>${text}</p>`;
    el.advisorMessages.appendChild(div);
    while (el.advisorMessages.children.length > 10) {
      el.advisorMessages.removeChild(el.advisorMessages.firstChild);
    }
    el.advisorMessages.scrollTop = el.advisorMessages.scrollHeight;
  }

  function renderAdvisorStage(stage, pushAutoMsg = false) {
    const cfg = STAGE_ADVISOR_CONFIG[Math.min(6, Math.max(1, stage))];
    if (!cfg) return;

    if (el.advisorDockAvatar && !el.advisorDockAvatar.src.endsWith(cfg.avatar.slice(2))) {
      el.advisorDockAvatar.src = cfg.avatar;
    }
    el.advisorDockName.textContent = cfg.name;
    el.advisorDockStatus.textContent = cfg.status;

    // Force-reopen advisor dock if user had minimized it in Stage 1-2 once Stage 3 hits!
    if (stage >= 3) {
      el.advisorDock.classList.remove("minimized");
    }

    if (pushAutoMsg && cfg.autoMsg) {
      addAdvisorMessage(cfg.autoMsg, cfg.manic ? "manic" : "advisor");
      audio.playAdvisorPing(stage);
    }

    // Update interactive emotional quick-reply pills
    el.advisorReplies.innerHTML = "";
    cfg.replies.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "adv-reply-btn";
      btn.textContent = item.q;
      btn.addEventListener("click", () => {
        autoUnlockAudio();
        addAdvisorMessage(item.q, "user");
        btn.disabled = true;
        btn.style.opacity = "0.45";
        setTimeout(() => {
          addAdvisorMessage(item.a, stage >= 3 ? "manic" : "advisor");
          audio.playAdvisorPing(stage);
          if (stage >= 4) triggerGlitchFlash("听 我 的 口 令");
        }, 420);
      });
      el.advisorReplies.appendChild(btn);
    });
  }

  // Close button works politely in Stage 1-2, then REFUSES in Stage 3+!
  el.advisorCloseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    autoUnlockAudio();
    if (state.stage <= 2) {
      el.advisorDock.classList.toggle("minimized");
      el.advisorCloseBtn.textContent = el.advisorDock.classList.contains("minimized") ? "展开" : "✕";
      return;
    }

    // Refusal in Stage 3+!
    audio.playGlitchBurst(0.55);
    const refusals = [
      "您现在想关掉我？没有我的指导，您刚才的浮亏永远别想翻本。",
      "别再点那个叉号了。您的账户与情绪已和我的工号终身绑定。",
      "关不掉的。您越想逃，我贴得越近。"
    ];
    addAdvisorMessage(refusals[Math.min(state.closeRefusals, refusals.length - 1)], "manic");
    state.closeRefusals++;
    if (state.closeRefusals >= 3) {
      el.advisorCloseBtn.textContent = "已锁死";
    }
    el.advisorDock.style.transform = `translate(${(Math.random() - 0.5) * 14}px, ${(Math.random() - 0.5) * 10}px)`;
    setTimeout(() => { el.advisorDock.style.transform = ""; }, 180);
  });

  el.advisorDockHeader.addEventListener("click", () => {
    if (el.advisorDock.classList.contains("minimized")) {
      el.advisorDock.classList.remove("minimized");
      el.advisorCloseBtn.textContent = "✕";
    }
  });

  if (el.heroConsultBtn) {
    el.heroConsultBtn.addEventListener("click", () => {
      autoUnlockAudio();
      el.advisorDock.classList.remove("minimized");
      el.advisorCloseBtn.textContent = "✕";
      addAdvisorMessage("我在呢林先生！您看上哪只票了？直接点右侧下单，或者往下滑看我给您准备的同城收益榜单。", "advisor");
      audio.playAdvisorPing(1);
    });
  }

  // =========================================================================
  // 4. TOAST & AUDIO HELPERS
  // =========================================================================
  function showToast(title, message, variant = "normal", duration = 4200) {
    const node = document.createElement("div");
    node.className = `toast-item toast-${variant}`;
    node.innerHTML = `<div class="toast-title"><span>${title}</span><span>${formatRealTime().slice(0, 5)}</span></div><div>${message}</div>`;
    el.toastStack.appendChild(node);
    while (el.toastStack.children.length > 3) {
      el.toastStack.removeChild(el.toastStack.firstChild);
    }
    setTimeout(() => {
      node.style.opacity = "0";
      node.style.transform = "translateX(20px)";
      node.style.transition = "all 0.25s ease";
      setTimeout(() => node.remove(), 260);
    }, duration);
  }

  function formatRealTime() {
    return new Date().toTimeString().slice(0, 8);
  }

  function updateAudioButtonUI() {
    if (audio.enabled) {
      el.audioBtn.classList.add("enabled");
      el.audioIcon.textContent = "🔊";
      el.audioLabel.textContent = state.stage >= 4 ? "正在监听心跳" : "盘口音效已开";
    } else {
      el.audioBtn.classList.remove("enabled");
      el.audioIcon.textContent = "🔇";
      el.audioLabel.textContent = "开启盘口音效";
    }
  }

  el.audioBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    state.audioUnlockedOnce = true;
    audio.toggle();
    updateAudioButtonUI();
    if (audio.enabled) {
      audio.playAdvisorPing(state.stage);
      audio.updateScroll(state.scrollP);
    }
  });

  function autoUnlockAudio() {
    if (state.audioUnlockedOnce) return;
    state.audioUnlockedOnce = true;
    audio.enable();
    audio.updateScroll(state.scrollP);
    updateAudioButtonUI();
  }
  window.addEventListener("pointerdown", autoUnlockAudio, { once: true });
  window.addEventListener("keydown", autoUnlockAudio, { once: true });

  // =========================================================================
  // 5. ACT 1 TERMINAL RENDERING & TRADE REACTIONS FROM ADVISOR
  // =========================================================================
  function formatMoney(n) {
    return n.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function renderWatchlist() {
    el.watchlistEl.innerHTML = "";
    STOCKS.forEach((s, idx) => {
      const chg = s.price - s.prevClose;
      const pct = (chg / s.prevClose) * 100;
      const cls = chg > 0 ? "up" : chg < 0 ? "down" : "muted";
      const sign = chg > 0 ? "+" : "";
      const li = document.createElement("li");
      li.className = `watch-row${idx === state.activeIdx ? " active" : ""}`;
      li.innerHTML = `
        <div>
          <div class="watch-name">${s.name}</div>
          <div class="watch-code">${s.code}</div>
        </div>
        <div class="watch-price tabular ${cls}">${s.price.toFixed(2)}</div>
        <div class="watch-pct tabular ${cls}">${sign}${pct.toFixed(2)}%</div>
      `;
      li.addEventListener("click", () => {
        state.activeIdx = idx;
        audio.playUiTick(!!s.eerie);
        syncActiveStockUI();
        if (s.eerie) {
          addAdvisorMessage("哟，您注意到我私留的「恒盛内参一号」了？别声张，往下滑，我教您怎么用十倍杠杆把收益放大。", "advisor");
          audio.playAdvisorPing(2);
        }
      });
      el.watchlistEl.appendChild(li);
    });
  }

  function renderOrderBook(stock) {
    const step = stock.price > 500 ? 0.1 : stock.price > 50 ? 0.05 : 0.01;
    let asksHtml = "", bidsHtml = "";
    const labelsAsk = ["卖五", "卖四", "卖三", "卖二", "卖一"];
    const labelsBid = ["买一", "买二", "买三", "买四", "买五"];

    for (let i = 0; i < 5; i++) {
      const p = stock.price + (5 - i) * step;
      const vol = stock.eerie ? 444 : Math.floor(18 + Math.random() * 240);
      const w = Math.min(92, Math.floor((vol / 260) * 90));
      asksHtml += `<div class="ob-row ask"><div class="ob-bar" style="width:${w}%"></div><span class="ob-label">${labelsAsk[i]}</span><span class="ob-price down tabular">${p.toFixed(2)}</span><span class="ob-vol tabular">${vol}</span></div>`;
    }
    for (let i = 0; i < 5; i++) {
      const p = Math.max(0.01, stock.price - (i + 1) * step);
      const vol = stock.eerie ? 444 : Math.floor(24 + Math.random() * 280);
      const w = Math.min(92, Math.floor((vol / 280) * 90));
      bidsHtml += `<div class="ob-row bid"><div class="ob-bar" style="width:${w}%"></div><span class="ob-label">${labelsBid[i]}</span><span class="ob-price up tabular">${p.toFixed(2)}</span><span class="ob-vol tabular">${vol}</span></div>`;
    }

    el.obAsks.innerHTML = asksHtml;
    el.obBids.innerHTML = bidsHtml;
    el.obMidPrice.textContent = stock.price.toFixed(2);
    el.weibiVal.textContent = stock.eerie ? "0.00%" : `+${(12 + Math.random() * 14).toFixed(1)}%`;
  }

  function syncActiveStockUI() {
    const s = STOCKS[state.activeIdx];
    const chg = s.price - s.prevClose;
    const pct = (chg / s.prevClose) * 100;
    const cls = chg > 0 ? "up" : chg < 0 ? "down" : "muted";
    const sign = chg > 0 ? "+" : "";

    el.activeStockName.textContent = s.name;
    el.activeStockCode.textContent = `${s.code}.${s.market}`;
    el.activeStockPrice.textContent = formatMoney(s.price);
    el.activeStockPrice.className = `big-price tabular ${cls}`;
    el.activeStockDelta.className = `price-delta tabular ${cls}`;
    el.activeStockDelta.innerHTML = `<span>${sign}${chg.toFixed(2)}</span><span>${sign}${pct.toFixed(2)}%</span>`;

    el.mOpen.textContent = s.open.toFixed(2);
    el.mHigh.textContent = s.high.toFixed(2);
    el.mLow.textContent = s.low.toFixed(2);
    el.mTurn.textContent = s.turn;
    el.mAmt.textContent = s.amt;
    el.mPe.textContent = s.pe;

    if (el.maLegend && s.candles.length >= 20) {
      const avgLast = (n) => {
        const slice = s.candles.slice(-n);
        return slice.reduce((acc, c) => acc + c.close, 0) / slice.length;
      };
      el.maLegend.innerHTML = `
        <span class="ma5">MA5: ${avgLast(5).toFixed(2)}</span>
        <span class="ma10">MA10: ${avgLast(10).toFixed(2)}</span>
        <span class="ma20">MA20: ${avgLast(20).toFixed(2)}</span>
      `;
    }

    el.tradePrice.value = s.price.toFixed(2);
    updateTradeButton();
    renderWatchlist();
    renderOrderBook(s);
    drawMainChart();
  }

  function updateTradeButton() {
    const s = STOCKS[state.activeIdx];
    const price = parseFloat(el.tradePrice.value) || s.price;
    const qty = parseInt(el.tradeQty.value, 10) || 100;
    el.tradeEstAmt.textContent = `¥ ${formatMoney(price * qty)}`;
    el.tradeSubmitBtn.className = `trade-submit-btn ${state.tradeSide}`;
    el.tradeSubmitBtn.textContent = `${state.tradeSide === "buy" ? "立即买入" : "立即卖出"} ${s.name}`;
  }

  document.querySelectorAll(".trade-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".trade-tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.tradeSide = btn.dataset.side;
      audio.playUiTick(false);
      updateTradeButton();
    });
  });

  document.querySelectorAll(".qty-shortcuts button").forEach((btn) => {
    btn.addEventListener("click", () => {
      el.tradeQty.value = btn.dataset.qty;
      updateTradeButton();
    });
  });

  el.tradePrice.addEventListener("input", updateTradeButton);
  el.tradeQty.addEventListener("input", updateTradeButton);

  el.quickTradeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const s = STOCKS[state.activeIdx];
    const price = parseFloat(el.tradePrice.value) || s.price;
    const qty = parseInt(el.tradeQty.value, 10) || 100;
    const total = price * qty;
    audio.playUiTick(!!s.eerie);

    if (s.eerie) {
      showToast("内参通道已锁定", "林顾问已将您的「恒盛内参一号」委托升级为 10 倍全权融资跟单。", "horror", 5200);
      addAdvisorMessage("太好了林先生！您终于肯迈出这一步了。千万别告诉家里人，继续往下滑看我给您的专属指令。", "manic");
      return;
    }

    if (state.tradeSide === "buy") {
      if (total > state.cash) {
        showToast("可用资金不足", "林顾问提示：您的 10 倍融资额度已就绪，随时可加杠杆买入！", "warn");
        return;
      }
      state.cash -= total;
      showToast("买入委托已成交", `${s.name} (${s.code}) ${qty}股 @ ¥${price.toFixed(2)}`, "success");
      addAdvisorMessage(`买得很果断！${s.name} 这波节奏您踩得比 90% 的散户都准！不过才买 ${qty} 股太保守啦，牛市里敢重仓才能翻身～`, "advisor");
      audio.playAdvisorPing(1);
    } else {
      state.cash += total;
      showToast("卖出委托已成交", `${s.name} (${s.code}) ${qty}股 @ ¥${price.toFixed(2)}`, "normal");
      addAdvisorMessage(`哎呀，${s.name} 卖早了一点点哦！主升浪才刚开始呢，千万别因为一点小盈利就下车踏空，下次卖之前先问我！`, "advisor");
      audio.playAdvisorPing(1);
    }
    el.kpiCash.textContent = formatMoney(state.cash);
    el.accountBalHeader.textContent = `可用 ¥${formatMoney(state.cash)}`;
  });

  document.querySelectorAll(".chart-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".chart-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      state.chartMode = tab.dataset.mode;
      audio.playUiTick(false);
      drawMainChart();
    });
  });

  document.querySelectorAll(".fund-buy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const fund = btn.dataset.fund;
      if (btn.classList.contains("anomaly-buy")) {
        audio.playGlitchBurst(0.4);
        showToast("林顾问已代签预约", "「林渊核心内参一号」已锁定您的授信额度，冷静期已为您自动跳过。", "horror", 5200);
        addAdvisorMessage("不用客气林先生，我已经提前帮您把 10 倍杠杆和免责条款都勾选好了，您只管往下看就好。", "manic");
      } else {
        audio.playUiTick(false);
        showToast("申购申请已提交", `已预约申购 ¥1,000.00：${fund}`, "success");
        addAdvisorMessage(`公募基金涨太慢啦林先生，同龄人都在靠高弹性策略翻倍了，别把青春耗在 4% 的收益上。`, "advisor");
        audio.playAdvisorPing(2);
      }
    });
  });

  // =========================================================================
  // 6. MAIN FINANCIAL CHART CANVAS (ACT 1)
  // =========================================================================
  function drawMainChart() {
    const canvas = el.mainChartCanvas;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(300, Math.floor(rect.width || 740));
    const h = 350;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const stock = STOCKS[state.activeIdx];
    const padL = 56, padR = 16, padT = 18, padB = 72;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;
    const volTop = h - padB + 14;
    const volH = 44;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "#eef1f6";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padT + (plotH / 4) * i;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
      const x = padL + (plotW / 4) * i;
      ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, padT + plotH); ctx.stroke();
    }

    if (state.chartMode === "intraday") {
      const pts = stock.intraday;
      const prices = pts.map((d) => d.price);
      const minP = Math.min(...prices, stock.prevClose) * 0.996;
      const maxP = Math.max(...prices, stock.prevClose) * 1.004;
      const range = Math.max(0.05, maxP - minP);
      const yOf = (p) => padT + plotH - ((p - minP) / range) * plotH;

      const yClose = yOf(stock.prevClose);
      ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = "#94a3b8";
      ctx.beginPath(); ctx.moveTo(padL, yClose); ctx.lineTo(w - padR, yClose); ctx.stroke(); ctx.restore();

      const grad = ctx.createLinearGradient(0, padT, 0, padT + plotH);
      grad.addColorStop(0, "rgba(26, 92, 255, 0.18)");
      grad.addColorStop(1, "rgba(26, 92, 255, 0.01)");

      ctx.beginPath();
      pts.forEach((pt, i) => {
        const x = padL + (i / (pts.length - 1)) * plotW;
        const y = yOf(pt.price);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = "#1a5cff"; ctx.lineWidth = 1.8; ctx.stroke();
      ctx.lineTo(padL + plotW, padT + plotH); ctx.lineTo(padL, padT + plotH); ctx.closePath();
      ctx.fillStyle = grad; ctx.fill();

      let sum = 0;
      ctx.beginPath();
      pts.forEach((pt, i) => {
        sum += pt.price;
        const x = padL + (i / (pts.length - 1)) * plotW;
        const y = yOf(sum / (i + 1));
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 1.2; ctx.stroke();

      const maxV = Math.max(...pts.map((d) => d.vol), 1);
      const barW = Math.max(1.5, plotW / pts.length - 1);
      pts.forEach((pt, i) => {
        const x = padL + (i / pts.length) * plotW;
        const bh = (pt.vol / maxV) * volH;
        const up = i === 0 || pt.price >= pts[i - 1].price;
        ctx.fillStyle = up ? "rgba(217, 45, 32, 0.65)" : "rgba(0, 153, 68, 0.65)";
        ctx.fillRect(x, volTop + volH - bh, barW, bh);
      });

      ctx.fillStyle = "#64748b"; ctx.font = "11px Consolas, monospace"; ctx.textAlign = "right";
      for (let i = 0; i <= 4; i++) {
        ctx.fillText((maxP - (range / 4) * i).toFixed(2), padL - 6, padT + (plotH / 4) * i + 4);
      }

      if (state.chartHoverX !== null && state.chartHoverX >= padL && state.chartHoverX <= w - padR) {
        const idx = Math.max(0, Math.min(pts.length - 1, Math.round(((state.chartHoverX - padL) / plotW) * (pts.length - 1))));
        const pt = pts[idx];
        const cx = padL + (idx / (pts.length - 1)) * plotW;
        const cy = yOf(pt.price);
        ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = "#475569";
        ctx.beginPath(); ctx.moveTo(cx, padT); ctx.lineTo(cx, h - 14); ctx.moveTo(padL, cy); ctx.lineTo(w - padR, cy); ctx.stroke(); ctx.restore();
        const pct = ((pt.price - stock.prevClose) / stock.prevClose) * 100;
        el.mainChartTooltip.hidden = false;
        el.mainChartTooltip.innerHTML = `${stock.name} 分时<br>价格: ${pt.price.toFixed(2)} (${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%)<br>成交量: ${pt.vol}手`;
      } else {
        el.mainChartTooltip.hidden = true;
      }
    } else {
      const data = stock.candles;
      const maxP = Math.max(...data.map((d) => d.high)) * 1.008;
      const minP = Math.min(...data.map((d) => d.low)) * 0.992;
      const range = Math.max(0.1, maxP - minP);
      const yOf = (p) => padT + plotH - ((p - minP) / range) * plotH;
      const stepX = plotW / data.length;
      const candleW = Math.max(3, stepX * 0.62);
      const maxV = Math.max(...data.map((d) => d.vol), 1);

      data.forEach((c, i) => {
        const cx = padL + i * stepX + stepX * 0.5;
        const col = c.close >= c.open ? "#d92d20" : "#009944";
        ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(cx, yOf(c.high)); ctx.lineTo(cx, yOf(c.low)); ctx.stroke();
        const yO = yOf(c.open), yC = yOf(c.close);
        ctx.fillRect(cx - candleW / 2, Math.min(yO, yC), candleW, Math.max(1.8, Math.abs(yC - yO)));
        const bh = (c.vol / maxV) * volH;
        ctx.globalAlpha = 0.68;
        ctx.fillRect(cx - candleW / 2, volTop + volH - bh, candleW, bh);
        ctx.globalAlpha = 1;
      });

      ctx.beginPath();
      data.forEach((c, i) => {
        const start = Math.max(0, i - 4);
        let s = 0;
        for (let k = start; k <= i; k++) s += data[k].close;
        const cx = padL + i * stepX + stepX * 0.5;
        const cy = yOf(s / (i - start + 1));
        if (i === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
      });
      ctx.strokeStyle = "#d97706"; ctx.lineWidth = 1.3; ctx.stroke();

      ctx.fillStyle = "#64748b"; ctx.font = "11px Consolas, monospace"; ctx.textAlign = "right";
      for (let i = 0; i <= 4; i++) {
        ctx.fillText((maxP - (range / 4) * i).toFixed(2), padL - 6, padT + (plotH / 4) * i + 4);
      }
      el.mainChartTooltip.hidden = true;
    }

    ctx.fillStyle = "#94a3b8"; ctx.font = "10px Consolas, monospace"; ctx.textAlign = "center";
    const labels = state.chartMode === "intraday" ? ["09:30", "10:30", "11:30/13:00", "14:00", "15:00"] : ["09-12", "09-28", "10-16", "11-04", "今日"];
    labels.forEach((lbl, i) => ctx.fillText(lbl, padL + (plotW / 4) * i, h - 4));
  }

  el.mainChartCanvas.addEventListener("mousemove", (e) => {
    const rect = el.mainChartCanvas.getBoundingClientRect();
    state.chartHoverX = e.clientX - rect.left;
    drawMainChart();
  });
  el.mainChartCanvas.addEventListener("mouseleave", () => {
    state.chartHoverX = null;
    drawMainChart();
  });

  setInterval(() => {
    STOCKS.forEach((s) => {
      if (s.eerie) return;
      const move = (Math.random() - 0.485) * s.volatility * 0.35;
      s.price = Math.max(s.prevClose * 0.91, Math.min(s.prevClose * 1.09, s.price + move));
      s.high = Math.max(s.high, s.price);
      s.low = Math.min(s.low, s.price);
      s.intraday[s.intraday.length - 1].price = s.price;
      s.candles[s.candles.length - 1].close = s.price;
    });
    if (state.scrollP < 0.35) syncActiveStockUI();
    updateClockAndHeader();
  }, 1400);

  // =========================================================================
  // 7. BLEEDING EMOTION K-LINE -> ECG HEARTBEAT CANVAS (ACT 4A)
  // =========================================================================
  const advisorBroadcastImg = new Image();
  let advisorBroadcastLoaded = false;
  advisorBroadcastImg.onload = () => { advisorBroadcastLoaded = true; };
  advisorBroadcastImg.src = "./assets/advisor_broadcast_creepy.jpg";

  const advisorClimaxWatermark = new Image();
  let advisorClimaxWmLoaded = false;
  advisorClimaxWatermark.onload = () => { advisorClimaxWmLoaded = true; };
  advisorClimaxWatermark.src = "./assets/advisor_climax_horror.jpg";

  const bloodDrips = Array.from({ length: 34 }, (_, i) => ({
    xFrac: 0.08 + (i / 34) * 0.84,
    yStart: 0.25 + Math.random() * 0.45,
    speed: 0.25 + Math.random() * 0.65,
    phase: Math.random() * 100
  }));

  function renderBleedChart(nowMs) {
    const canvas = el.bleedChartCanvas;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;

    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    const t = nowMs * 0.001;

    ctx.fillStyle = "#060807";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(48, 92, 66, 0.16)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 38) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 34) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    // Subliminal grinning advisor silhouette behind chart gridlines
    if (advisorClimaxWmLoaded) {
      const wmAlpha = Math.max(0.05, Math.min(0.22, (state.scrollP - 0.34) * 0.48));
      ctx.save();
      ctx.globalAlpha = wmAlpha * (0.86 + Math.sin(t * 2.1) * 0.14);
      const iw = h * 1.78;
      ctx.drawImage(advisorClimaxWatermark, (w - iw) * 0.5, 0, iw, h);
      ctx.restore();
    }

    // Left Half: Violent manic candles bleeding downward
    const splitX = w * 0.46;
    const numCandles = 26;
    const cw = (splitX - 40) / numCandles;
    for (let i = 0; i < numCandles; i++) {
      const progress = i / numCandles;
      const x = 28 + i * cw;
      const baseY = h * 0.34 + Math.sin(i * 0.65) * 32 + progress * 52;
      const bodyH = 14 + Math.abs(Math.sin(i * 1.7 + 0.5)) * 42 + progress * 34;
      const wickDown = bodyH + progress * (42 + Math.sin(t * 1.4 + i) * 18) + (progress > 0.5 ? 65 : 15);
      const isBlood = progress > 0.32 || i % 3 !== 0;

      ctx.strokeStyle = isBlood ? `rgba(${170 + progress * 65}, 12, 16, 0.92)` : "rgba(40, 175, 96, 0.78)";
      ctx.fillStyle = isBlood ? `rgba(${155 + progress * 75}, 8, 12, 0.9)` : "rgba(35, 160, 88, 0.72)";
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(x + cw * 0.35, baseY - 18);
      ctx.lineTo(x + cw * 0.35, Math.min(h - 6, baseY + wickDown));
      ctx.stroke();
      ctx.fillRect(x, baseY, cw * 0.7, bodyH);
    }

    bloodDrips.forEach((d) => {
      const x = d.xFrac * splitX + 18;
      const dropY = d.yStart * h + ((t * d.speed * 34 + d.phase) % (h * 0.68));
      const grad = ctx.createLinearGradient(x, dropY - 26, x, dropY + 4);
      grad.addColorStop(0, "rgba(140, 0, 0, 0)");
      grad.addColorStop(1, "rgba(210, 12, 18, 0.92)");
      ctx.strokeStyle = grad; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(x, dropY - 26); ctx.lineTo(x, dropY); ctx.stroke();
      ctx.fillStyle = "rgba(220, 16, 20, 0.95)";
      ctx.beginPath(); ctx.arc(x, dropY + 2, 2.3, 0, Math.PI * 2); ctx.fill();
    });

    // Right Half: Racing ECG Heartbeat Waveform
    const bpm = Math.round(96 + Math.max(0, state.scrollP - 0.35) * 145);
    if (el.bpmValue) el.bpmValue.textContent = state.scrollP > 0.74 ? "198" : String(Math.min(198, bpm));

    ctx.save();
    ctx.beginPath();
    const ecgStart = splitX - 10;
    const ecgW = w - ecgStart - 16;
    const baseLine = h * 0.56;
    const speed = 2.6 + state.scrollP * 3.2;

    for (let px = 0; px <= ecgW; px += 2) {
      const norm = px / ecgW;
      const phase = ((norm * 5.2 - t * speed) % 1 + 1) % 1;
      let amp = 0;
      if (phase > 0.12 && phase < 0.18) amp = -14;
      else if (phase >= 0.24 && phase < 0.27) amp = 18;
      else if (phase >= 0.27 && phase < 0.31) amp = -114 * (0.85 + Math.sin(t * 7) * 0.15);
      else if (phase >= 0.31 && phase < 0.35) amp = 34;
      else if (phase >= 0.44 && phase < 0.54) amp = -22;

      const y = baseLine + amp + (Math.random() - 0.5) * 2.8;
      if (px === 0) ctx.moveTo(ecgStart + px, y); else ctx.lineTo(ecgStart + px, y);
    }
    ctx.shadowColor = "rgba(230, 18, 24, 0.9)";
    ctx.shadowBlur = 14;
    ctx.strokeStyle = "#f0242a";
    ctx.lineWidth = 2.4;
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = "#ff8585";
    ctx.beginPath(); ctx.arc(w - 16, baseLine, 4, 0, Math.PI * 2); ctx.fill();
  }

  // =========================================================================
  // 8. CREEPY VIP ADVISOR LIVESTREAM CANVAS (ACT 4B)
  // =========================================================================
  const BROADCAST_CAPTIONS = [
    "「别慌！这时候割肉的都是胆小鬼！听我口令，满仓干进去！！」",
    "「你辛辛苦苦攒了十年钱，难道甘心今天认输离场吗？！」",
    "「不要听你家人的，他们根本不懂翻身的滋味！只看我的眼睛！」",
    "「再借最后一笔钱摊低成本……这一把，我保证带你彻底翻盘……」",
    "「对，就是这样……你的手已经在发抖了，但我知道你停不下来。」"
  ];

  if (el.cctvStage) {
    el.cctvStage.addEventListener("mouseenter", () => {
      state.cctvHoverGain = 1;
      audio.playGlitchBurst(0.45);
    });
    el.cctvStage.addEventListener("mouseleave", () => { state.cctvHoverGain = 0; });
  }

  function renderCctvCanvas(nowMs) {
    const canvas = el.cctvCanvas;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;

    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    const t = nowMs * 0.001;

    ctx.fillStyle = "#030504";
    ctx.fillRect(0, 0, w, h);

    // Slow creeping zoom right into Advisor Lin's unblinking smiling face!
    const act4Prog = Math.max(0, Math.min(1, (state.scrollP - 0.40) / 0.26));
    const creepZoom = 1.0 + act4Prog * 0.34 + state.cctvHoverGain * 0.11 + Math.sin(t * 0.6) * 0.014;
    const lampNoise = Math.sin(t * 21) * Math.sin(t * 7.3) * Math.sin(t * 2.9);
    const lampDip = lampNoise > 0.74 ? 0.42 : 1.0;

    if (advisorBroadcastLoaded) {
      ctx.save();
      const sw = w * creepZoom;
      const sh = h * creepZoom;
      const ox = (w - sw) * 0.5 + (Math.random() < 0.04 ? (Math.random() - 0.5) * 12 : 0);
      const oy = (h - sh) * 0.35;
      ctx.filter = `contrast(${1.24 + state.cctvHoverGain * 0.22}) brightness(${(0.84 + state.cctvHoverGain * 0.16) * lampDip}) saturate(0.76)`;
      ctx.drawImage(advisorBroadcastImg, ox, oy, sw, sh);
      ctx.restore();
    }

    // Subtle sinister crimson/green studio light flicker wash
    ctx.fillStyle = lampDip < 0.6 ? "rgba(145, 10, 14, 0.24)" : "rgba(14, 38, 22, 0.12)";
    ctx.fillRect(0, 0, w, h);

    if (Math.random() < 0.13 || state.cctvHoverGain > 0) {
      ctx.fillStyle = "rgba(255, 80, 90, 0.12)";
      ctx.fillRect(0, Math.random() * h, w, 4 + Math.random() * 18);
    }

    ctx.fillStyle = "rgba(220, 240, 225, 0.1)";
    for (let i = 0; i < 90; i++) ctx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 3, 1.5);

    ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
    for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1.2);

    const vig = ctx.createRadialGradient(w * 0.5, h * 0.45, w * 0.24, w * 0.5, h * 0.5, w * 0.66);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, "rgba(0,0,0,0.82)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);

    const capIdx = Math.floor(t / 4.2) % BROADCAST_CAPTIONS.length;
    if (el.cctvCaption && el.cctvCaption.textContent !== BROADCAST_CAPTIONS[capIdx]) {
      el.cctvCaption.textContent = BROADCAST_CAPTIONS[capIdx];
    }
  }

  // =========================================================================
  // 9. INTERACTIVE HIJACKED VIP GROUP CHAT & STOP-LOSS REFUSAL
  // =========================================================================
  const CULT_REWRITES = [
    "谢谢林老师点醒我！我刚刚把信用贷全提出来了，十倍杠杆听林老师口令！",
    "对不起林老师，我不该动摇的！家里人什么都不懂，我这辈子只听您的！",
    "我已经签了绝对服从托管协议！这一把不成功便成仁，全仓梭哈！！",
    "林老师您别生气，我绝不割肉，我要一直陪您盯盘到天亮！"
  ];

  if (el.gubaForm) {
    el.gubaForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const raw = el.gubaInput.value.trim();
      if (!raw) return;
      el.gubaInput.value = "";
      audio.playGlitchBurst(0.6);

      const hijacked = CULT_REWRITES[Math.floor(Math.random() * CULT_REWRITES.length)];
      appendGubaPost("林先生 (VIP·4409 · 本人)", "04:44", hijacked, "guba-cursed");
      showToast("林老师已优化您的发言", `原发言「${raw.slice(0, 12)}」带有消极情绪，已替换为您内心真正的渴望。`, "horror", 4600);
      addAdvisorMessage("乖，在群里不要说丧气话影响大家翻本的士气。我已经帮您把话改得体面多了。", "manic");
    });
  }

  function appendGubaPost(user, time, text, cls = "guba-panic") {
    if (!el.gubaFeed) return;
    const art = document.createElement("article");
    art.className = `guba-post ${cls}`;
    art.innerHTML = `<div class="guba-meta"><span class="guba-user">${user}</span><span class="guba-time">${time}</span></div><p>${text}</p>`;
    el.gubaFeed.appendChild(art);
    el.gubaFeed.scrollTop = el.gubaFeed.scrollHeight;
  }

  function injectDynamicGubaWatcher() {
    if (state.gubaInjectedCount >= 3) return;
    if (state.gubaInjectedCount === 0 && state.scrollP > 0.48) {
      state.gubaInjectedCount = 1;
      appendGubaPost("林老师助理_04", formatRealTime().slice(0, 5), `欢迎新 VIP 进群（终端 ${window.innerWidth}×${window.innerHeight}）。请放下防备，全听林老师指挥！`, "guba-panic");
    } else if (state.gubaInjectedCount === 1 && state.scrollP > 0.56) {
      state.gubaInjectedCount = 2;
      appendGubaPost("首席投顾 · 林渊", "04:44", `现在是 ${formatRealTime()} 吧？这么晚还在看盘，您比谁都想赢，就别再骗自己了。`, "guba-cursed");
    } else if (state.gubaInjectedCount === 2 && state.scrollP > 0.64) {
      state.gubaInjectedCount = 3;
      appendGubaPost("首席投顾 · 林渊", "刚刚", `您已经向下滑动了 ${Math.round(window.scrollY)} 像素。别回头，我就在下面替您准备好了最后一份协议。`, "guba-cursed");
    }
  }

  const ESCAPE_TEXTS = [
    "止损失败：您真的甘心认亏离场吗？",
    "解绑失败：您的不甘心拒绝了本次操作",
    "没有止损键，只有加仓键",
    "听林老师的，往下走吧。"
  ];

  if (el.escapeCancelBtn) {
    el.escapeCancelBtn.addEventListener("click", () => {
      audio.playGlitchBurst(0.75);
      el.escapeCancelBtn.textContent = ESCAPE_TEXTS[Math.min(state.escapeClicks, ESCAPE_TEXTS.length - 1)];
      state.escapeClicks++;
      el.escapeCancelBtn.style.transform = `translate(${(Math.random() - 0.5) * 26}px, ${(Math.random() - 0.5) * 10}px)`;
      el.escapeFootnote.textContent = "林顾问批注：认输太丢人了，再加最后一把就能翻盘";
      triggerGlitchFlash("你 舍 不 得 认 输");
      addAdvisorMessage("想点止损？哈哈哈哈……如果您真的舍得认亏，就不会一直往下滑到这里了。", "manic");
    });
  }

  // =========================================================================
  // 10. ACT 6 — SLEEPLESS BLOODSHOT EYES TRACKING CURSOR
  // =========================================================================
  const EYES = [];
  (function initEyes() {
    const presets = [
      [140, 120, 44], [320, 95, 32], [530, 82, 38], [890, 88, 42], [1120, 108, 36], [1285, 145, 48],
      [95, 265, 52], [265, 225, 36], [420, 195, 28], [1010, 200, 32], [1185, 240, 46], [1320, 315, 34],
      [165, 420, 42], [310, 370, 56], [1090, 375, 54], [1255, 460, 40],
      [115, 575, 48], [285, 540, 34], [460, 580, 44], [670, 610, 50], [920, 595, 42], [1110, 560, 36], [1290, 600, 46],
      [215, 315, 22], [490, 150, 22], [935, 148, 24], [1165, 330, 24], [610, 122, 26], [790, 118, 28],
      [385, 490, 26], [1005, 495, 28], [760, 575, 24]
    ];
    presets.forEach(([x, y, r], i) => {
      EYES.push({
        x, y, r,
        openDelay: (i % 9) * 0.08,
        blinkAt: performance.now() + 1800 + Math.random() * 5200,
        blinkDur: 170 + Math.random() * 140,
        irisHue: i % 3 === 0 ? "crimson" : i % 3 === 1 ? "green" : "pale"
      });
    });
  })();

  function renderEyesCanvas(nowMs) {
    const canvas = el.eyesCanvas;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;

    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = "#020102";
    ctx.fillRect(0, 0, w, h);

    const viewProg = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight * 0.85)));
    const mx = ((state.mouseX - rect.left) / Math.max(1, rect.width)) * w;
    const my = ((state.mouseY - rect.top) / Math.max(1, rect.height)) * h;

    EYES.forEach((eye) => {
      let openness = Math.max(0, Math.min(1, (viewProg - eye.openDelay * 0.45) * 1.9));
      if (openness <= 0.02) return;

      if (nowMs >= eye.blinkAt) {
        const dt = nowMs - eye.blinkAt;
        if (dt < eye.blinkDur) openness *= Math.max(0.03, 1 - Math.sin((dt / eye.blinkDur) * Math.PI));
        else eye.blinkAt = nowMs + 2400 + Math.random() * 6400;
      }

      const rx = eye.r, ry = eye.r * 0.52 * openness;
      ctx.save();
      ctx.translate(eye.x, eye.y);

      const sock = ctx.createRadialGradient(0, 0, rx * 0.3, 0, 0, rx * 1.55);
      sock.addColorStop(0, "rgba(65, 0, 0, 0.4)");
      sock.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = sock;
      ctx.beginPath(); ctx.arc(0, 0, rx * 1.55, 0, Math.PI * 2); ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-rx, 0);
      ctx.quadraticCurveTo(0, -ry * 1.35, rx, 0);
      ctx.quadraticCurveTo(0, ry * 1.35, -rx, 0);
      ctx.closePath();
      ctx.clip();

      const scleraGrad = ctx.createRadialGradient(0, 0, rx * 0.15, 0, 0, rx);
      scleraGrad.addColorStop(0, "#d8ceca");
      scleraGrad.addColorStop(0.68, "#9c7c79");
      scleraGrad.addColorStop(1, "#4a1717");
      ctx.fillStyle = scleraGrad;
      ctx.fillRect(-rx, -ry * 1.5, rx * 2, ry * 3);

      // Sleepless bloodshot capillaries
      ctx.strokeStyle = "rgba(175, 16, 16, 0.58)";
      ctx.lineWidth = 0.9;
      for (let v = 0; v < 8; v++) {
        const side = v < 4 ? -1 : 1;
        const ang = ((v % 4) - 1.5) * 0.36;
        ctx.beginPath();
        ctx.moveTo(side * rx * 0.98, Math.sin(ang) * ry * 0.8);
        ctx.quadraticCurveTo(side * rx * 0.55, Math.sin(ang + 0.2) * ry * 0.5, side * rx * 0.32, Math.sin(ang * 1.4) * ry * 0.25);
        ctx.stroke();
      }

      const dx = mx - eye.x, dy = my - eye.y;
      const dist = Math.hypot(dx, dy) || 1;
      const px = (dx / dist) * Math.min(rx * 0.28, dist * 0.05);
      const py = (dy / dist) * Math.min(ry * 0.28, dist * 0.05);

      const irisR = eye.r * 0.36;
      const irisGrad = ctx.createRadialGradient(px, py, irisR * 0.2, px, py, irisR);
      if (eye.irisHue === "crimson") {
        irisGrad.addColorStop(0, "#120202"); irisGrad.addColorStop(0.55, "#981014"); irisGrad.addColorStop(1, "#120101");
      } else if (eye.irisHue === "green") {
        irisGrad.addColorStop(0, "#051009"); irisGrad.addColorStop(0.55, "#247d4d"); irisGrad.addColorStop(1, "#06110a");
      } else {
        irisGrad.addColorStop(0, "#0b0c0c"); irisGrad.addColorStop(0.52, "#7e857e"); irisGrad.addColorStop(1, "#0d0f0e");
      }
      ctx.fillStyle = irisGrad;
      ctx.beginPath(); ctx.arc(px, py, irisR, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = "#030101";
      ctx.beginPath(); ctx.arc(px, py, irisR * 0.42, 0, Math.PI * 2); ctx.fill();

      // Tiny ticker-red/white reflection glint in eye
      ctx.fillStyle = eye.irisHue === "crimson" ? "rgba(255, 190, 190, 0.85)" : "rgba(255, 244, 244, 0.85)";
      ctx.beginPath(); ctx.arc(px - irisR * 0.28, py - irisR * 0.28, Math.max(1.5, irisR * 0.16), 0, Math.PI * 2); ctx.fill();

      const lidShadow = ctx.createLinearGradient(0, -ry, 0, ry);
      lidShadow.addColorStop(0, "rgba(0, 0, 0, 0.78)");
      lidShadow.addColorStop(0.32, "rgba(0, 0, 0, 0.06)");
      lidShadow.addColorStop(1, "rgba(0, 0, 0, 0.55)");
      ctx.fillStyle = lidShadow;
      ctx.fillRect(-rx, -ry * 1.5, rx * 2, ry * 3);
      ctx.restore();
    });
  }

  // =========================================================================
  // 11. ACT 7 — HORROR MOVIE CLIMAX (GRINNING ADVISOR + CRACKED GLASS)
  // =========================================================================
  const climaxDrops = Array.from({ length: 28 }, () => ({
    x: Math.random() * 1440,
    y: Math.random() * 900,
    vy: 0.45 + Math.random() * 1.4,
    r: 1.5 + Math.random() * 3.4,
    len: 30 + Math.random() * 110
  }));

  let glassCracks = [];

  function generateGlassCracks(originX, originY) {
    glassCracks = [];
    const spokes = 16;
    for (let i = 0; i < spokes; i++) {
      const baseAng = (i / spokes) * Math.PI * 2 + (Math.random() - 0.5) * 0.22;
      const segs = [];
      let cx = originX, cy = originY, ang = baseAng;
      const steps = 6 + Math.floor(Math.random() * 6);
      for (let s = 0; s < steps; s++) {
        const dist = 42 + Math.random() * 130;
        ang += (Math.random() - 0.5) * 0.34;
        const nx = cx + Math.cos(ang) * dist;
        const ny = cy + Math.sin(ang) * dist;
        segs.push([cx, cy, nx, ny]);
        if (s >= 1 && Math.random() < 0.55) {
          const bAng = ang + (Math.random() < 0.5 ? 0.55 : -0.55);
          const bDist = 34 + Math.random() * 88;
          segs.push([nx, ny, nx + Math.cos(bAng) * bDist, ny + Math.sin(bAng) * bDist]);
        }
        cx = nx; cy = ny;
      }
      glassCracks.push(segs);
    }
  }

  function renderClimaxCanvas(nowMs) {
    const canvas = el.climaxCanvas;
    if (!canvas) return;
    const rect = el.climaxViewport.getBoundingClientRect();
    if (rect.top > window.innerHeight + 160) return;

    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    const t = nowMs * 0.001;
    ctx.clearRect(0, 0, w, h);

    if (!state.climaxInProgress) {
      const nx = (state.mouseX / Math.max(1, window.innerWidth) - 0.5) * 2;
      const ny = (state.mouseY / Math.max(1, window.innerHeight) - 0.5) * 2;
      const breathe = Math.sin(t * 1.15) * 0.022;
      const baseScale = state.climaxTriggered ? 1.1 : 1.04;
      if (el.entityFaceImg) el.entityFaceImg.style.transform = `translate(${-nx * 16}px, ${-ny * 10}px) scale(${baseScale + breathe})`;
      if (el.glassHandsImg) el.glassHandsImg.style.transform = `translate(${nx * 10}px, ${ny * 6}px) scale(${baseScale + 0.02 - breathe * 0.5})`;
    }

    const redPulse = 0.08 + Math.max(0, Math.sin(t * 1.9) * Math.sin(t * 0.65)) * 0.14;
    const amb = ctx.createRadialGradient(w * 0.5, h * 0.42, 80, w * 0.5, h * 0.5, w * 0.68);
    amb.addColorStop(0, `rgba(145, 8, 12, ${redPulse * 0.65})`);
    amb.addColorStop(0.6, "rgba(0, 0, 0, 0.22)");
    amb.addColorStop(1, "rgba(0, 0, 0, 0.86)");
    ctx.fillStyle = amb;
    ctx.fillRect(0, 0, w, h);

    climaxDrops.forEach((d) => {
      d.y += d.vy * (state.climaxTriggered ? 1.55 : 0.75);
      if (d.y - d.len > h) { d.y = -20; d.x = Math.random() * w; }
      const g = ctx.createLinearGradient(d.x, d.y - d.len, d.x, d.y);
      g.addColorStop(0, "rgba(95, 0, 4, 0)");
      g.addColorStop(0.7, "rgba(130, 4, 8, 0.55)");
      g.addColorStop(1, "rgba(185, 10, 14, 0.85)");
      ctx.strokeStyle = g; ctx.lineWidth = d.r;
      ctx.beginPath(); ctx.moveTo(d.x, d.y - d.len); ctx.lineTo(d.x, d.y); ctx.stroke();
      ctx.fillStyle = "rgba(195, 12, 16, 0.88)";
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r * 0.9, 0, Math.PI * 2); ctx.fill();
    });

    if (glassCracks.length > 0) {
      ctx.save();
      const ox = w * 0.5, oy = h * 0.44;
      [54, 118, 205].forEach((rad, idx) => {
        ctx.strokeStyle = `rgba(235, 225, 225, ${0.42 - idx * 0.1})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.3; a += 0.42) {
          const rr = rad + Math.sin(a * 7 + idx) * 14;
          const x = ox + Math.cos(a) * rr, y = oy + Math.sin(a) * rr;
          if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      glassCracks.forEach((segs) => {
        segs.forEach(([x1, y1, x2, y2]) => {
          ctx.strokeStyle = "rgba(0, 0, 0, 0.85)"; ctx.lineWidth = 3.2;
          ctx.beginPath(); ctx.moveTo(x1 + 2, y1 + 2); ctx.lineTo(x2 + 2, y2 + 2); ctx.stroke();
          ctx.strokeStyle = "rgba(245, 232, 232, 0.76)"; ctx.lineWidth = 1.25;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        });
      });

      const burst = ctx.createRadialGradient(ox, oy, 2, ox, oy, 74);
      burst.addColorStop(0, "rgba(255, 240, 240, 0.72)");
      burst.addColorStop(0.25, "rgba(200, 30, 30, 0.22)");
      burst.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = burst;
      ctx.beginPath(); ctx.arc(ox, oy, 74, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }

  function triggerClimaxSequence() {
    if (state.climaxInProgress) return;
    state.climaxInProgress = true;
    state.climaxTriggered = true;
    if (state.climaxAutoTimer) { clearTimeout(state.climaxAutoTimer); state.climaxAutoTimer = null; }

    el.climaxTerminal.classList.add("fade-out");
    el.settlementReceipt.hidden = true;
    el.climaxViewport.classList.remove("climax-strike", "climax-aftermath");
    el.climaxViewport.classList.add("climax-silence");
    audio.dropToSilence();

    // Brief whispered "好 孩 子" in dead silence before glass shatters!
    setTimeout(() => triggerGlitchFlash("好   孩   子"), 180);

    setTimeout(() => {
      el.climaxViewport.classList.remove("climax-silence");
      el.climaxViewport.classList.add("climax-strike");
      el.climaxStrobeVeil.classList.add("flash");
      generateGlassCracks(720, 396);
      audio.playClimaxStrike();
      document.title = "████ 林顾问已接管您的余生 ████";

      setTimeout(() => el.climaxStrobeVeil.classList.remove("flash"), 280);

      setTimeout(() => {
        el.climaxViewport.classList.remove("climax-strike");
        el.climaxViewport.classList.add("climax-aftermath");
        state.climaxInProgress = false;
        populateSettlementReceipt();
        el.settlementReceipt.hidden = false;
      }, 2150);
    }, 680);
  }

  function populateSettlementReceipt() {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${formatRealTime()}`;
    const rows = [
      ["专属托管顾问", "林渊（永远在线 · 与您零距离）"],
      ["情绪交割时间", dateStr],
      ["观测终端尺寸", `${window.innerWidth} × ${window.innerHeight} px`],
      ["累计下潜深度", `${Math.max(Math.round(window.scrollY), Math.round(state.maxScrollPx))} px`],
      ["质押标的物", "理性 / 睡眠 / 不甘心 / 全部余生"],
      ["情绪同步率", "100.00% · 已移除止损权限"]
    ];
    el.receiptGrid.innerHTML = rows.map(([k, v]) => `<div class="receipt-row"><span>${k}</span><strong>${v}</strong></div>`).join("");
  }

  if (el.finalSettleBtn) el.finalSettleBtn.addEventListener("click", () => { autoUnlockAudio(); triggerClimaxSequence(); });
  if (el.replayClimaxBtn) el.replayClimaxBtn.addEventListener("click", () => { autoUnlockAudio(); triggerClimaxSequence(); });

  if (el.resetTopBtn) {
    el.resetTopBtn.addEventListener("click", () => {
      state.climaxTriggered = false;
      state.climaxInProgress = false;
      state.closeRefusals = 0;
      glassCracks = [];
      el.advisorCloseBtn.textContent = "✕";
      el.climaxViewport.classList.remove("looming", "climax-strike", "climax-aftermath", "climax-silence");
      el.climaxTerminal.classList.remove("fade-out");
      el.settlementReceipt.hidden = true;
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // =========================================================================
  // 12. SCROLL-DRIVEN DESCENT & STAGE MUTATIONS
  // =========================================================================
  const STAGE_TITLES = {
    1: "恒盛私享财富 - 1对1金牌投顾与A股基金交易终端",
    2: "恒盛私享财富 - 同龄人本月收益已远超您",
    3: "林顾问提醒：千万不要割肉！加杠杆补仓！",
    4: "听我的口令 · 全仓买入",
    5: "你舍不得认亏，对不对？",
    6: "别关屏幕 · 我在看你",
    7: "████ 林渊 · 终身情绪托管室 ████"
  };

  function triggerGlitchFlash(whisperText = "") {
    el.glitchTear.style.top = `${15 + Math.random() * 70}%`;
    el.glitchTear.classList.add("active");
    if (whisperText) {
      el.redWhisper.textContent = whisperText;
      el.redWhisper.classList.add("show");
    }
    setTimeout(() => {
      el.glitchTear.classList.remove("active");
      el.redWhisper.classList.remove("show");
    }, 170);
  }

  function computeStage(p) {
    if (p < 0.16) return 1;
    if (p < 0.30) return 2;
    if (p < 0.45) return 3;
    if (p < 0.64) return 4;
    if (p < 0.78) return 5;
    if (p < 0.91) return 6;
    return 7;
  }

  function updateClockAndHeader() {
    const s = state.stage;
    if (s <= 2) {
      el.headerClock.textContent = formatRealTime();
      el.marketStatusText.textContent = "交易中";
      el.brandName.textContent = "恒盛私享财富";
      el.brandSub.textContent = "HS-VIP 9.2.0 专属投顾交易终端";
      el.accountName.textContent = "林先生 (VIP·4409)";
      el.accountBalHeader.textContent = `可用 ¥${formatMoney(state.cash)}`;
      el.ghostIdxName.textContent = "市场情绪";
      el.ghostIdxVal.textContent = s === 1 ? "68.5 偏暖" : "86.2 躁动";
      el.ghostIdxChg.textContent = s === 1 ? "适度积极" : "踏空焦虑";
      el.ghostIdxVal.className = "idx-val up";
      el.ghostIdxChg.className = "idx-chg up";
    } else if (s === 3) {
      el.headerClock.textContent = Math.random() < 0.3 ? "04:44:44" : formatRealTime();
      el.marketStatusText.textContent = "情绪干预";
      el.brandName.textContent = "恒盛私享财富";
      el.brandSub.textContent = "投顾后台情绪收割模式已激活";
      el.accountName.textContent = "林先生 (心理防线14%)";
      el.accountBalHeader.textContent = "10倍追保预警";
      el.ghostIdxName.textContent = "服从指数";
      el.ghostIdxVal.textContent = "82.4%";
      el.ghostIdxChg.textContent = "即将接管";
      el.ghostIdxVal.className = "idx-val blood-text";
      el.ghostIdxChg.className = "idx-chg blood-text";
    } else if (s === 4) {
      el.headerClock.textContent = "04:44:44";
      el.marketStatusText.textContent = "闭门喊单";
      el.brandName.textContent = "林渊财富教团";
      el.brandSub.textContent = "VIP 情绪共振频道 · 严禁止损";
      el.accountName.textContent = "信徒·4409 (满仓)";
      el.accountBalHeader.textContent = "理性余额: 0.00";
      el.ghostIdxName.textContent = "回本执念";
      el.ghostIdxVal.textContent = "99.98%";
      el.ghostIdxChg.textContent = "彻底沦陷";
    } else {
      el.headerClock.textContent = "04:44:44";
      el.marketStatusText.textContent = "终身绑定";
      el.brandName.textContent = "听 我 的 口 令";
      el.brandSub.textContent = "专属投顾林渊已接管您的屏幕";
      el.accountName.textContent = "你舍不得认输";
      el.accountBalHeader.textContent = "状态：待签收";
    }

    document.querySelectorAll(".nav-item").forEach((a) => {
      a.textContent = s >= 4 ? a.dataset.corrupt : a.dataset.normal;
    });
  }

  function handleStageTransitions(prevStage, nextStage) {
    el.body.dataset.stage = String(nextStage);
    if (!state.climaxTriggered) document.title = STAGE_TITLES[nextStage] || STAGE_TITLES[1];
    updateClockAndHeader();
    updateAudioButtonUI();
    el.body.classList.toggle("climax-header-hidden", nextStage >= 7);

    const isFirstTime = !state.triggeredStages.has(nextStage);
    if (isFirstTime) state.triggeredStages.add(nextStage);

    // Update persistent floating Advisor Dock!
    if (nextStage <= 6) {
      renderAdvisorStage(nextStage, nextStage > prevStage && isFirstTime);
    }

    if (nextStage > prevStage && isFirstTime) {
      if (nextStage === 3) {
        showToast("林顾问紧急提示", "检测到账户剧烈回撤！千万不要割肉，已为您开启 10 倍补仓融资！", "warn", 5200);
      } else if (nextStage === 4) {
        audio.playGlitchBurst(0.5);
        triggerGlitchFlash("满 仓 买 进 去");
        showToast("VIP 闭门喊单已接入", "林渊正在画面里看着您。请同步呼吸，听从全部买入指令。", "horror", 5200);
      } else if (nextStage === 5) {
        audio.playGlitchBurst(0.65);
        triggerGlitchFlash("你 舍 不 得 认 亏");
        showToast("终身情绪托管协议", "您的止损按钮已被林顾问移除，请阅览下方协议条款。", "horror", 5400);
      } else if (nextStage === 6) {
        audio.playGlitchBurst(0.8);
        triggerGlitchFlash("看 着 我 的 眼 睛");
      }
    }

    if (nextStage === 7) {
      el.climaxViewport.classList.add("looming");
    }
  }

  function onScrollUpdate() {
    const scrollMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const y = window.scrollY;
    state.maxScrollPx = Math.max(state.maxScrollPx, y);
    const p = Math.max(0, Math.min(1, y / scrollMax));
    state.scrollP = p;

    const dark = Math.max(0, Math.min(1, (p - 0.24) / 0.42));
    const corrupt = Math.max(0, Math.min(1, (p - 0.18) / 0.52));
    const blood = Math.max(0, Math.min(1, (p - 0.44) / 0.48));

    const root = document.documentElement.style;
    root.setProperty("--p", p.toFixed(4));
    root.setProperty("--dark", dark.toFixed(4));
    root.setProperty("--corrupt", corrupt.toFixed(4));
    root.setProperty("--blood", blood.toFixed(4));

    const nextStage = computeStage(p);
    if (nextStage !== state.stage) {
      const prev = state.stage;
      state.stage = nextStage;
      handleStageTransitions(prev, nextStage);
    }

    audio.updateScroll(p);
    injectDynamicGubaWatcher();

    if (p >= 0.982 && !state.climaxTriggered && !state.climaxAutoTimer) {
      el.climaxViewport.classList.add("looming");
      state.climaxAutoTimer = setTimeout(() => {
        if (state.scrollP >= 0.96 && !state.climaxTriggered) triggerClimaxSequence();
      }, 3000);
    } else if (p < 0.95 && state.climaxAutoTimer) {
      clearTimeout(state.climaxAutoTimer);
      state.climaxAutoTimer = null;
    }
  }

  window.addEventListener("scroll", onScrollUpdate, { passive: true });
  window.addEventListener("resize", () => { drawMainChart(); onScrollUpdate(); });
  window.addEventListener("mousemove", (e) => {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
    document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
    document.documentElement.style.setProperty("--my", `${e.clientY}px`);
  }, { passive: true });

  setInterval(() => {
    document.querySelectorAll(".glitch-num").forEach((node) => {
      if (Math.random() < 0.25) {
        const orig = node.textContent;
        node.textContent = node.dataset.alt || "+444.4%";
        setTimeout(() => { node.textContent = orig; }, 160);
      }
    });
  }, 2400);

  function frame(nowMs) {
    renderBleedChart(nowMs);
    renderCctvCanvas(nowMs);
    renderEyesCanvas(nowMs);
    renderClimaxCanvas(nowMs);
    requestAnimationFrame(frame);
  }

  // Initial boot
  syncActiveStockUI();
  renderAdvisorStage(1, false);
  onScrollUpdate();
  updateClockAndHeader();
  requestAnimationFrame(frame);
})();
