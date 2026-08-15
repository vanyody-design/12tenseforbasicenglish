/* ===========================================================
   Tense Lab — ตรรกะแอปและหน้าจอ
   =========================================================== */

const STORE_KEY = 'tenselab.v1';
const DAILY_GOAL = 50;
const ROUND_SIZE = 10;
const PASS_MARK = 8;
const MASTER_PASSES = 3;
const SECONDS_PER_Q = 30;

/* รูปประโยคทั้งสาม เรียงตรงกับลำดับใน examples ของทุก tense */
const FORMS = [
  { key: 'aff', label: 'บอกเล่า' },
  { key: 'neg', label: 'ปฏิเสธ' },
  { key: 'q',   label: 'คำถาม' }
];

/* ผ่านที่ 80% ของจำนวนข้อจริง — รอบ 10 ข้อจึงเท่ากับ 8 เหมือนเดิม */
const passMark = n => Math.ceil(n * 0.8);

/* ---------- สถานะที่บันทึกลงเครื่อง ---------- */
const defaultState = () => ({
  xp: 0,
  theme: 'auto',
  freeUnlock: false,
  useTimer: true,
  daily: { date: today(), xp: 0 },
  streakDays: 0,
  lastActive: null,
  tenses: {},
  review: []
});

let state = load();
let session = null;
let view = { name: 'home', tenseId: null };

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    return Object.assign(defaultState(), JSON.parse(raw));
  } catch (e) {
    return defaultState();
  }
}

function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* โหมดส่วนตัว */ }
}

function tenseStat(id) {
  if (!state.tenses[id]) state.tenses[id] = { passes: 0, rounds: 0, correct: 0, total: 0, best: 0 };
  return state.tenses[id];
}

function isUnlocked(index) {
  if (state.freeUnlock || index === 0) return true;
  return tenseStat(TENSES[index - 1].id).passes > 0;
}

function level() { return Math.floor(state.xp / 100) + 1; }

function touchDay() {
  const t = today();
  if (state.daily.date !== t) {
    if (state.lastActive && daysBetween(state.lastActive, t) === 1) state.streakDays += 1;
    else if (state.lastActive !== t) state.streakDays = 1;
    state.daily = { date: t, xp: 0 };
  }
  if (!state.lastActive) state.streakDays = 1;
  state.lastActive = t;
}

function addXp(n) {
  state.xp += n;
  touchDay();
  state.daily.xp += n;
  save();
  paintXp();
}

/* ---------- ตัวช่วย DOM ---------- */
const $ = sel => document.querySelector(sel);
const screen = () => $('#screen');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function paintXp() {
  $('#lvlText').textContent = 'Lv.' + level();
  $('#xpFill').style.width = (state.xp % 100) + '%';
  $('#xpChip').title = `${state.xp} XP รวม · อีก ${100 - (state.xp % 100)} XP ถึงเลเวลถัดไป`;
}

function paintTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
}

function setNavActive() {
  document.querySelectorAll('.nav button').forEach(b => {
    b.classList.toggle('on', b.dataset.nav === view.name);
  });
}

function go(name, tenseId) {
  view = { name, tenseId: tenseId || null };
  stopTimer();
  window.scrollTo(0, 0);
  render();
  setNavActive();
}

/* ===========================================================
   หน้าจอ: หน้าหลัก
   =========================================================== */
function renderHome() {
  touchDay();
  save();

  const mastered = TENSES.filter(t => tenseStat(t.id).passes >= MASTER_PASSES).length;
  const goalPct = Math.min(100, Math.round(state.daily.xp / DAILY_GOAL * 100));
  const reviewCount = state.review.length;

  const groups = ['Present', 'Past', 'Future'];
  let grid = '';
  groups.forEach(g => {
    grid += `<div class="group-label">${g} Tenses</div><div class="tense-grid">`;
    TENSES.forEach((t, i) => {
      if (t.group !== g) return;
      const st = tenseStat(t.id);
      const open = isUnlocked(i);
      const acc = st.total ? Math.round(st.correct / st.total * 100) + '% แม่นยำ' : 'ยังไม่เคยฝึก';
      const dots = [0, 1, 2].map(n => `<i class="${st.passes > n ? 'on' : ''}"></i>`).join('');
      grid += `
        <button class="tense-card ${open ? '' : 'locked'}" ${open ? `data-tense="${t.id}"` : 'disabled'}>
          <div class="tc-name">${t.name}</div>
          <div class="tc-th">${t.th}</div>
          <div class="tc-formula">${esc(t.formula.aff)}</div>
          <div class="tc-foot">
            <div class="dots" title="ผ่าน ${st.passes}/${MASTER_PASSES} รอบ">${dots}</div>
            <div class="tc-acc">${open ? acc : '🔒 ผ่านบทก่อนหน้าก่อน'}</div>
          </div>
        </button>`;
    });
    grid += '</div>';
  });

  screen().innerHTML = `
    <h1>ฝึกไวยากรณ์อังกฤษ ครบทั้ง 12 Tenses</h1>
    <p class="lede">เรียนโครงสร้าง → ดูเส้นเวลา → ลงมือฝึก 6 รูปแบบข้อสอบ โจทย์สุ่มใหม่ทุกครั้ง ไม่มีวันจำคำตอบได้</p>

    <div class="daily">
      <div class="stat"><b>${state.daily.xp}<span class="muted small"> / ${DAILY_GOAL}</span></b><span>XP วันนี้</span></div>
      <div class="goal-track"><i style="width:${goalPct}%"></i></div>
      <div class="sep"></div>
      <div class="stat"><b>${state.streakDays}</b><span>วันติดต่อกัน</span></div>
      <div class="sep"></div>
      <div class="stat"><b>${mastered}/12</b><span>Tense ที่เชี่ยวชาญ</span></div>
    </div>

    <div class="mode-row">
      <button class="mode-card" data-mixed="1">
        <b>รวมทุก Tense ⚡</b>
        <span>สุ่มจาก tense ที่ปลดล็อกแล้ว — วัดว่าแยกออกจริงไหม</span>
      </button>
      <button class="mode-card" data-review="1" ${reviewCount ? '' : 'disabled style="opacity:.5"'}>
        <b>ทบทวนข้อที่เคยผิด ${reviewCount ? `<span class="badge">${reviewCount}</span>` : ''}</b>
        <span>${reviewCount ? 'ต้องตอบถูก 2 ครั้งจึงจะหลุดออกจากคลัง' : 'ยังไม่มีข้อที่ตอบผิดค้างอยู่'}</span>
      </button>
    </div>

    ${grid}
  `;

  screen().querySelectorAll('[data-tense]').forEach(el => {
    el.onclick = () => go('learn', el.dataset.tense);
  });
  const mixBtn = screen().querySelector('[data-mixed]');
  if (mixBtn) mixBtn.onclick = () => startMixed();
  const revBtn = screen().querySelector('[data-review]');
  if (revBtn && reviewCount) revBtn.onclick = () => startReview();
}

/* ===========================================================
   หน้าจอ: บทเรียน
   =========================================================== */
/* วาดเฉพาะเครื่องหมายบนราง — ghost = ฝั่งที่เอามาเทียบ (สีจาง) */
function marksHtml(marks, ghost) {
  const g = ghost ? ' ghost' : '';
  let out = '';
  marks.forEach(m => {
    if (m.type === 'dots') {
      out += `<div class="tl-dots${g}">` + '<i></i>'.repeat(7) + '</div>';
    } else if (m.type === 'bar') {
      out += `<div class="tl-bar${g}${m.hatch ? ' hatch' : ''}" style="left:${m.from}%;width:${m.to - m.from}%"></div>`;
    } else if (m.type === 'dot') {
      out += `<div class="tl-dot${g}" style="left:${m.at}%"></div>`;
      if (m.label) out += `<div class="tl-lab" style="left:${m.at}%">${m.label}</div>`;
    }
  });
  return out;
}

/* opts.caps = false → รางเปล่าไม่มีป้าย อดีต/ตอนนี้/อนาคต (ใช้ในแถบเทียบ) */
function timelineHtml(marks, opts) {
  const o = opts || {};
  const bare = o.caps === false;
  let inner = '<div class="tl-line"></div><div class="tl-now"></div>';
  if (!bare) {
    inner += '<div class="tl-cap" style="left:8%">อดีต</div>' +
             '<div class="tl-cap" style="left:50%">ตอนนี้</div>' +
             '<div class="tl-cap" style="left:92%">อนาคต</div>';
  }
  inner += marksHtml(marks, o.ghost);
  return `<div class="timeline${bare ? ' bare' : ''}">${inner}</div>`;
}

/* แถบเทียบ: tense นี้ (สีเน้น) กับ tense ที่สับสนกันบ่อย (สีจาง) บนแกนเวลาเดียวกัน */
function compareHtml(t) {
  if (!t.contrast || !t.contrast.length) return '';
  const blocks = t.contrast.map(c => {
    const other = TENSE_BY_ID[c.vs];
    if (!other) return '';
    return `
      <div class="compare">
        <div class="cmp-line">
          <div class="cmp-name">${t.name}</div>
          <div>${timelineHtml(t.marks, { caps: false })}</div>
        </div>
        <div class="cmp-line"><div class="cmp-name"></div><div class="cmp-ex">${esc(c.mine)}</div></div>
        <div class="cmp-line">
          <div class="cmp-name dim">${other.name}</div>
          <div>${timelineHtml(other.marks, { caps: false, ghost: true })}</div>
        </div>
        <div class="cmp-line"><div class="cmp-name"></div><div class="cmp-ex dim">${esc(c.theirs)}</div></div>
        <div class="cmp-line">
          <div class="cmp-name"></div>
          <div class="cmp-axis"><span>อดีต</span><span>ตอนนี้</span><span>อนาคต</span></div>
        </div>
        <div class="cmp-point">${c.point}</div>
      </div>`;
  }).join('');
  return `<h2>เทียบกับ Tense ที่สับสนกันบ่อย</h2>${blocks}`;
}

function renderLearn() {
  const t = TENSE_BY_ID[view.tenseId];
  const st = tenseStat(t.id);
  const acc = st.total ? Math.round(st.correct / st.total * 100) : 0;

  screen().innerHTML = `
    <button class="back-link">← กลับหน้าบทเรียน</button>
    <h1>${t.name}</h1>
    <p class="lede">${t.th} · ผ่านแล้ว ${st.passes}/${MASTER_PASSES} รอบ${st.total ? ` · ความแม่นยำ ${acc}%` : ''}</p>

    ${timelineHtml(t.marks)}

    ${compareHtml(t)}

    <h2>การ์ดโครงสร้าง</h2>
    <div class="formula-grid">
      ${FORMS.map((f, i) => {
        const ex = t.examples[i];
        return `<div class="frow">
          <b>${f.label}</b>
          <span class="fx">${esc(t.formula[f.key])}</span>
          ${ex ? `<span class="fen">${esc(ex.en)}</span><span class="fth">${esc(ex.th)}</span>` : ''}
        </div>`;
      }).join('')}
    </div>

    <h2>ใช้เมื่อไร</h2>
    <ul class="clean">${t.uses.map(u => `<li>${u}</li>`).join('')}</ul>

    <h2>คำบอกเวลาที่มักเจอคู่กัน</h2>
    <div class="chips">${t.markers.map(m => `<span class="chip">${m}</span>`).join('')}</div>
    <p class="small muted" style="margin-top:10px">เจอคำที่ไม่แน่ใจ? เปิด <button class="link-btn" data-nav-inline="signals">ตารางคำบอกเวลา</button> เพื่อค้นย้อนกลับจากคำไปหา tense</p>

    <h2>ผิดกันบ่อย ⚠︎</h2>
    <ul class="clean">${t.mistakes.map(m => `<li>${m}</li>`).join('')}</ul>

    <h2>ลงมือฝึก</h2>
    <div class="mode-row">
      <button class="mode-card" data-mode="practice">
        <b>โหมดฝึกซ้อม</b>
        <span>${ROUND_SIZE} ข้อ · ไม่มีหัวใจ ไม่มีเวลาจับ · กดใบ้ได้</span>
      </button>
      <button class="mode-card" data-mode="challenge">
        <b>โหมดท้าทาย 🔥</b>
        <span>${ROUND_SIZE} ข้อ · หัวใจ 3 ดวง${state.useTimer ? ` · ${SECONDS_PER_Q} วินาทีต่อข้อ` : ''} · XP มากกว่า</span>
      </button>
    </div>
  `;

  screen().querySelector('.back-link').onclick = () => go('home');
  screen().querySelectorAll('[data-mode]').forEach(el => {
    el.onclick = () => startRound(t.id, el.dataset.mode);
  });
  const sigLink = screen().querySelector('[data-nav-inline]');
  if (sigLink) sigLink.onclick = () => go(sigLink.dataset.navInline);
}

/* ===========================================================
   ห้องสอบ
   =========================================================== */
function startRound(tenseId, mode) {
  session = {
    mode,
    tenseId,
    title: TENSE_BY_ID[tenseId].name,
    questions: buildRound(tenseId, ROUND_SIZE),
    idx: 0, hearts: 3, combo: 0, bestCombo: 0,
    xp: 0, correct: 0, hintUsed: false,
    answered: false, chosen: null, tray: []
  };
  go('quiz');
}

function startMixed() {
  const open = TENSES.filter((t, i) => isUnlocked(i)).map(t => t.id);
  session = {
    mode: 'challenge',
    tenseId: null,
    title: 'รวมทุก Tense',
    questions: buildMixedRound(open, ROUND_SIZE),
    idx: 0, hearts: 3, combo: 0, bestCombo: 0,
    xp: 0, correct: 0, hintUsed: false,
    answered: false, chosen: null, tray: []
  };
  go('quiz');
}

function startReview() {
  const specs = state.review.slice(0, ROUND_SIZE).map(r => r.spec);
  session = {
    mode: 'review',
    tenseId: null,
    title: 'ทบทวนข้อที่เคยผิด',
    questions: specs.map(buildQuestion),
    idx: 0, hearts: 3, combo: 0, bestCombo: 0,
    xp: 0, correct: 0, hintUsed: false,
    answered: false, chosen: null, tray: []
  };
  go('quiz');
}

/* ---------- นาฬิกาจับเวลา ---------- */
let timerId = null;
function stopTimer() {
  if (timerId) { clearInterval(timerId); timerId = null; }
}
function startTimer() {
  stopTimer();
  /* หัวใจและนาฬิกาเป็นของโหมดท้าทายเท่านั้น — ฝึกซ้อมและทบทวนไม่กดดัน */
  if (!session || session.mode !== 'challenge' || !state.useTimer) return;
  session.timeLeft = SECONDS_PER_Q;
  const tick = () => {
    const el = $('#timer');
    if (!el) return stopTimer();
    el.textContent = session.timeLeft + 's';
    el.classList.toggle('warn', session.timeLeft <= 10);
    if (session.timeLeft <= 0) { stopTimer(); submitAnswer(true); }
    session.timeLeft--;
  };
  tick();
  timerId = setInterval(tick, 1000);
}

function renderQuiz() {
  const s = session;
  const q = s.questions[s.idx];
  const pct = Math.round(s.idx / s.questions.length * 100);
  const showHearts = s.mode === 'challenge';

  let body = '';
  if (q.kind === 'choice') {
    body = `<div class="opts">${q.options.map((o, i) =>
      `<button class="opt" data-opt="${esc(o)}"><kbd>${i + 1}</kbd><span>${esc(o)}</span></button>`
    ).join('')}</div>`;
  } else if (q.kind === 'text') {
    body = `<input class="answer-input" id="ansInput" autocomplete="off" autocapitalize="off"
              spellcheck="false" placeholder="${q.placeholder || ''}">
            ${q.note ? `<div class="small muted" style="margin-top:8px">${q.note}</div>` : ''}`;
  } else {
    body = `<div class="tile-tray" id="tray"></div><div class="tile-bank" id="bank"></div>
            ${q.note ? `<div class="small muted" style="margin-top:10px">${q.note}</div>` : ''}`;
  }

  screen().innerHTML = `
    <div class="quiz-head">
      <button class="back-link" style="margin:0">← ออก</button>
      <div class="progress"><i style="width:${pct}%"></i></div>
      <div class="small muted">${s.idx + 1}/${s.questions.length}</div>
      ${showHearts ? `<div class="hearts">${[0, 1, 2].map(n => `<span class="${s.hearts > n ? '' : 'heart-off'}">♥</span>`).join('')}</div>` : ''}
      ${s.combo >= 3 ? `<div class="combo">×${s.combo >= 5 ? '2' : '1.5'} คอมโบ</div>` : ''}
      ${(s.mode === 'challenge' && state.useTimer) ? '<div class="timer" id="timer"></div>' : ''}
    </div>

    <div class="q-type">${q.typeLabel} · ${q.tense.name}</div>
    <div class="q-prompt">${q.prompt}</div>
    ${q.sentence ? `<div class="q-sentence">${q.sentence}</div>` : ''}
    ${body}
    <div id="hintSlot"></div>
    <div id="fbSlot"></div>

    <div class="quiz-actions">
      <button class="btn ghost" id="hintBtn">ขอคำใบ้</button>
      <div class="spacer"></div>
      <button class="btn primary" id="mainBtn">ตอบ</button>
    </div>
  `;

  screen().querySelector('.back-link').onclick = () => { stopTimer(); session = null; go('home'); };
  $('#hintBtn').onclick = showHint;
  $('#mainBtn').onclick = () => submitAnswer(false);

  if (q.kind === 'choice') {
    screen().querySelectorAll('.opt').forEach(el => {
      el.onclick = () => {
        if (s.answered) return;
        s.chosen = el.dataset.opt;
        screen().querySelectorAll('.opt').forEach(o => o.classList.toggle('sel', o === el));
      };
    });
  } else if (q.kind === 'text') {
    const inp = $('#ansInput');
    inp.focus();
    inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); submitAnswer(false); } };
  } else {
    s.tray = [];
    paintTiles();
  }

  startTimer();
}

function paintTiles() {
  const s = session;
  const q = s.questions[s.idx];
  const tray = $('#tray'), bank = $('#bank');
  if (!tray || !bank) return;

  tray.innerHTML = s.tray.map((t, i) => `<button class="tile" data-tray="${i}">${esc(t.w)}</button>`).join('');
  bank.innerHTML = q.tiles.map((w, i) =>
    `<button class="tile ${s.tray.some(t => t.i === i) ? 'used' : ''}" data-bank="${i}">${esc(w)}</button>`
  ).join('');

  if (s.answered) {
    tray.querySelectorAll('.tile').forEach(b => b.disabled = true);
    bank.querySelectorAll('.tile').forEach(b => b.disabled = true);
    return;
  }
  bank.querySelectorAll('[data-bank]').forEach(el => {
    el.onclick = () => {
      const i = +el.dataset.bank;
      s.tray.push({ i, w: q.tiles[i] });
      paintTiles();
    };
  });
  tray.querySelectorAll('[data-tray]').forEach(el => {
    el.onclick = () => { s.tray.splice(+el.dataset.tray, 1); paintTiles(); };
  });
}

function showHint() {
  const s = session;
  if (s.answered || s.hintUsed) return;
  s.hintUsed = true;
  s.combo = 0;
  const q = s.questions[s.idx];
  $('#hintSlot').innerHTML = `<div class="hint-box">${q.hint}<br>${q.verbTh}</div>`;
  $('#hintBtn').disabled = true;
}

function currentAnswer() {
  const s = session;
  const q = s.questions[s.idx];
  if (q.kind === 'choice') return s.chosen;
  if (q.kind === 'text') return ($('#ansInput') || {}).value || '';
  return s.tray.map(t => t.w).join(' ');
}

function submitAnswer(timedOut) {
  const s = session;
  if (s.answered) return nextQuestion();
  const q = s.questions[s.idx];
  const given = currentAnswer();
  if (!timedOut && (given === null || String(given).trim() === '')) return;

  stopTimer();
  s.answered = true;
  const correct = !timedOut && checkAnswer(q, given);

  /* คะแนน */
  if (correct) {
    s.correct++;
    s.combo++;
    s.bestCombo = Math.max(s.bestCombo, s.combo);
    let gain = 10;
    if (s.combo >= 5) gain *= 2; else if (s.combo >= 3) gain *= 1.5;
    if (s.hintUsed) gain *= 0.5;
    if (s.mode === 'challenge') gain += 2;
    s.xp += Math.round(gain);
    removeFromReview(q.spec);
  } else {
    s.combo = 0;
    if (s.mode === 'challenge') s.hearts--;
    addToReview(q.spec);
  }

  /* บันทึกสถิติราย tense */
  const st = tenseStat(q.tense.id);
  st.total++;
  if (correct) st.correct++;
  save();

  /* แสดงผลเฉลย */
  if (q.kind === 'choice') {
    screen().querySelectorAll('.opt').forEach(el => {
      el.disabled = true;
      el.classList.remove('sel');
      if (el.dataset.opt === q.answer) el.classList.add('ok');
      else if (el.dataset.opt === given) el.classList.add('no');
    });
  } else if (q.kind === 'text') {
    const inp = $('#ansInput');
    if (inp) inp.disabled = true;
  } else {
    paintTiles();
  }

  const heartMsg = (!correct && s.mode === 'challenge') ? ' · เสียหัวใจ 1 ดวง' : '';
  $('#fbSlot').innerHTML = `
    <div class="feedback ${correct ? 'ok' : 'no'}">
      <div class="fb-title">${correct ? `ถูกต้อง +${s.xp - (s.prevXp || 0)} XP` : (timedOut ? 'หมดเวลา' : 'ยังไม่ถูก')}${heartMsg}</div>
      <div class="fb-ans">${esc(q.full)}</div>
      <div class="fb-why">${q.tense.name} (${q.tense.th}) · ${esc(q.tense.formula.aff)} · ${q.verbTh}</div>
    </div>`;
  s.prevXp = s.xp;

  const btn = $('#mainBtn');
  const last = s.idx >= s.questions.length - 1;
  const dead = s.mode === 'challenge' && s.hearts <= 0;
  btn.textContent = (last || dead) ? 'ดูผลสรุป' : 'ข้อถัดไป';
  btn.onclick = nextQuestion;
  btn.focus();
  $('#hintBtn').disabled = true;
}

function nextQuestion() {
  const s = session;
  const dead = s.mode === 'challenge' && s.hearts <= 0;
  if (dead || s.idx >= s.questions.length - 1) return finishRound(dead);
  s.idx++;
  s.answered = false;
  s.chosen = null;
  s.hintUsed = false;
  renderQuiz();
}

/* ---------- คลังข้อที่ตอบผิด ---------- */
function specKey(sp) { return `${sp.t}|${sp.ty}|${sp.s}|${sp.v}|${sp.m}|${sp.p}`; }

function addToReview(sp) {
  const k = specKey(sp);
  const found = state.review.find(r => specKey(r.spec) === k);
  if (found) found.misses = Math.min(found.misses + 1, 3);
  else state.review.unshift({ spec: sp, misses: 2 });
  if (state.review.length > 60) state.review.length = 60;
  save();
}

function removeFromReview(sp) {
  const k = specKey(sp);
  const i = state.review.findIndex(r => specKey(r.spec) === k);
  if (i < 0) return;
  state.review[i].misses--;
  if (state.review[i].misses <= 0) state.review.splice(i, 1);
  save();
}

/* ---------- สรุปผล ---------- */
function finishRound(outOfHearts) {
  const s = session;
  stopTimer();
  const total = s.questions.length;
  const need = passMark(total);
  const passed = !outOfHearts && s.correct >= need;
  let bonus = 0;
  if (passed) bonus += 20;
  if (s.correct === total) bonus += 30;
  s.xp += bonus;
  addXp(s.xp);

  let unlockedName = null;
  if (s.tenseId) {
    const st = tenseStat(s.tenseId);
    st.rounds++;
    st.best = Math.max(st.best, s.correct);
    if (passed) {
      const before = st.passes;
      st.passes = Math.min(MASTER_PASSES, st.passes + 1);
      if (before === 0) {
        const idx = TENSES.findIndex(t => t.id === s.tenseId);
        if (idx >= 0 && idx + 1 < TENSES.length) unlockedName = TENSES[idx + 1].name;
      }
    }
    save();
  }

  view = { name: 'result', tenseId: s.tenseId };
  setNavActive();
  window.scrollTo(0, 0);

  const st = s.tenseId ? tenseStat(s.tenseId) : null;
  const pctScore = Math.round(s.correct / total * 100);

  screen().innerHTML = `
    <div class="q-type">${s.title} · ${s.mode === 'practice' ? 'โหมดฝึกซ้อม' : s.mode === 'review' ? 'ทบทวน' : 'โหมดท้าทาย'}</div>
    <div class="result-score">${s.correct}<span class="muted" style="font-size:24px">/${total}</span></div>
    <p class="lede">${
      outOfHearts ? 'หัวใจหมดก่อน — รอบนี้ยังไม่นับผ่าน ลองใหม่อีกครั้งได้เลย'
      : passed ? (pctScore === 100 ? 'เต็ม! แม่นทุกข้อ 🎯' : 'ผ่านเกณฑ์ 80% เรียบร้อย')
      : `ยังไม่ผ่าน — ต้องถูกอย่างน้อย ${need}/${total}`
    }</p>

    <div class="result-grid">
      <div class="card"><b>+${s.xp}</b><span>XP ที่ได้${bonus ? ` (โบนัส ${bonus})` : ''}</span></div>
      <div class="card"><b>×${s.bestCombo}</b><span>คอมโบสูงสุด</span></div>
      <div class="card"><b>${pctScore}%</b><span>ความแม่นยำรอบนี้</span></div>
      ${st ? `<div class="card"><b>${st.passes}/${MASTER_PASSES}</b><span>ดาวความเชี่ยวชาญ</span></div>` : ''}
    </div>

    ${unlockedName ? `<div class="card" style="margin-bottom:18px"><span class="badge ok">ปลดล็อกใหม่</span> คุณเปิด <b>${unlockedName}</b> ได้แล้ว</div>` : ''}
    ${state.review.length ? `<p class="small muted">มี ${state.review.length} ข้อรอทบทวนอยู่ในคลัง — ตอบถูก 2 ครั้งข้อนั้นจะหลุดออกไป</p>` : ''}

    <div class="btn-row" style="margin-top:18px">
      <button class="btn primary" id="againBtn">ฝึกอีกรอบ</button>
      ${state.review.length ? '<button class="btn" id="revBtn">ทบทวนข้อที่ผิด</button>' : ''}
      <button class="btn ghost" id="homeBtn">กลับหน้าบทเรียน</button>
    </div>
  `;

  const mode = s.mode, tid = s.tenseId;
  $('#againBtn').onclick = () => {
    if (mode === 'review') startReview();
    else if (tid) startRound(tid, mode);
    else startMixed();
  };
  const rb = $('#revBtn');
  if (rb) rb.onclick = () => startReview();
  $('#homeBtn').onclick = () => go('home');
  session = null;
}

/* ===========================================================
   หน้าจอ: สถิติ + ตั้งค่า
   =========================================================== */
function renderStats() {
  const rows = TENSES.map(t => {
    const st = tenseStat(t.id);
    const pc = st.total ? Math.round(st.correct / st.total * 100) : 0;
    return `<div class="bar-row">
      <div class="nm">${t.name} <span class="small muted">· ${st.total} ข้อ</span></div>
      <div class="bar-track"><i style="width:${pc}%"></i></div>
      <div class="pc">${st.total ? pc + '%' : '–'}</div>
    </div>`;
  }).join('');

  const totalQ = TENSES.reduce((n, t) => n + tenseStat(t.id).total, 0);
  const totalC = TENSES.reduce((n, t) => n + tenseStat(t.id).correct, 0);

  screen().innerHTML = `
    <h1>สถิติของคุณ</h1>
    <p class="lede">ดูว่า tense ไหนยังไม่แน่น แล้วกลับไปฝึกเฉพาะจุดนั้น</p>

    <div class="result-grid" style="margin-top:0">
      <div class="card"><b>${state.xp}</b><span>XP รวม</span></div>
      <div class="card"><b>Lv.${level()}</b><span>เลเวล</span></div>
      <div class="card"><b>${totalQ ? Math.round(totalC / totalQ * 100) : 0}%</b><span>ความแม่นยำรวม</span></div>
      <div class="card"><b>${state.review.length}</b><span>ข้อรอทบทวน</span></div>
    </div>

    <h2>ความแม่นยำราย Tense</h2>
    <div class="card">${rows}</div>

    <h2>ตั้งค่า</h2>
    <div class="card">
      <div class="setting">
        <div><div class="s-t">ปลดล็อกทุก tense</div><div class="s-d">ข้ามกฎที่ต้องผ่านบทก่อนหน้าก่อน</div></div>
        <button class="switch ${state.freeUnlock ? 'on' : ''}" data-set="freeUnlock"><i></i></button>
      </div>
      <div class="setting">
        <div><div class="s-t">จับเวลา ${SECONDS_PER_Q} วินาทีต่อข้อ</div><div class="s-d">ใช้เฉพาะโหมดท้าทายและโหมดรวม</div></div>
        <button class="switch ${state.useTimer ? 'on' : ''}" data-set="useTimer"><i></i></button>
      </div>
      <div class="setting">
        <div><div class="s-t">ล้างความคืบหน้าทั้งหมด</div><div class="s-d">XP ดาว สถิติ และคลังทบทวนจะหายทั้งหมด</div></div>
        <button class="btn" id="resetBtn">ล้างข้อมูล</button>
      </div>
    </div>
  `;

  screen().querySelectorAll('[data-set]').forEach(el => {
    el.onclick = () => {
      const k = el.dataset.set;
      state[k] = !state[k];
      save();
      renderStats();
    };
  });
  $('#resetBtn').onclick = () => {
    if (!confirm('ยืนยันล้างความคืบหน้าทั้งหมด? การกระทำนี้ย้อนกลับไม่ได้')) return;
    state = defaultState();
    save();
    paintXp();
    go('home');
  };
}

/* ===========================================================
   หน้าจอ: กติกา
   =========================================================== */
const RULES = [
  [`1 รอบ = ${ROUND_SIZE} ข้อ ผ่านที่ ${PASS_MARK} ข้อ`, `ต่ำกว่า 80% ถือว่ายังไม่ผ่าน ต้องเล่นรอบนั้นใหม่ · รอบทบทวนที่มีไม่ถึง ${ROUND_SIZE} ข้อ ใช้เกณฑ์ 80% ของจำนวนข้อจริง`],
  ['หัวใจ 3 ดวง (โหมดท้าทายเท่านั้น)', 'ตอบผิดหรือหมดเวลาเสีย 1 ดวง หมดหัวใจจบรอบทันทีและไม่นับผ่าน · โหมดฝึกซ้อมและโหมดทบทวนไม่มีหัวใจ ผิดได้ไม่จำกัด'],
  [`จับเวลา ${SECONDS_PER_Q} วินาทีต่อข้อ`, 'ใช้ในโหมดท้าทายและโหมดรวมทุก tense ปิดได้ในหน้าตั้งค่า · โหมดฝึกซ้อมและทบทวนไม่จับเวลา'],
  ['คอมโบเพิ่ม XP', 'ถูกติดกัน 3 ข้อ ได้ ×1.5 · ถูกติดกัน 5 ข้อขึ้นไป ได้ ×2 · ตอบผิดคอมโบรีเซ็ตเป็นศูนย์'],
  ['คำใบ้มีราคา', 'กดขอคำใบ้ได้ 1 ครั้งต่อข้อ แต่ข้อนั้นได้ XP ครึ่งเดียวและคอมโบถูกรีเซ็ต'],
  ['ปลดล็อกตามลำดับ', 'ต้องผ่าน tense ก่อนหน้าอย่างน้อย 1 รอบจึงจะเปิด tense ถัดไป · ปิดกฎนี้ได้ในหน้าตั้งค่า'],
  ['ดาวความเชี่ยวชาญ 3 ดวง', 'ผ่านครบ 3 รอบในหนึ่ง tense ถือว่าเชี่ยวชาญ (Mastered)'],
  ['ข้อที่ตอบผิดเข้าคลังทบทวน', 'ต้องตอบข้อนั้นถูกอีก 2 ครั้งจึงจะหลุดออกจากคลัง ผิดซ้ำจะถูกถามบ่อยขึ้น'],
  ['เป้าหมายรายวัน 50 XP', 'ทำครบทุกวันเพื่อสะสม streak · เว้นวันเมื่อไร streak เริ่มนับหนึ่งใหม่'],
  ['เลเวลขึ้นทุก 100 XP', 'XP ฐาน 10 ต่อข้อ · โหมดท้าทาย +2 ต่อข้อ · ผ่านรอบ +20 · เต็ม 10/10 อีก +30']
];

function renderRules() {
  screen().innerHTML = `
    <h1>กติกา</h1>
    <p class="lede">ออกแบบให้ "ตอบถูกเพราะเข้าใจ" ไม่ใช่เพราะจำคำตอบได้ โจทย์จึงสุ่มใหม่ทุกครั้งจากคลังประธาน ${SUBJECTS.length} แบบ × กริยา ${VERBS.length} คำ × 6 รูปแบบข้อสอบ</p>
    <div class="rule-list">
      ${RULES.map(r => `<div class="rule"><div class="n"></div><div><div class="t">${r[0]}</div><div class="d">${r[1]}</div></div></div>`).join('')}
    </div>

    <h2>รูปแบบข้อสอบทั้ง 6 แบบ</h2>
    <div class="card">
      <div class="setting"><div><div class="s-t">เลือกคำตอบ</div><div class="s-d">เลือกกริยาที่ถูก tense จากตัวเลือกที่ตั้งใจทำให้สับสน</div></div></div>
      <div class="setting"><div><div class="s-t">เติมคำ</div><div class="s-d">พิมพ์กริยาเอง ไม่มีตัวเลือกให้เดา</div></div></div>
      <div class="setting"><div><div class="s-t">แปลงประโยค</div><div class="s-d">เปลี่ยนบอกเล่าเป็นปฏิเสธหรือคำถาม พิมพ์ทั้งประโยค</div></div></div>
      <div class="setting"><div><div class="s-t">ระบุ Tense</div><div class="s-d">อ่านประโยคแล้วบอกว่าเป็น tense อะไร</div></div></div>
      <div class="setting"><div><div class="s-t">หาที่ผิด</div><div class="s-d">ประโยคใช้กริยาผิด เลือกรูปที่แก้ให้ถูก</div></div></div>
      <div class="setting"><div><div class="s-t">เรียงประโยค</div><div class="s-d">กดคำมาต่อกันให้เป็นประโยคที่ถูกลำดับ</div></div></div>
    </div>

    <h2>เคล็ดลับการฝึก</h2>
    <ul class="clean">
      <li>อ่านหน้าบทเรียนและดูเส้นเวลาก่อนเสมอ — ภาพเส้นเวลาช่วยได้มากกว่าท่องสูตร</li>
      <li>จับ "คำบอกเวลา" ให้ได้ก่อน แล้ว tense จะตามมาเอง</li>
      <li>ฝึกซ้อมจนแม่นแล้วค่อยขึ้นโหมดท้าทาย อย่ารีบเก็บดาว</li>
      <li>เล่นสั้น ๆ วันละ 1–2 รอบ ดีกว่าอัดรวดเดียวสัปดาห์ละครั้ง</li>
    </ul>
  `;
}

/* ===========================================================
   หน้าจอ: คำบอกเวลา (ค้นย้อนกลับ คำ → tense)
   =========================================================== */
function renderSignals() {
  const rows = SIGNAL_WORDS.map(s => `
    <div class="sig-row">
      <div class="sig-w">${esc(s.w)}</div>
      <div class="sig-t">${s.ids.map(id => {
        const t = TENSE_BY_ID[id];
        return t ? `<button class="chip" data-go="${id}" title="เปิดบทเรียน ${t.name}">${t.name}</button>` : '';
      }).join('')}</div>
      <div class="sig-n">${esc(s.note)}</div>
    </div>`).join('');

  screen().innerHTML = `
    <h1>คำบอกเวลา</h1>
    <p class="lede">เวลาทำข้อสอบเราเห็น "คำ" ก่อนเสมอ แล้วค่อยเดา tense — ตารางนี้จึงเรียงจากคำไปหา tense กดชื่อ tense เพื่อเปิดบทเรียนได้ทันที</p>

    <h2>คู่ที่สลับกันบ่อยที่สุด ⚠︎</h2>
    <div class="trap-list">
      ${SIGNAL_TRAPS.map(x => `<div class="trap"><div class="tp">${esc(x.pair)}</div><div class="tb">${x.body}</div></div>`).join('')}
    </div>

    <h2>ค้นจากคำ → Tense</h2>
    <div class="card sig-table">${rows}</div>

    <p class="small muted" style="margin-top:16px">คำบอกเวลาไม่ใช่กฎตายตัว 100% — ถ้าคำกับความหมายของประโยคขัดกัน ให้เชื่อความหมายก่อนเสมอ</p>
  `;

  screen().querySelectorAll('[data-go]').forEach(el => {
    el.onclick = () => go('learn', el.dataset.go);
  });
}

/* ===========================================================
   ตัวควบคุมหลัก
   =========================================================== */
function render() {
  if (view.name === 'home') return renderHome();
  if (view.name === 'learn') return renderLearn();
  if (view.name === 'quiz') return renderQuiz();
  if (view.name === 'stats') return renderStats();
  if (view.name === 'signals') return renderSignals();
  if (view.name === 'rules') return renderRules();
  renderHome();
}

document.querySelectorAll('[data-nav]').forEach(b => {
  b.onclick = () => { session = null; go(b.dataset.nav); };
});

$('#themeBtn').onclick = () => {
  const order = ['auto', 'light', 'dark'];
  state.theme = order[(order.indexOf(state.theme) + 1) % 3];
  save();
  paintTheme();
};

/* ปุ่มลัด: 1–4 เลือกคำตอบ · Enter ตอบ/ข้อถัดไป */
document.addEventListener('keydown', e => {
  if (view.name !== 'quiz' || !session) return;
  const q = session.questions[session.idx];

  if (!session.answered && q.kind === 'choice' && /^[1-4]$/.test(e.key)) {
    const el = screen().querySelectorAll('.opt')[+e.key - 1];
    if (el) el.click();
    e.preventDefault();
    return;
  }

  if (e.key !== 'Enter') return;

  /* ช่องพิมพ์คำตอบและปุ่มในแถบล่างมีตัวจัดการ Enter ของตัวเองอยู่แล้ว
     preventDefault ไม่ได้หยุด event ไม่ให้ลอยมาถึงตรงนี้ ถ้าปล่อยให้ทำงานซ้ำ
     ข้อพิมพ์ตอบจะข้ามหน้าเฉลยไปข้อถัดไปทันทีตั้งแต่กด Enter ครั้งแรก */
  const t = e.target;
  if (t && (t.id === 'ansInput' || (t.tagName === 'BUTTON' && t.closest('.quiz-actions')))) return;

  if (session.answered || q.kind !== 'text') {
    submitAnswer(false);
    e.preventDefault();
  }
});

paintTheme();
paintXp();
go('home');
