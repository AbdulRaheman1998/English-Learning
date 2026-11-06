/* =========================================================
   Conversation Studio — application
   Vanilla JS, hash router, no build step, works from file://
   ========================================================= */
(function () {
  "use strict";

  const PM = window.PM;
  const Ref = window.PMRef;
  const TTS = window.PMSpeech;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const icon = (name, cls = "") =>
    `<svg class="${cls}" width="16" height="16" aria-hidden="true"><use href="#i-${name}"></use></svg>`;

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const norm = (s) =>
    String(s == null ? "" : s)
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/[.,!?;:—–"“”]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const dayDiff = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

  /* ============================ state ============================ */

  const KEY = "conversation-studio.v1";
  const CHAPTERS = PM.sorted();

  const blankState = () => ({
    v: 1,
    xp: 0,
    streak: 0,
    lastActive: "",
    theme: "light",
    rate: 0.95,
    voice: "",
    lastChapter: 1,
    chapters: {},
    review: {}
  });

  let S = blankState();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") S = Object.assign(blankState(), parsed);
    } catch (_) {}
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
    } catch (_) {}
  }

  function cs(id) {
    id = String(id);
    if (!S.chapters[id]) {
      S.chapters[id] = { dialogue: false, learned: [], practice: { best: 0, total: 0 }, speaking: [], opened: false, done: false };
    }
    const c = S.chapters[id];
    if (!Array.isArray(c.learned)) c.learned = [];
    if (!Array.isArray(c.speaking)) c.speaking = [];
    if (!c.practice) c.practice = { best: 0, total: 0 };
    return c;
  }

  function totalExpressions() {
    return CHAPTERS.reduce((n, c) => n + (c.expressions || []).length, 0);
  }

  function learnedCount() {
    return CHAPTERS.reduce((n, c) => n + cs(c.id).learned.length, 0);
  }

  function chapterProgress(c) {
    const st = cs(c.id);
    const expr = (c.expressions || []).length || 1;
    const ex = (c.exercises || []).length || 1;
    const spk = (c.speaking || []).length || 1;
    const p =
      (st.dialogue ? 15 : 0) +
      Math.min(1, st.learned.length / Math.min(8, expr)) * 40 +
      Math.min(1, (st.practice.best || 0) / ex) * 35 +
      Math.min(1, st.speaking.length / Math.min(3, spk)) * 10;
    return Math.max(0, Math.min(100, Math.round(p)));
  }

  function chaptersDone() {
    return CHAPTERS.filter((c) => chapterProgress(c) >= 80).length;
  }

  function levelInfo() {
    const per = 250;
    const lvl = Math.floor(S.xp / per) + 1;
    const into = S.xp % per;
    return { level: lvl, into, need: per, pct: Math.round((into / per) * 100) };
  }

  function award(points, message) {
    if (!points) return;
    S.xp += points;
    save();
    renderLevelCard();
    if (message) toast(`+${points} XP — ${message}`);
  }

  function touchStreak() {
    const t = today();
    if (S.lastActive === t) return;
    if (!S.lastActive) S.streak = 1;
    else if (dayDiff(S.lastActive, t) === 1) S.streak += 1;
    else if (dayDiff(S.lastActive, t) > 1) S.streak = 1;
    S.lastActive = t;
    save();
  }

  /* ============================ toast / modal ============================ */

  let toastTimer = null;
  function toast(msg) {
    const el = $("#toast");
    el.innerHTML = icon("sparkle") + `<span>${esc(msg)}</span>`;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  function openModal(html) {
    const root = $("#modalRoot");
    root.innerHTML = `<div class="modal-backdrop" data-close="1"><div class="modal" role="dialog" aria-modal="true">${html}</div></div>`;
    const backdrop = $(".modal-backdrop", root);
    backdrop.addEventListener("click", (e) => {
      if (e.target.dataset.close) closeModal();
    });
    return $(".modal", root);
  }

  function closeModal() {
    $("#modalRoot").innerHTML = "";
  }

  function settingsModal() {
    const voices = TTS.voices();
    const body = `
      <h3>Settings</h3>
      <p class="mh">Everything is stored in this browser only.</p>
      <div class="field">
        <label>Appearance</label>
        <div class="seg" id="themeSeg">
          <button data-theme="light" class="${S.theme === "light" ? "on" : ""}">Light</button>
          <button data-theme="dark" class="${S.theme === "dark" ? "on" : ""}">Dark</button>
        </div>
      </div>
      <div class="field">
        <label>Speaking speed <span id="rateVal">${S.rate.toFixed(2)}×</span></label>
        <input type="range" id="rateInput" min="0.6" max="1.3" step="0.05" value="${S.rate}">
      </div>
      <div class="field">
        <label>Voice</label>
        <select id="voiceSel" style="width:100%;padding:10px 12px;border-radius:10px;border:1px solid var(--line);background:var(--surface)">
          <option value="">Automatic</option>
          ${voices.map((v) => `<option value="${esc(v.name)}" ${S.voice === v.name ? "selected" : ""}>${esc(v.name)} (${esc(v.lang)})</option>`).join("")}
        </select>
        ${voices.length ? "" : `<p style="font-size:12px;color:var(--faint);margin-top:8px">No speech voices detected in this browser — audio buttons will be hidden.</p>`}
      </div>
      <div class="modal-actions" style="justify-content:space-between">
        <button class="btn btn-quiet btn-sm" id="resetBtn" style="color:var(--bad)">Reset progress</button>
        <button class="btn btn-primary btn-sm" data-close="1">Done</button>
      </div>`;
    const m = openModal(body);
    $("#themeSeg", m).addEventListener("click", (e) => {
      const b = e.target.closest("button[data-theme]");
      if (!b) return;
      setTheme(b.dataset.theme);
      $$("#themeSeg button", m).forEach((x) => x.classList.toggle("on", x === b));
    });
    $("#rateInput", m).addEventListener("input", (e) => {
      S.rate = Number(e.target.value);
      $("#rateVal", m).textContent = S.rate.toFixed(2) + "×";
      save();
    });
    $("#voiceSel", m).addEventListener("change", (e) => {
      S.voice = e.target.value;
      save();
      TTS.speak("This is how I sound.", { rate: S.rate, voice: S.voice });
    });
    $("#resetBtn", m).addEventListener("click", () => {
      if (!confirm("Erase all XP, streaks and answers? This cannot be undone.")) return;
      S = blankState();
      S.theme = document.documentElement.dataset.theme;
      save();
      closeModal();
      renderLevelCard();
      route();
      toast("Progress reset");
    });
    $("[data-close]", m).addEventListener("click", closeModal);
  }

  /* ============================ theme ============================ */

  function setTheme(t) {
    S.theme = t;
    document.documentElement.dataset.theme = t;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", t === "dark" ? "#12110e" : "#faf6ee");
    $("#themeBtn") && ($("#themeBtn").innerHTML = icon(t === "dark" ? "sun" : "moon"));
    $("#themeBtnMobile") && ($("#themeBtnMobile").innerHTML = icon(t === "dark" ? "sun" : "moon"));
    save();
  }

  /* ============================ shell ============================ */

  const NAV = [
    { href: "#/", match: ["home"], label: "Today", icon: "home" },
    { href: "#/chapters", match: ["chapters", "chapter"], label: "Chapters", icon: "book" },
    { href: "#/review", match: ["review"], label: "Flashcards", icon: "cards" },
    { href: "#/reference", match: ["reference"], label: "Reference", icon: "library" }
  ];

  function renderNav(active) {
    const nav = $("#nav");
    const due = dueCount();
    nav.innerHTML = `
      <div class="nav-label">Study</div>
      ${NAV.map(
        (n) => `<a class="nav-item ${n.match.includes(active) ? "active" : ""}" href="${n.href}">
          ${icon(n.icon)}<span>${n.label}</span>
          ${n.href === "#/review" && due ? `<span class="badge">${due}</span>` : ""}
        </a>`
      ).join("")}
      <div class="nav-label">Extra</div>
      <a class="nav-item ${active === "drill" ? "active" : ""}" href="#/drill">${icon("target")}<span>Random drill</span></a>
    `;
  }

  function renderLevelCard() {
    const l = levelInfo();
    $("#levelCard").innerHTML = `
      <div class="lvl-row"><span>Level <b>${l.level}</b></span><span>${S.xp} XP</span></div>
      <div class="level-bar"><i style="width:${l.pct}%"></i></div>
      <div class="xp-note">${l.need - l.into} XP to level ${l.level + 1}</div>
    `;
  }

  function dueCount() {
    const now = Date.now();
    return PM.allExpressions().filter((e) => {
      const r = S.review[e.key];
      return r ? r.due <= now : false;
    }).length;
  }

  /* ============================ router ============================ */

  let cleanups = [];

  function onCleanup(fn) {
    cleanups.push(fn);
  }

  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, "");
    const parts = raw.split("/").filter(Boolean);
    if (!parts.length) return { name: "home" };
    if (parts[0] === "chapter") return { name: "chapter", id: Number(parts[1]), tab: parts[2] || "dialogue" };
    if (["chapters", "review", "reference", "drill"].includes(parts[0])) return { name: parts[0], tab: parts[1] };
    return { name: "home" };
  }

  function route() {
    const r = parseHash();
    cleanups.forEach((f) => {
      try {
        f();
      } catch (_) {}
    });
    cleanups = [];

    const view = $("#view");
    let html = "";
    let navKey = r.name;

    try {
      switch (r.name) {
        case "chapters":
          html = viewChapters();
          break;
        case "chapter":
          html = viewChapter(r.id, r.tab);
          break;
        case "review":
          html = viewReview();
          break;
        case "reference":
          html = viewReference(r.tab || "verbs");
          break;
        case "drill":
          html = `<div class="practice" id="practiceHost"></div>`;
          break;
        default:
          html = viewHome();
          navKey = "home";
      }
    } catch (err) {
      console.error("View failed to render:", err);
      html = `
        <div class="empty" style="margin-top:40px">
          <div class="e-icon">🧩</div>
          <h3>That view hit a snag</h3>
          <p style="max-width:46ch;margin:8px auto 18px">${esc(err && err.message ? err.message : "Unknown error")}</p>
          <a class="btn btn-primary btn-sm" href="#/">Back to today</a>
        </div>`;
    }

    view.innerHTML = html;
    view.classList.remove("view-enter");
    void view.offsetWidth;
    view.classList.add("view-enter");
    window.scrollTo(0, 0);
    renderNav(navKey);
    $("#sidebar").classList.remove("open");

    try {
      if (r.name === "chapter") wireChapter(r);
      if (r.name === "chapters") wireChapters();
      if (r.name === "review") wireReview();
      if (r.name === "reference") wireReference(r.tab || "verbs");
      if (r.name === "drill") startDrill();
      if (r.name === "home") wireHome();
    } catch (err) {
      console.error("View wiring failed:", err);
      toast("Something went wrong in that view — try reloading.");
    }
  }

  window.addEventListener("hashchange", route);

  /* ============================ home ============================ */

  function greeting() {
    const h = new Date().getHours();
    if (h < 5) return "Still up?";
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }

  function nextChapter() {
    const c = CHAPTERS.find((x) => chapterProgress(x) > 0 && chapterProgress(x) < 80);
    if (c) return c;
    const fresh = CHAPTERS.find((x) => chapterProgress(x) === 0);
    if (fresh) return fresh;
    return CHAPTERS[CHAPTERS.length - 1];
  }

  function viewHome() {
    const c = nextChapter();
    const p = c ? chapterProgress(c) : 0;
    const l = levelInfo();
    const due = dueCount();
    const dateStr = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });

    return `
      <div class="hello">
        <div>
          <h1>${greeting()}.</h1>
          <div class="date">${esc(dateStr)} · ${CHAPTERS.length} chapters · ${totalExpressions()} expressions</div>
        </div>
        <div class="streak-pill">
          <span class="flame">🔥</span>
          <span>${S.streak || 0}-day streak</span>
          <small>${S.streak ? "keep it alive" : "start one today"}</small>
        </div>
      </div>

      <a class="continue-card" href="#/chapter/${c ? c.id : 1}/dialogue">
        <div>
          <span class="eyebrow">${p > 0 ? "Pick up where you left off" : "Start here"}</span>
          <h2>${esc(c ? c.title : "Introducing Yourself and Others")}</h2>
          <p>${esc(c ? c.blurb : "")}</p>
          <div class="cc-progress">
            <div class="cc-track"><i style="width:${p}%"></i></div>
            <span>${p}% complete</span>
          </div>
        </div>
        <div>
          <span class="btn btn-primary btn-lg">${p > 0 ? "Continue" : "Begin"} ${icon("arrow-right")}</span>
        </div>
        <div class="cc-num">${String(c ? c.id : 1).padStart(2, "0")}</div>
      </a>

      <div class="stats">
        <div class="stat"><div class="k">Level</div><div class="v">${l.level}<small> · ${S.xp} XP</small></div></div>
        <div class="stat"><div class="k">Streak</div><div class="v">${S.streak || 0}<small> ${(S.streak || 0) === 1 ? "day" : "days"}</small></div></div>
        <div class="stat"><div class="k">Expressions</div><div class="v">${learnedCount()}<small> / ${totalExpressions()}</small></div></div>
        <div class="stat"><div class="k">Chapters done</div><div class="v">${chaptersDone()}<small> / ${CHAPTERS.length}</small></div></div>
      </div>

      <div class="section-head">
        <h2>Your path</h2>
        <a class="link" href="#/chapters">All chapters →</a>
      </div>
      <div class="path">
        ${CHAPTERS.map((ch) => chapterCard(ch)).join("")}
      </div>

      <div class="section-head"><h2>Jump back in</h2></div>
      <div class="quick">
        <a class="quick-card" href="#/review">
          <div class="qi">🗂️</div>
          <div><b>Flashcards</b><span>${due ? `${due} card${due === 1 ? "" : "s"} due now` : "Review your expressions"}</span></div>
        </a>
        <a class="quick-card" href="#/drill">
          <div class="qi">🎯</div>
          <div><b>Random drill</b><span>10 mixed questions from every chapter</span></div>
        </a>
        <a class="quick-card" href="#/reference">
          <div class="qi">📚</div>
          <div><b>Reference</b><span>Irregular verbs, short answers, glossary</span></div>
        </a>
      </div>
    `;
  }

  function chapterCard(c) {
    const p = chapterProgress(c);
    return `
      <a class="chapter-card ${p >= 80 ? "done" : ""}" href="#/chapter/${c.id}/dialogue">
        <div class="cc-top">
          <span class="num">CH ${String(c.id).padStart(2, "0")}</span>
          <span class="emoji">${c.emoji}</span>
        </div>
        <h3>${esc(c.title)}</h3>
        <div class="sub">${esc(c.subtitle)}</div>
        <div class="cc-foot">
          <div class="track"><i style="width:${p}%"></i></div>
          <span class="pct">${p}%</span>
        </div>
      </a>`;
  }

  function wireHome() {}

  /* ============================ chapters list ============================ */

  function viewChapters() {
    return `
      <div class="page-head">
        <span class="eyebrow">The full course</span>
        <h1>Thirteen conversations</h1>
        <p class="lede">One conversational function per chapter — from introducing yourself to retelling what someone said. Work through them in order, or jump to what you need.</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${CHAPTERS.map((c) => {
          const p = chapterProgress(c);
          const st = cs(c.id);
          return `<a class="quick-card" href="#/chapter/${c.id}/dialogue" style="align-items:center;padding:16px 20px">
            <div class="qi" style="background:var(--paper-2)">${c.emoji}</div>
            <div style="flex:1;min-width:0">
              <b>${String(c.id).padStart(2, "0")} · ${esc(c.title)}</b>
              <span>${esc(c.subtitle)} · ${(c.expressions || []).length} expressions · ${(c.exercises || []).length} exercises${st.practice.best ? ` · best ${st.practice.best}/${st.practice.total}` : ""}</span>
            </div>
            <div style="width:110px;flex:none">
              <div class="track" style="height:5px;background:var(--paper-2);border-radius:99px;overflow:hidden"><i style="display:block;height:100%;width:${p}%;background:${p >= 80 ? "var(--teal)" : "var(--accent)"};border-radius:99px"></i></div>
              <div style="font-size:11px;color:var(--faint);text-align:right;margin-top:4px">${p}%</div>
            </div>
            ${icon("arrow-right", "")}
          </a>`;
        }).join("")}
      </div>`;
  }

  function wireChapters() {}

  /* ============================ chapter ============================ */

  function viewChapter(id, tab) {
    const c = PM.get(id);
    if (!c) {
      return `<div class="empty"><div class="e-icon">🔍</div><h3>Chapter not found</h3><p><a class="link" href="#/chapters">Back to chapters</a></p></div>`;
    }
    const st = cs(c.id);
    S.lastChapter = c.id;
    save();
    st.opened = true;
    save();

    const p = chapterProgress(c);
    const lvl = ["", "beginner", "intermediate", "advanced"][c.level];
    const dash = 2 * Math.PI * 41;

    const tabs = [
      ["dialogue", "Dialogue", (c.conversation.lines || []).length],
      ["expressions", "Expressions", (c.expressions || []).length],
      ["practice", "Practice", (c.exercises || []).length],
      ["speak", "Speak", (c.speaking || []).length]
    ];

    let body = "";
    if (tab === "expressions") body = tabExpressions(c);
    else if (tab === "practice") body = tabPractice(c);
    else if (tab === "speak") body = tabSpeak(c);
    else body = tabDialogue(c);

    return `
      <a class="back-link" href="#/chapters">${icon("arrow-left")} All chapters</a>
      <div class="chapter-hero">
        <div>
          <span class="eyebrow">Chapter ${String(c.id).padStart(2, "0")} · ${esc(c.subtitle)}</span>
          <h1>${esc(c.title)}</h1>
          <p class="blurb">${esc(c.blurb)}</p>
          <div class="meta-row">
            <span class="chip lvl-${c.level}">${lvl}</span>
            <span class="chip">⏱ ${c.minutes} min</span>
            <span class="chip">💬 ${(c.conversation.lines || []).length} lines</span>
            <span class="chip">🗂 ${(c.expressions || []).length} expressions</span>
            <span class="chip">✍️ ${(c.exercises || []).length} exercises</span>
          </div>
        </div>
        <div class="ring-wrap">
          <div class="ring">
            <svg width="96" height="96" viewBox="0 0 96 96">
              <circle class="r-bg" cx="48" cy="48" r="41"></circle>
              <circle class="r-fg" cx="48" cy="48" r="41"
                stroke-dasharray="${dash.toFixed(1)}"
                stroke-dashoffset="${(dash * (1 - p / 100)).toFixed(1)}"></circle>
            </svg>
            <div class="r-txt">${p}%</div>
          </div>
          <small>Complete</small>
        </div>
      </div>

      <div class="tabs" role="tablist">
        ${tabs
          .map(
            ([k, label, n]) =>
              `<a class="tab ${tab === k ? "active" : ""}" role="tab" href="#/chapter/${c.id}/${k}">${label}<span class="count">${n}</span></a>`
          )
          .join("")}
      </div>

      ${body}
    `;
  }

  /* ---------- dialogue ---------- */

  function tabDialogue(c) {
    const st = cs(c.id);
    const cv = c.conversation;
    return `
      <div class="dialogue-setting">
        <span class="ds-icon">🎬</span>
        <div><b>${esc(cv.title)}</b>${esc(cv.setting)}</div>
      </div>

      ${
        (c.objectives || []).length
          ? `<div class="objectives">
              <div class="obj-label">By the end of this chapter you can</div>
              <ul>${c.objectives.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>
            </div>`
          : ""
      }

      <div class="dialogue-tools">
        <button class="btn btn-ghost btn-sm" id="playAll">${icon("volume")} Play the whole conversation</button>
        <button class="btn btn-quiet btn-sm" id="stopPlay" style="display:none">Stop</button>
        <div class="spacer"></div>
        ${
          TTS.available()
            ? `<label class="toggle" id="roleToggle">
                 <input type="checkbox" id="roleCheck"> Hide my side (role-play)
               </label>`
            : ""
        }
      </div>

      <div class="chat" id="chat">
        ${cv.lines
          .map(
            (l, i) => `
          <div class="msg ${i % 2 ? "right" : "left"}" data-i="${i}" data-who="${esc(l.who)}">
            <div class="avatar" aria-hidden="true">${esc((l.who || "?").charAt(0))}</div>
            <div class="bubble-wrap">
              <div class="who">${esc(l.who)}</div>
              <div class="bubble">
                ${esc(l.text)}
                ${l.note ? `<span class="gloss">${esc(l.note)}</span>` : ""}
                ${
                  TTS.available()
                    ? `<button class="speak-btn" data-speak="${i}" title="Listen to this line" aria-label="Listen to this line">${icon("volume")}</button>`
                    : ""
                }
              </div>
            </div>
          </div>`
          )
          .join("")}
      </div>

      <div class="dialogue-end">
        <p>${st.dialogue ? "✓ Read. Listen again any time — shadowing the lines out loud is where the fluency comes from." : "Read it once for meaning, once for rhythm. Then read one side out loud."}</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-ghost btn-sm" id="markRead" ${st.dialogue ? "disabled" : ""}>${st.dialogue ? "Marked as read" : "Mark as read (+15 XP)"}</button>
          <a class="btn btn-primary btn-sm" href="#/chapter/${c.id}/expressions">Next: expressions ${icon("arrow-right")}</a>
        </div>
      </div>
    `;
  }

  function wireChapter(r) {
    const c = PM.get(r.id);
    if (!c) return;

    if (r.tab === "dialogue" || !r.tab) {
      wireDialogue(c);
    } else if (r.tab === "expressions") {
      wireExpressions(c);
    } else if (r.tab === "practice") {
      wirePracticeTab(c);
    } else if (r.tab === "speak") {
      wireSpeak(c);
    }
  }

  function wireDialogue(c) {
    const st = cs(c.id);
    const chat = $("#chat");
    if (!chat) return;
    const lines = c.conversation.lines;
    let playQueue = [];
    let playing = false;

    const setSpeaking = (i) => {
      $$(".msg", chat).forEach((m) => m.classList.toggle("speaking", Number(m.dataset.i) === i));
      if (i >= 0) $$(".msg", chat)[i]?.scrollIntoView({ block: "center", behavior: "smooth" });
    };

    function playFrom(idx) {
      playing = true;
      const stopBtn = $("#stopPlay");
      if (stopBtn) stopBtn.style.display = "";
      const step = (i) => {
        if (!playing || i >= lines.length) {
          playing = false;
          setSpeaking(-1);
          if (stopBtn) stopBtn.style.display = "none";
          return;
        }
        playQueue = [];
        setSpeaking(i);
        TTS.speak(lines[i].text, {
          rate: S.rate,
          voice: S.voice,
          onend: () => setTimeout(() => step(i + 1), 260)
        });
      };
      step(idx);
    }

    $("#playAll")?.addEventListener("click", () => playFrom(0));
    $("#stopPlay")?.addEventListener("click", () => {
      playing = false;
      TTS.stop();
      setSpeaking(-1);
      $("#stopPlay").style.display = "none";
    });

    chat.addEventListener("click", (e) => {
      const s = e.target.closest("[data-speak]");
      if (s) {
        const i = Number(s.dataset.speak);
        setSpeaking(i);
        TTS.speak(lines[i].text, {
          rate: S.rate,
          voice: S.voice,
          onend: () => setTimeout(() => setSpeaking(-1), 300)
        });
        return;
      }
      const hidden = e.target.closest(".msg.hidden-side");
      if (hidden) hidden.classList.remove("hidden-side");
    });

    $("#roleCheck")?.addEventListener("change", (e) => {
      const on = e.target.checked;
      $("#roleToggle")?.classList.toggle("on", on);
      if (!on) {
        $$(".msg", chat).forEach((m) => m.classList.remove("hidden-side"));
        return;
      }
      // hide the second speaker so the learner can play that part
      const second = c.conversation.cast[1];
      $$(".msg", chat).forEach((m) => {
        if (m.dataset.who === second) m.classList.add("hidden-side");
      });
    });

    $("#markRead")?.addEventListener("click", (e) => {
      if (!st.dialogue) {
        st.dialogue = true;
        award(15, "Dialogue read");
        e.currentTarget.textContent = "Marked as read";
        e.currentTarget.disabled = true;
        maybeCelebrate(c);
      }
    });

    onCleanup(() => {
      playing = false;
      TTS.stop();
    });
  }

  /* ---------- expressions ---------- */

  function tabExpressions(c) {
    const st = cs(c.id);
    const total = (c.expressions || []).length;
    return `
      <div class="section-head" style="margin-top:0">
        <div>
          <h2>Key expressions</h2>
          <p style="margin:6px 0 0;font-size:13.5px;color:var(--muted)">
            Tap a card to open the meaning, examples and a usage tip.
            <b style="color:var(--teal)">${st.learned.length} of ${total}</b> marked as known.
          </p>
        </div>
        <button class="btn btn-ghost btn-sm" id="expandAll">Expand all</button>
      </div>

      <div class="expr-grid" id="exprGrid">
        ${(c.expressions || [])
          .map(
            (e, i) => `
          <article class="expr ${st.learned.includes(e.term) ? "known" : ""}" data-i="${i}">
            <header class="expr-head" data-toggle="1">
              <div class="et">
                <div class="term">${esc(e.term)}</div>
                ${e.ipa ? `<div class="ipa">${esc(e.ipa)}</div>` : ""}
              </div>
              ${TTS.available() ? `<button class="speak-btn" data-say="${i}" style="position:static;opacity:1;width:30px;height:30px" title="Listen" aria-label="Listen">${icon("volume")}</button>` : ""}
              <svg class="chev">${'<use href="#i-chevron-down"></use>'}</svg>
            </header>
            <div class="expr-body"><div><div class="inner">
              ${e.meaning ? `<p class="meaning">${esc(e.meaning)}</p>` : ""}
              ${e.usage ? `<p class="usage">${esc(e.usage)}</p>` : ""}
              <ul class="examples">${(e.examples || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
              ${e.tip ? `<div class="tip"><span>💡</span><div><b>Tip.</b> ${esc(e.tip)}</div></div>` : ""}
              <div class="expr-actions">
                <button class="known-btn ${st.learned.includes(e.term) ? "on" : ""}" data-known="${i}">
                  ${icon("check")} <span>${st.learned.includes(e.term) ? "Known" : "I know this"}</span>
                </button>
              </div>
            </div></div></div>
          </article>`
          )
          .join("")}
      </div>

      <div class="section-head" style="margin-top:34px"><h2>How it works</h2></div>
      ${(c.structures || []).map(structureBlock).join("")}

      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:30px;gap:12px;flex-wrap:wrap">
        <a class="btn btn-quiet btn-sm" href="#/chapter/${c.id}/dialogue">${icon("arrow-left")} Back to the dialogue</a>
        <a class="btn btn-primary" href="#/chapter/${c.id}/practice">Practise this chapter ${icon("arrow-right")}</a>
      </div>
    `;
  }

  function structureBlock(s) {
    return `
      <div class="struct">
        <h3>${esc(s.title)}</h3>
        <p class="body">${esc(s.body)}</p>
        ${
          s.table
            ? `<div class="tbl-wrap"><table class="tbl">
                <thead><tr>${s.table.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
                <tbody>${s.table.rows.map((r) => `<tr>${r.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
              </table></div>`
            : ""
        }
        ${(s.examples || []).length ? `<div class="exs">${s.examples.map((x) => `<div>${esc(x)}</div>`).join("")}</div>` : ""}
      </div>`;
  }

  function wireExpressions(c) {
    const grid = $("#exprGrid");
    if (!grid) return;
    const st = cs(c.id);

    grid.addEventListener("click", (e) => {
      const say = e.target.closest("[data-say]");
      if (say) {
        e.stopPropagation();
        const ex = c.expressions[Number(say.dataset.say)];
        TTS.speak(ex.term + ". " + (ex.examples?.[0] || ""), { rate: S.rate, voice: S.voice });
        return;
      }
      const known = e.target.closest("[data-known]");
      if (known) {
        e.stopPropagation();
        const i = Number(known.dataset.known);
        const term = c.expressions[i].term;
        const set = new Set(st.learned);
        if (set.has(term)) {
          set.delete(term);
        } else {
          set.add(term);
          award(5, "Expression learned");
        }
        st.learned = Array.from(set);
        const card = known.closest(".expr");
        card.classList.toggle("known", st.learned.includes(term));
        known.classList.toggle("on", st.learned.includes(term));
        known.querySelector("span").textContent = st.learned.includes(term) ? "Known" : "I know this";
        // also seed the review deck
        const key = c.id + ":" + i;
        if (st.learned.includes(term) && !S.review[key]) {
          S.review[key] = { level: 1, due: Date.now() + 86400000, seen: 1 };
        }
        save();
        maybeCelebrate(c);
        return;
      }
      const head = e.target.closest("[data-toggle]");
      if (head) {
        const card = head.closest(".expr");
        card.classList.toggle("open");
      }
    });

    $("#expandAll")?.addEventListener("click", (e) => {
      const cards = $$(".expr", grid);
      const allOpen = cards.every((x) => x.classList.contains("open"));
      cards.forEach((x) => x.classList.toggle("open", !allOpen));
      e.currentTarget.textContent = allOpen ? "Expand all" : "Collapse all";
    });
  }

  /* ---------- practice tab ---------- */

  function tabPractice(c) {
    const st = cs(c.id);
    const total = (c.exercises || []).length;
    return `
      <div id="practiceHost">
        <div class="q-card" style="text-align:center;padding:44px 32px">
          <div style="font-size:34px;margin-bottom:10px">✍️</div>
          <h2 style="margin-bottom:8px">${total} questions on ${esc(c.title)}</h2>
          <p style="color:var(--muted);max-width:48ch;margin:0 auto 8px">
            Multiple choice, short answers, matching and sentence building — all in the order they appear in the chapter.
            ${st.practice.total ? `Your best so far: <b>${st.practice.best} / ${st.practice.total}</b>.` : ""}
          </p>
          <div style="display:flex;gap:10px;justify-content:center;margin-top:22px;flex-wrap:wrap">
            <button class="btn btn-primary btn-lg" id="startPractice">${st.practice.total ? "Practise again" : "Start practice"}</button>
            <a class="btn btn-ghost btn-lg" href="#/chapter/${c.id}/expressions">Review the expressions first</a>
          </div>
        </div>
      </div>
    `;
  }

  function wirePracticeTab(c) {
    $("#startPractice")?.addEventListener("click", () => {
      runPractice($("#practiceHost"), c.exercises, {
        title: c.title,
        chapterId: c.id,
        onFinish: (res) => {
          const st = cs(c.id);
          if (res.correct > st.practice.best || st.practice.total !== res.total) {
            st.practice.best = Math.max(st.practice.best, res.correct);
            st.practice.total = res.total;
          }
          save();
          maybeCelebrate(c);
        }
      });
    });
  }

  /* ---------- speak tab ---------- */

  function tabSpeak(c) {
    const st = cs(c.id);
    return `
      <div class="page-head" style="margin-bottom:20px">
        <h2 style="font-size:22px">Say it out loud</h2>
        <p class="lede" style="font-size:14.5px;margin-top:6px">Prepare an answer, say it aloud, then compare with the model. Speaking is a muscle — two minutes here beats an hour of reading.</p>
      </div>
      <div id="speakList">
      ${(c.speaking || [])
        .map(
          (s, i) => `
        <div class="speak-card ${st.speaking.includes(i) ? "revealed" : ""}" data-i="${i}">
          <div class="sp-num">Prompt ${i + 1}${st.speaking.includes(i) ? " · done" : ""}</div>
          <div class="sp-prompt">${esc(s.prompt)}</div>
          <div class="model">${esc(s.model)}</div>
          <div class="speak-actions">
            <button class="btn btn-ghost btn-sm" data-reveal="${i}">Show model answer</button>
            ${TTS.available() ? `<button class="btn btn-quiet btn-sm" data-listen="${i}">${icon("volume")} Listen</button>` : ""}
            <button class="btn btn-quiet btn-sm" data-done="${i}">${st.speaking.includes(i) ? "✓ Done" : "Mark as done"}</button>
          </div>
        </div>`
        )
        .join("")}
      </div>
      <div id="speakDone"></div>
      <div style="display:flex;justify-content:space-between;margin-top:26px;gap:12px;flex-wrap:wrap">
        <a class="btn btn-quiet btn-sm" href="#/chapter/${c.id}/practice">${icon("arrow-left")} Practice</a>
        ${
          c.id < CHAPTERS.length
            ? `<a class="btn btn-primary" href="#/chapter/${c.id + 1}/dialogue">Next chapter ${icon("arrow-right")}</a>`
            : `<a class="btn btn-primary" href="#/">Back to today ${icon("arrow-right")}</a>`
        }
      </div>
    `;
  }

  function wireSpeak(c) {
    const st = cs(c.id);
    const host = $("#speakList");
    if (!host) return;
    const onClick = (e) => {
      const rev = e.target.closest("[data-reveal]");
      if (rev) {
        const card = rev.closest(".speak-card");
        const open = card.classList.toggle("revealed");
        rev.textContent = open ? "Hide model answer" : "Show model answer";
        return;
      }
      const listen = e.target.closest("[data-listen]");
      if (listen) {
        const i = Number(listen.dataset.listen);
        TTS.speak(c.speaking[i].model, { rate: S.rate, voice: S.voice });
        return;
      }
      const done = e.target.closest("[data-done]");
      if (done) {
        const i = Number(done.dataset.done);
        const set = new Set(st.speaking);
        if (set.has(i)) set.delete(i);
        else {
          set.add(i);
          award(10, "Speaking prompt done");
        }
        st.speaking = Array.from(set);
        save();
        done.textContent = st.speaking.includes(i) ? "✓ Done" : "Mark as done";
        done.closest(".sp-num").textContent = `Prompt ${i + 1}${st.speaking.includes(i) ? " · done" : ""}`;
        maybeCelebrate(c);
      }
    };
    host.addEventListener("click", onClick);
    onCleanup(() => host.removeEventListener("click", onClick));
  }

  /* ---------- celebration ---------- */

  function maybeCelebrate(c) {
    if (chapterProgress(c) >= 80 && !cs(c.id).done) {
      cs(c.id).done = true;
      save();
      award(25, "Chapter complete");
      confetti();
      toast(`Chapter ${c.id} complete — nicely done.`);
    }
  }

  function confetti() {
    const layer = $("#confettiLayer");
    const colors = ["#c4502b", "#b58a2f", "#1d6a58", "#e0724c", "#d9b168"];
    for (let i = 0; i < 40; i++) {
      const d = document.createElement("i");
      d.className = "confetti";
      d.style.left = Math.random() * 100 + "%";
      d.style.background = colors[i % colors.length];
      d.style.animationDuration = 2.4 + Math.random() * 1.6 + "s";
      d.style.animationDelay = Math.random() * 0.5 + "s";
      d.style.opacity = 0.8;
      layer.appendChild(d);
      setTimeout(() => d.remove(), 4600);
    }
  }

  /* ============================ practice engine ============================ */

  function runPractice(host, items, opts = {}) {
    let idx = 0;
    let correct = 0;
    let answered = 0;
    const missed = [];
    let current = null;
    let keyHandler = null;
    let finished = false;

    const total = items.length;

    function shell(inner) {
      host.innerHTML = `
        <div class="practice">
          <div class="practice-top">
            <div class="practice-progress"><i style="width:${(idx / total) * 100}%"></i></div>
            <div class="pt-label">${Math.min(idx + 1, total)} / ${total}</div>
            <div class="score-live">${icon("check")} ${correct}</div>
          </div>
          <div id="qHolder">${inner}</div>
        </div>`;
    }

    function finish() {
      finished = true;
      if (keyHandler) document.removeEventListener("keydown", keyHandler);
      const pct = total ? Math.round((correct / total) * 100) : 0;
      const xp = correct * 5 + (pct >= 80 ? 15 : 0);
      award(xp, "practice");
      host.innerHTML = `
        <div class="practice">
          <div class="result-card">
            <div class="score-big">${correct}<small> / ${total}</small></div>
            <h2>${pct === 100 ? "Perfect round." : pct >= 80 ? "Strong work." : pct >= 50 ? "Getting there." : "Worth another pass."}</h2>
            <p>${pct >= 80 ? "You can move on — or replay for a faster, cleaner run." : "Read the explanations below, then try the round again. Repetition is the whole method."}</p>
            <div class="result-stats">
              <div><div class="rv">${pct}%</div><div class="rk">Accuracy</div></div>
              <div><div class="rv">+${xp}</div><div class="rk">XP earned</div></div>
              <div><div class="rv">${missed.length}</div><div class="rk">To review</div></div>
            </div>
            <div class="result-actions">
              <button class="btn btn-primary" data-retry="1">Try again</button>
              ${
                opts.chapterId
                  ? `<a class="btn btn-ghost" href="#/chapter/${opts.chapterId}/speak">Go to speaking</a>
                     <a class="btn btn-quiet" href="#/chapters">Exit</a>`
                  : `<a class="btn btn-quiet" href="#/">Back home</a>`
              }
            </div>
            ${
              missed.length
                ? `<div class="missed"><h3>What to look at again</h3>${missed
                    .map((m) => `<div class="missed-item"><div class="q">${esc(m.q)}</div><div class="a">${esc(m.a)}</div></div>`)
                    .join("")}</div>`
                : ""
            }
          </div>
        </div>`;
      $("[data-retry]", host)?.addEventListener("click", () => {
        idx = 0;
        correct = 0;
        answered = 0;
        missed.length = 0;
        finished = false;
        start();
      });
      opts.onFinish?.({ correct, total, missed });
    }

    function kindLabel(k) {
      return { choice: "Choose the answer", fill: "Type the answer", match: "Match the pairs", order: "Build the sentence" }[k] || "Question";
    }

    function answerText(q) {
      if (q.kind === "choice") return q.options[q.answer];
      if (q.kind === "match") return q.pairs.map((p) => `${p[0]} → ${p[1]}`).join(" · ");
      return q.answer;
    }

    function advance() {
      idx++;
      if (idx >= total) finish();
      else start();
    }

    function start() {
      const q = items[idx];
      current = q;
      let localDone = false;
      let mistakeThisQ = false;
      const prevHandler = keyHandler;

      const qText = q.kind === "fill" ? esc(q.q).replace("___", '<span class="blank">…</span>') : esc(q.q);

      shell(`
        <div class="q-card" id="qCard">
          <div class="q-kind">${icon("target")} ${kindLabel(q.kind)}</div>
          <div class="q-text">${qText}</div>
          <div id="qBody"></div>
          <div id="fbSlot" aria-live="polite"></div>
          <div class="practice-foot">
            <div class="left">${idx + 1} of ${total}</div>
            <div style="display:flex;gap:8px">
              <button class="btn btn-quiet btn-sm" id="skipBtn">Skip</button>
              <button class="btn btn-primary" id="mainBtn" disabled>Check</button>
            </div>
          </div>
        </div>
      `);

      const body = $("#qBody");
      const mainBtn = $("#mainBtn");
      const skipBtn = $("#skipBtn");

      const finishQ = (ok, opts2 = {}) => {
        if (localDone) return;
        localDone = true;
        mainBtn.disabled = false;
        mainBtn.textContent = idx + 1 >= total ? "See results" : "Next";
        skipBtn.style.display = "none";

        answered++;
        if (ok) {
          correct++;
          if (!mistakeThisQ) {
            // first-try credit already counted
          }
        } else {
          if (!mistakeThisQ) {
            mistakeThisQ = true;
            missed.push({ q: q.q || q.prompt, a: answerText(q) });
          }
        }

        $("#fbSlot").innerHTML = `
          <div class="feedback ${ok ? "good" : "bad"}">
            <span class="fb-icon">${ok ? "✅" : "❌"}</span>
            <div>
              <b>${ok ? "Correct" : "Not quite"}</b>
              ${ok ? "" : `<div style="margin:2px 0 4px">Answer: <span class="ans">${esc(answerText(q))}</span></div>`}
              <div>${esc(q.why || "")}</div>
            </div>
          </div>`;
        $$(".practice-top .score-live")[0].innerHTML = icon("check") + " " + correct;
        $$(".practice-progress i")[0].style.width = ((idx + 1) / total) * 100 + "%";

        mainBtn.onclick = () => advance();
        mainBtn.focus({ preventScroll: true });
      };

      /* ---------- choice ---------- */
      if (q.kind === "choice") {
        body.innerHTML = `<div class="options">${q.options
          .map((o, i) => `<button class="opt" data-opt="${i}"><span class="key">${"ABCDE"[i]}</span><span>${esc(o)}</span></button>`)
          .join("")}</div>`;
        let picked = -1;
        body.addEventListener("click", (e) => {
          const b = e.target.closest("[data-opt]");
          if (!b || localDone) return;
          picked = Number(b.dataset.opt);
          $$(".opt", body).forEach((x) => x.classList.toggle("selected", x === b));
          mainBtn.disabled = false;
        });
        mainBtn.disabled = true;
        mainBtn.onclick = () => {
          if (picked < 0) return;
          const ok = picked === q.answer;
          $$(".opt", body).forEach((b, i) => {
            b.disabled = true;
            b.classList.remove("selected");
            if (i === q.answer) b.classList.add("correct");
            else if (i === picked) b.classList.add("wrong");
            else b.classList.add("dim");
          });
          finishQ(ok);
        };
        keyHandler = (e) => {
          if (localDone) {
            if (e.key === "Enter") {
              e.preventDefault();
              advance();
            }
            return;
          }
          const n = Number(e.key);
          if (n >= 1 && n <= q.options.length) {
            const b = $$(".opt", body)[n - 1];
            b?.click();
          }
          if (e.key === "Enter" && picked >= 0) {
            e.preventDefault();
            mainBtn.click();
          }
        };
      }

      /* ---------- fill ---------- */
      if (q.kind === "fill") {
        body.innerHTML = `
          <div class="fill-form">
            <input class="fill-input" id="fillInput" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type your answer…" aria-label="Your answer">
          </div>
          ${q.hint ? `<div class="hint-line">Hint: ${esc(q.hint)}</div>` : ""}`;
        const input = $("#fillInput", body);
        input.addEventListener("input", () => {
          mainBtn.disabled = !input.value.trim();
        });
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter" && !mainBtn.disabled) {
            e.preventDefault();
            mainBtn.click();
          }
        });
        setTimeout(() => input.focus({ preventScroll: true }), 60);
        mainBtn.onclick = () => {
          const val = input.value;
          const ok = (q.accept || [q.answer]).some((a) => norm(a) === norm(val));
          input.disabled = true;
          input.classList.add(ok ? "correct" : "wrong");
          finishQ(ok);
        };
      }

      /* ---------- match ---------- */
      if (q.kind === "match") {
        const lefts = q.pairs.map((p) => p[0]);
        const rights = shuffle(q.pairs.map((p) => p[1]));
        let sel = null;
        const matched = new Set();
        let mistakes = 0;
        body.innerHTML = `
          <div class="match-board">
            <div class="match-col" id="colL">${lefts
              .map((l, i) => `<button class="match-item" data-side="L" data-i="${i}">${esc(l)}</button>`)
              .join("")}</div>
            <div class="match-col" id="colR">${rights
              .map((r, i) => `<button class="match-item" data-side="R" data-i="${i}">${esc(r)}</button>`)
              .join("")}</div>
          </div>`;
        mainBtn.disabled = true;
        mainBtn.textContent = "Match all five";
        mainBtn.onclick = () => {};
        body.addEventListener("click", (e) => {
          const b = e.target.closest(".match-item");
          if (!b || localDone || b.classList.contains("done")) return;
          if (b.dataset.side === "L") {
            $$('[data-side="L"]', body).forEach((x) => x.classList.remove("sel"));
            b.classList.add("sel");
            sel = Number(b.dataset.i);
            return;
          }
          if (sel == null) {
            b.classList.add("err");
            setTimeout(() => b.classList.remove("err"), 400);
            return;
          }
          const leftText = lefts[sel];
          const rightText = b.textContent;
          const pair = q.pairs.find((p) => p[0] === leftText);
          if (pair && pair[1] === rightText) {
            matched.add(sel);
            $$('[data-side="L"]', body).forEach((x) => {
              if (Number(x.dataset.i) === sel) x.classList.add("done");
              x.classList.remove("sel");
            });
            b.classList.add("done");
            sel = null;
            if (matched.size === lefts.length) {
              mainBtn.disabled = false;
              mainBtn.textContent = "Continue";
              mainBtn.onclick = () => finishQ(mistakes === 0);
              setTimeout(() => mainBtn.click(), 420);
            }
          } else {
            mistakes++;
            b.classList.add("err");
            const l = $(`[data-side="L"][data-i="${sel}"]`, body);
            l?.classList.add("err");
            setTimeout(() => {
              b.classList.remove("err");
              l?.classList.remove("err");
            }, 450);
            sel = null;
            $$('[data-side="L"]', body).forEach((x) => x.classList.remove("sel"));
          }
        });
      }

      /* ---------- order ---------- */
      if (q.kind === "order") {
        const words = q.words;
        let placed = [];
        const render = () => {
          const poolEl = $("#orderPool", body);
          const ansEl = $("#orderAns", body);
          if (!poolEl || !ansEl) return;
          ansEl.innerHTML = placed
            .map((w, k) => `<button class="word" data-placed="${k}">${esc(words[w])}</button>`)
            .join("");
          poolEl.innerHTML = words
            .map((w, k) => (placed.includes(k) ? "" : `<button class="word" data-pool="${k}">${esc(w)}</button>`))
            .join("");
          mainBtn.disabled = placed.length === 0;
        };
        body.innerHTML = `
          <div class="order-answer" id="orderAns"></div>
          <div class="order-pool" id="orderPool"></div>`;
        body.addEventListener("click", (e) => {
          const b = e.target.closest("[data-pool],[data-placed]");
          if (!b || localDone) return;
          if (b.dataset.pool != null) placed.push(Number(b.dataset.pool));
          else placed.splice(Number(b.dataset.placed), 1);
          render();
        });
        mainBtn.onclick = () => {
          const val = placed.map((i) => words[i]).join(" ");
          const ok = norm(val) === norm(q.answer);
          if (!ok) {
            const box = $("#orderAns", body);
            box.innerHTML = `<div style="font-size:13px;color:var(--bad);width:100%">${esc(q.answer)}</div>`;
          }
          finishQ(ok);
        };
        render();
      }

      skipBtn.addEventListener("click", () => {
        if (localDone) return;
        if (q.kind === "choice") {
          $$(".opt", body).forEach((b, i) => {
            b.disabled = true;
            if (i === q.answer) b.classList.add("correct");
            else b.classList.add("dim");
          });
        }
        if (q.kind === "fill") {
          const inp = $("#fillInput", body);
          if (inp) {
            inp.disabled = true;
            inp.value = q.answer;
          }
        }
        if (q.kind === "match") {
          $$(".match-item", body).forEach((b) => b.classList.add("done"));
        }
        if (q.kind === "order") {
          const box = $("#orderAns", body);
          if (box) box.innerHTML = `<div style="font-size:13.5px;color:var(--good);width:100%">${esc(q.answer)}</div>`;
        }
        finishQ(false);
      });

      if (prevHandler) document.removeEventListener("keydown", prevHandler);
      if (q.kind === "choice" && keyHandler) document.addEventListener("keydown", keyHandler);
    }

    start();

    onCleanup(() => {
      if (keyHandler) document.removeEventListener("keydown", keyHandler);
      TTS.stop();
    });
  }

  /* ============================ drill ============================ */

  function startDrill() {
    const all = [];
    CHAPTERS.forEach((c) => (c.exercises || []).forEach((e) => all.push(e)));
    const host = $("#practiceHost");
    if (!all.length) {
      host.innerHTML = `<div class="empty"><div class="e-icon">🎯</div><h3>No exercises loaded yet</h3></div>`;
      return;
    }
    host.innerHTML = `
      <div class="page-head" style="margin-bottom:18px">
        <div><a class="back-link" href="#/">${icon("arrow-left")} Today</a></div>
        <span class="eyebrow">Mixed practice</span>
        <h1 style="margin-top:8px">Ten questions, any chapter</h1>
        <p class="lede">A quick accuracy check across the whole course. Nothing is scored against you — it just tells you what to revisit.</p>
      </div>
      <div id="drillHost"></div>`;
    const pick = shuffle(all).slice(0, 10);
    runPractice($("#drillHost"), pick, { title: "Random drill" });
  }

  /* ============================ review ============================ */

  function buildDeck() {
    const all = PM.allExpressions();
    const now = Date.now();
    const scored = all.map((e) => {
      const r = S.review[e.key];
      const level = r ? r.level : 0;
      const due = r ? r.due : 0;
      return { e, level, due, isDue: !r || due <= now };
    });
    const dueCards = scored.filter((x) => x.isDue).sort((a, b) => a.level - b.level);
    if (dueCards.length) return dueCards.slice(0, 12);
    return scored.sort((a, b) => a.level - b.level).slice(0, 12);
  }

  function viewReview() {
    return `
      <div class="page-head">
        <span class="eyebrow">Spaced review</span>
        <h1>Flashcards</h1>
        <p class="lede">Twelve cards, picked by what your memory needs next. Tap to flip, then be honest about how it felt.</p>
      </div>
      <div class="flash-stage" id="flashStage"></div>`;
  }

  function wireReview() {
    const stage = $("#flashStage");
    if (!stage) return;
    let deck = buildDeck();
    let pos = 0;
    let flipped = false;
    const tally = { again: 0, good: 0, easy: 0 };

    if (!deck.length) {
      stage.innerHTML = `<div class="empty"><div class="e-icon">🗂️</div><h3>No cards yet</h3><p>Mark a few expressions as known in any chapter and they will appear here.</p><a class="btn btn-primary btn-sm" href="#/chapters" style="margin-top:14px">Open a chapter</a></div>`;
      return;
    }

    function renderCard() {
      if (pos >= deck.length) return summary();
      const { e } = deck[pos];
      const r = S.review[e.key] || { level: 0 };
      stage.innerHTML = `
        <div class="practice-top" style="margin-bottom:18px">
          <div class="practice-progress"><i style="width:${(pos / deck.length) * 100}%"></i></div>
          <div class="pt-label">${pos + 1} / ${deck.length}</div>
        </div>
        <div class="flash" id="flash" tabindex="0">
          <div class="flash-inner">
            <div class="flash-face front">
              <div class="f-eyebrow">Chapter ${e.chapterId} · level ${r.level}</div>
              <div class="f-term">${esc(e.term)}</div>
              ${e.ipa ? `<div class="f-ipa">${esc(e.ipa)}</div>` : ""}
              <div class="f-hint">Tap the card to see the meaning</div>
            </div>
            <div class="flash-face back">
              <div class="f-eyebrow">Meaning</div>
              <div class="f-meaning">${esc(e.meaning)}</div>
              ${(e.examples || []).slice(0, 2).map((x) => `<div class="f-ex">${esc(x)}</div>`).join("")}
            </div>
          </div>
        </div>
        <div class="review-controls" id="revControls" style="visibility:hidden">
          <button class="btn btn-again" data-g="again">Again</button>
          <button class="btn btn-good" data-g="good">Good</button>
          <button class="btn btn-easy" data-g="easy">Easy</button>
        </div>
        <p class="rev-hint">Tap the card to flip it, then rate how well you knew it.</p>`;
      flipped = false;
      const card = $("#flash", stage);
      card.addEventListener("click", () => {
        flipped = !flipped;
        card.classList.toggle("flipped", flipped);
        $("#revControls").style.visibility = "visible";
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          card.click();
        }
      });
      $("#revControls", stage).addEventListener("click", (e) => {
        const b = e.target.closest("[data-g]");
        if (!b) return;
        grade(b.dataset.g);
      });
    }

    function grade(g) {
      const { e } = deck[pos];
      const cur = S.review[e.key] || { level: 0, seen: 0 };
      const now = Date.now();
      const day = 86400000;
      let next;
      if (g === "again") {
        next = { level: 0, due: now + 0.25 * day, seen: (cur.seen || 0) + 1 };
        tally.again++;
      } else if (g === "good") {
        const lv = Math.min(5, (cur.level || 0) + 1);
        next = { level: lv, due: now + lv * day, seen: (cur.seen || 0) + 1 };
        tally.good++;
      } else {
        const lv = Math.min(5, (cur.level || 0) + 2);
        next = { level: lv, due: now + lv * 2 * day, seen: (cur.seen || 0) + 1 };
        tally.easy++;
      }
      S.review[e.key] = next;
      save();
      award(g === "again" ? 1 : 3, "card reviewed");
      pos++;
      renderCard();
    }

    function summary() {
      const xp = tally.again + tally.good * 3 + tally.easy * 3;
      stage.innerHTML = `
        <div class="result-card">
          <div class="score-big">${tally.good + tally.easy}<small> / ${deck.length}</small></div>
          <h2>Session done</h2>
          <p>The cards you rated "Again" will come back sooner. That is the system working, not failing.</p>
          <div class="result-stats">
            <div><div class="rv">${tally.again}</div><div class="rk">Again</div></div>
            <div><div class="rv">${tally.good}</div><div class="rk">Good</div></div>
            <div><div class="rv">${tally.easy}</div><div class="rk">Easy</div></div>
          </div>
          <div class="result-actions">
            <button class="btn btn-primary" id="moreCards">Another twelve</button>
            <a class="btn btn-ghost" href="#/">Back home</a>
          </div>
        </div>`;
      $("#moreCards").addEventListener("click", () => {
        deck = buildDeck();
        pos = 0;
        tally.again = tally.good = tally.easy = 0;
        renderCard();
      });
    }

    renderCard();

    onCleanup(() => {
      document.onkeydown = null;
    });
  }

  /* ============================ reference ============================ */

  function viewReference(tab) {
    const tabs = [
      ["verbs", "Irregular verbs"],
      ["answers", "Short answers"],
      ["glossary", "Glossary"]
    ];
    return `
      <div class="page-head">
        <span class="eyebrow">Reference</span>
        <h1>The back of the book</h1>
        <p class="lede">Irregular verb forms, the full short-answer system, and every expression in the course in one searchable list.</p>
      </div>
      <div class="tabs" style="margin-top:0">
        ${tabs.map(([k, l]) => `<a class="tab ${tab === k ? "active" : ""}" href="#/reference/${k}">${l}</a>`).join("")}
      </div>
      <div id="refBody"></div>`;
  }

  function wireReference(tab) {
    const body = $("#refBody");
    if (!body) return;
    if (tab === "answers") return renderAnswers(body);
    if (tab === "glossary") return renderGlossary(body);
    return renderVerbs(body);
  }

  function renderVerbs(body) {
    body.innerHTML = `
      <div class="search-bar">${icon("search")}<input id="verbSearch" placeholder="Search a verb or a form…" autocomplete="off"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
        <span style="font-size:13px;color:var(--muted)" id="verbCount">${Ref.verbs.length} verbs</span>
        <label class="toggle" id="hideToggle"><input type="checkbox" id="hideForms"> Hide forms — test yourself</label>
      </div>
      <div style="overflow-x:auto;border:1px solid var(--line);border-radius:var(--radius-lg);background:var(--surface)">
        <table class="tbl" id="verbTable" style="min-width:520px">
          <thead><tr><th>Base form</th><th>Past</th><th>Past participle</th></tr></thead>
          <tbody>
            ${Ref.verbs
              .map(
                ([b, p, pp]) =>
                  `<tr class="verb-row" data-search="${esc((b + " " + p + " " + pp).toLowerCase())}"><td>${esc(b)}</td><td><span class="pf">${esc(p)}</span></td><td><span class="pf">${esc(pp)}</span></td></tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>`;
    const search = $("#verbSearch", body);
    const rows = $$(".verb-row", body);
    search.addEventListener("input", () => {
      const q = search.value.trim().toLowerCase();
      let n = 0;
      rows.forEach((r) => {
        const ok = !q || r.dataset.search.includes(q);
        r.style.display = ok ? "" : "none";
        if (ok) n++;
      });
      $("#verbCount").textContent = `${n} verb${n === 1 ? "" : "s"}`;
    });
    $("#hideForms", body).addEventListener("change", (e) => {
      const hide = e.target.checked;
      $("#hideToggle").classList.toggle("on", hide);
      $$(".pf", body).forEach((s) => s.classList.toggle("blurred", hide));
      $$(".verb-row", body).forEach((tr) =>
        tr.classList.toggle("hide", hide)
      );
    });
    body.addEventListener("click", (e) => {
      const tr = e.target.closest(".verb-row");
      if (!tr) return;
      $$(".pf", tr).forEach((s) => s.classList.toggle("blurred"));
    });
  }

  function renderAnswers(body) {
    body.innerHTML = `
      <p style="font-size:14px;color:var(--muted);max-width:66ch">
        A short answer repeats the auxiliary of the question — never just "yes" or "no". Negative answers are contracted in speech.
        Use <b>Yes, I do</b> (not "Yes, I like") and never repeat the main verb.
      </p>
      ${Ref.tagGroups
        .map(
          (g) => `
        <div class="struct">
          <h3>${esc(g.group)}</h3>
          <p class="body">${esc(g.note)}</p>
          <div class="tbl-wrap"><table class="tbl">
            <thead><tr><th>Question</th><th>Yes</th><th>No</th></tr></thead>
            <tbody>${g.rows
              .map((r) => `<tr><td>${esc(r[0])}</td><td style="color:var(--good)">${esc(r[1])}</td><td style="color:var(--bad)">${esc(r[2])}</td></tr>`)
              .join("")}</tbody>
          </table></div>
        </div>`
        )
        .join("")}`;
  }

  function renderGlossary(body) {
    const letterOf = (term) => {
      const t = String(term).replace(/^[([{]\s*/, "").trim();
      const ch = t.charAt(0).toUpperCase();
      return /[A-Z]/.test(ch) ? ch : "#";
    };
    const all = PM.allExpressions().sort((a, b) => {
      const la = letterOf(a.term);
      const lb = letterOf(b.term);
      if (la !== lb) return la < lb ? -1 : 1;
      return a.term.toLowerCase().localeCompare(b.term.toLowerCase());
    });
    body.innerHTML = `
      <div class="search-bar">${icon("search")}<input id="glossSearch" placeholder="Search ${all.length} expressions…" autocomplete="off"></div>
      <div id="glossList"></div>`;
    const list = $("#glossList", body);
    const search = $("#glossSearch", body);

    function draw() {
      const q = search.value.trim().toLowerCase();
      const filtered = all.filter(
        (e) =>
          !q ||
          e.term.toLowerCase().includes(q) ||
          (e.meaning || "").toLowerCase().includes(q) ||
          (e.tags || []).join(" ").toLowerCase().includes(q)
      );
      if (!filtered.length) {
        list.innerHTML = `<div class="empty" style="padding:40px"><p>Nothing matched "${esc(q)}".</p></div>`;
        return;
      }
      let out = "";
      let letter = "";
      filtered.forEach((e) => {
        const L = letterOf(e.term);
        if (L !== letter) {
          letter = L;
          out += `<div class="glossary-letter">${esc(letter)}</div>`;
        }
        out += `<div class="gloss-row">
          <span class="gt">${esc(e.term)}</span>
          <span class="gm">${esc(e.meaning)}</span>
          <a class="gc" href="#/chapter/${e.chapterId}/expressions">ch ${e.chapterId} →</a>
        </div>`;
      });
      list.innerHTML = out;
    }
    search.addEventListener("input", draw);
    draw();
  }

  /* ============================ boot ============================ */

  function init() {
    load();
    touchStreak();
    setTheme(S.theme || "light");
    $("#settingsBtn") && ($("#settingsBtn").innerHTML = icon("settings"));
    renderLevelCard();
    $("#themeBtn")?.addEventListener("click", () => setTheme(S.theme === "dark" ? "light" : "dark"));
    $("#themeBtnMobile")?.addEventListener("click", () => setTheme(S.theme === "dark" ? "light" : "dark"));
    $("#settingsBtn")?.addEventListener("click", settingsModal);
    $("#menuBtn")?.addEventListener("click", () => $("#sidebar").classList.toggle("open"));
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#sidebar") && !e.target.closest("#menuBtn")) $("#sidebar").classList.remove("open");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal();
        $("#sidebar").classList.remove("open");
      }
    });
    if (!location.hash) location.hash = "#/";
    route();
    // welcome back nudge
    if (S.streak > 2) setTimeout(() => toast(`${S.streak} days in a row — good habit.`), 900);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
