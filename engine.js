/* ===========================================================
   Tense Lab — เครื่องสร้างโจทย์
   โจทย์ทุกข้อสร้างจาก "spec" ที่เก็บได้ ทำให้ข้อที่ตอบผิด
   ถูกสร้างขึ้นมาใหม่ได้เหมือนเดิมทุกประการตอนทบทวน
   =========================================================== */

const QUESTION_TYPES = ['mcq', 'fill', 'transform', 'identify', 'error', 'order'];

const TYPE_LABEL = {
  mcq: 'เลือกคำตอบ',
  fill: 'เติมคำ',
  transform: 'แปลงประโยค',
  identify: 'ระบุ Tense',
  error: 'หาที่ผิด',
  order: 'เรียงประโยค'
};

/* ---------- สุ่มแบบมี seed (โจทย์เดิม = หน้าตาเดิมเสมอ) ---------- */
function hashSpec(spec) {
  const key = `${spec.t}|${spec.ty}|${spec.s}|${spec.v}|${spec.m}|${spec.p}`;
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWith(arr, rnd) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const randInt = n => Math.floor(Math.random() * n);

/* ---------- ผันกริยา: คืนเฉพาะ "กลุ่มคำกริยา" ที่จะไปแทนช่องว่าง ---------- */
function verbPhrase(tenseId, su, v, polarity) {
  const neg = polarity === 'neg';
  switch (tenseId) {
    case 'pres-simple':
      return neg ? `${su.do} not ${v.b}` : (su.third ? v.s : v.b);
    case 'pres-cont':
      return neg ? `${su.be} not ${v.ing}` : `${su.be} ${v.ing}`;
    case 'pres-perf':
      return neg ? `${su.have} not ${v.pp}` : `${su.have} ${v.pp}`;
    case 'pres-perf-cont':
      return neg ? `${su.have} not been ${v.ing}` : `${su.have} been ${v.ing}`;
    case 'past-simple':
      return neg ? `did not ${v.b}` : v.p;
    case 'past-cont':
      return neg ? `${su.bp} not ${v.ing}` : `${su.bp} ${v.ing}`;
    case 'past-perf':
      return neg ? `had not ${v.pp}` : `had ${v.pp}`;
    case 'past-perf-cont':
      return neg ? `had not been ${v.ing}` : `had been ${v.ing}`;
    case 'fut-simple':
      return neg ? `will not ${v.b}` : `will ${v.b}`;
    case 'fut-cont':
      return neg ? `will not be ${v.ing}` : `will be ${v.ing}`;
    case 'fut-perf':
      return neg ? `will not have ${v.pp}` : `will have ${v.pp}`;
    case 'fut-perf-cont':
      return neg ? `will not have been ${v.ing}` : `will have been ${v.ing}`;
    default:
      return v.b;
  }
}

/* ---------- ประโยคคำถาม: คืนทั้งประโยค ---------- */
function questionSentence(tenseId, su, v, marker) {
  const tail = `${v.o} ${marker}?`;
  const cap = w => w.charAt(0).toUpperCase() + w.slice(1);
  switch (tenseId) {
    case 'pres-simple':      return `${cap(su.do)} ${su.l} ${v.b} ${tail}`;
    case 'pres-cont':        return `${cap(su.be)} ${su.l} ${v.ing} ${tail}`;
    case 'pres-perf':        return `${cap(su.have)} ${su.l} ${v.pp} ${tail}`;
    case 'pres-perf-cont':   return `${cap(su.have)} ${su.l} been ${v.ing} ${tail}`;
    case 'past-simple':      return `Did ${su.l} ${v.b} ${tail}`;
    case 'past-cont':        return `${cap(su.bp)} ${su.l} ${v.ing} ${tail}`;
    case 'past-perf':        return `Had ${su.l} ${v.pp} ${tail}`;
    case 'past-perf-cont':   return `Had ${su.l} been ${v.ing} ${tail}`;
    case 'fut-simple':       return `Will ${su.l} ${v.b} ${tail}`;
    case 'fut-cont':         return `Will ${su.l} be ${v.ing} ${tail}`;
    case 'fut-perf':         return `Will ${su.l} have ${v.pp} ${tail}`;
    case 'fut-perf-cont':    return `Will ${su.l} have been ${v.ing} ${tail}`;
    default:                 return `${cap(su.do)} ${su.l} ${v.b} ${tail}`;
  }
}

function statement(tenseId, su, v, marker, polarity) {
  return `${su.s} ${verbPhrase(tenseId, su, v, polarity)} ${v.o} ${marker}.`;
}

/* ---------- ตัวเลือกลวงแบบ "ผิดที่พบบ่อย" ---------- */
function commonWrongForms(tenseId, su, v) {
  const out = [];
  if (tenseId === 'pres-simple' && su.third) out.push(v.b);
  if (tenseId === 'pres-perf') out.push(`${su.have} ${v.p}`);
  if (tenseId === 'fut-perf') out.push(`will ${v.pp}`);
  if (tenseId === 'pres-perf-cont') out.push(`${su.have} ${v.ing}`);
  if (tenseId === 'past-perf-cont') out.push(`had ${v.ing}`);
  if (tenseId === 'fut-perf-cont') out.push(`will have ${v.ing}`);
  if (tenseId === 'fut-cont') out.push(`will ${v.ing}`);
  if (tenseId === 'past-perf') out.push(`${su.have} ${v.pp}`);
  return out;
}

/* ---------- สร้าง spec ---------- */
function makeSpec(tenseId, type) {
  const t = TENSE_BY_ID[tenseId];
  const polarity = type === 'transform'
    ? 'aff'
    : (Math.random() < 0.22 ? 'neg' : 'aff');
  return {
    t: tenseId,
    ty: type,
    s: randInt(SUBJECTS.length),
    v: randInt(VERBS.length),
    m: randInt(t.markers.length),
    p: type === 'transform' ? (Math.random() < 0.5 ? 'toNeg' : 'toQ') : polarity
  };
}

/* ---------- สร้างโจทย์จาก spec ---------- */
function buildQuestion(spec) {
  const t = TENSE_BY_ID[spec.t];
  const su = SUBJECTS[spec.s];
  const v = VERBS[spec.v];
  const marker = t.markers[spec.m];
  const rnd = mulberry32(hashSpec(spec));

  const base = {
    spec,
    tense: t,
    typeLabel: TYPE_LABEL[spec.ty],
    hint: `โครงสร้าง: ${t.formula.aff}  •  ปฏิเสธ: ${t.formula.neg}  •  คำถาม: ${t.formula.q}`,
    verbTh: `${v.b} = ${v.th}`
  };

  /* --- 1) เลือกคำตอบ --- */
  if (spec.ty === 'mcq') {
    const polarity = spec.p === 'neg' ? 'neg' : 'aff';
    const answer = verbPhrase(t.id, su, v, polarity);
    const wrong = [];
    t.foes.forEach(fid => {
      const w = verbPhrase(fid, su, v, polarity);
      if (w !== answer && !wrong.includes(w)) wrong.push(w);
    });
    commonWrongForms(t.id, su, v).forEach(w => {
      if (w !== answer && !wrong.includes(w)) wrong.push(w);
    });
    const options = shuffleWith([answer, ...shuffleWith(wrong, rnd).slice(0, 3)], rnd);
    return {
      ...base,
      kind: 'choice',
      prompt: `เติมกริยาให้ถูกต้องตาม <b>${t.name}</b>${polarity === 'neg' ? ' (รูปปฏิเสธ)' : ''}`,
      sentence: `${su.s} ____ ${v.o} ${marker}.`,
      options,
      answer,
      full: statement(t.id, su, v, marker, polarity)
    };
  }

  /* --- 2) เติมคำ --- */
  if (spec.ty === 'fill') {
    const polarity = spec.p === 'neg' ? 'neg' : 'aff';
    const answer = verbPhrase(t.id, su, v, polarity);
    return {
      ...base,
      kind: 'text',
      prompt: `พิมพ์กริยาในรูป <b>${t.name}</b>${polarity === 'neg' ? ' (รูปปฏิเสธ)' : ''} — โจทย์ให้มา: <code>${v.b}</code>`,
      sentence: `${su.s} ____ ${v.o} ${marker}.`,
      placeholder: 'พิมพ์เฉพาะกลุ่มคำกริยา',
      answer,
      full: statement(t.id, su, v, marker, polarity)
    };
  }

  /* --- 3) แปลงประโยค --- */
  if (spec.ty === 'transform') {
    const source = statement(t.id, su, v, marker, 'aff');
    const toQ = spec.p === 'toQ';
    const answer = toQ
      ? questionSentence(t.id, su, v, marker)
      : statement(t.id, su, v, marker, 'neg');
    return {
      ...base,
      kind: 'text',
      prompt: toQ
        ? 'เปลี่ยนประโยคนี้เป็น <b>ประโยคคำถาม</b> (พิมพ์ทั้งประโยค)'
        : 'เปลี่ยนประโยคนี้เป็น <b>ประโยคปฏิเสธ</b> (พิมพ์ทั้งประโยค)',
      sentence: source,
      placeholder: toQ ? 'พิมพ์ประโยคคำถามทั้งประโยค' : 'พิมพ์ประโยคปฏิเสธทั้งประโยค',
      answer,
      full: answer,
      note: 'พิมพ์แบบย่อได้ เช่น doesn\'t / won\'t'
    };
  }

  /* --- 4) ระบุ tense --- */
  if (spec.ty === 'identify') {
    const polarity = spec.p === 'neg' ? 'neg' : 'aff';
    const sentence = statement(t.id, su, v, marker, polarity);
    const wrong = t.foes.map(fid => TENSE_BY_ID[fid].name).filter(n => n !== t.name);
    const options = shuffleWith([t.name, ...shuffleWith(wrong, rnd).slice(0, 3)], rnd);
    return {
      ...base,
      kind: 'choice',
      prompt: 'ประโยคนี้เป็น Tense อะไร',
      sentence,
      options,
      answer: t.name,
      full: sentence
    };
  }

  /* --- 5) หาที่ผิด --- */
  if (spec.ty === 'error') {
    const polarity = 'aff';
    const answer = verbPhrase(t.id, su, v, polarity);
    const pool = [];
    commonWrongForms(t.id, su, v).forEach(w => { if (w !== answer) pool.push(w); });
    t.foes.forEach(fid => {
      const w = verbPhrase(fid, su, v, polarity);
      if (w !== answer && !pool.includes(w)) pool.push(w);
    });
    const badForm = pool[Math.floor(rnd() * pool.length)] || v.b;
    const others = shuffleWith(pool.filter(w => w !== badForm), rnd).slice(0, 3);
    const options = shuffleWith([answer, ...others], rnd);
    return {
      ...base,
      kind: 'choice',
      prompt: `ประโยคนี้ใช้กริยาผิด — ต้องแก้เป็นอะไรจึงจะเป็น <b>${t.name}</b> ที่ถูกต้อง`,
      sentence: `${su.s} <s class="bad">${badForm}</s> ${v.o} ${marker}.`,
      options,
      answer,
      full: statement(t.id, su, v, marker, polarity)
    };
  }

  /* --- 6) เรียงประโยค ---
     ตัวต่อสร้างจาก "ชิ้นส่วนความหมาย" ไม่ใช่การหั่นทุกช่องว่าง:
     กลุ่มกริยาแตกเป็นคำ ๆ (นั่นคือสิ่งที่กำลังฝึก) ส่วนกรรมและคำบอกเวลา
     อยู่รวมเป็นชิ้นเดียว และไม่มีจุดท้ายประโยคติดไปกับตัวต่อไหนเลย
     เพราะจุดจะเฉลยทันทีว่าคำไหนต้องอยู่ท้าย */
  const polarity = spec.p === 'neg' ? 'neg' : 'aff';
  const parts = [
    su.s,
    ...verbPhrase(t.id, su, v, polarity).split(' '),
    v.o,
    marker
  ];
  const target = parts.join(' ');
  let scrambled = shuffleWith(parts, rnd);
  if (scrambled.join(' ') === target && parts.length > 1) {
    scrambled = [scrambled[scrambled.length - 1], ...scrambled.slice(0, -1)];
  }
  return {
    ...base,
    kind: 'order',
    prompt: `เรียงคำให้เป็นประโยค <b>${t.name}</b> ที่ถูกต้อง`,
    sentence: '',
    tiles: scrambled,
    answer: target,
    full: target + '.',
    note: 'ตัวต่อที่ขึ้นต้นด้วยตัวพิมพ์ใหญ่คือคำแรกของประโยค · จุดท้ายประโยคเติมให้อัตโนมัติ'
  };
}

/* ---------- ตรวจคำตอบข้อพิมพ์ ---------- */
function normalize(str) {
  return String(str)
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/won't/g, 'will not')
    .replace(/can't/g, 'cannot')
    .replace(/shan't/g, 'shall not')
    .replace(/n't/g, ' not')
    .replace(/'ll/g, ' will')
    .replace(/'ve/g, ' have')
    .replace(/'re/g, ' are')
    .replace(/'m/g, ' am')
    .replace(/[.,!?;:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function checkAnswer(q, given) {
  if (q.kind === 'choice') return given === q.answer;
  return normalize(given) === normalize(q.answer);
}

/* ---------- ประกอบชุดข้อสอบ 1 รอบ ---------- */
const ROUND_PLAN = ['mcq', 'mcq', 'fill', 'identify', 'transform', 'mcq', 'error', 'fill', 'order', 'transform'];

function buildRound(tenseId, count) {
  const plan = ROUND_PLAN.slice(0, count || 10);
  return plan.map(type => buildQuestion(makeSpec(tenseId, type)));
}

function buildMixedRound(tenseIds, count) {
  const n = count || 10;
  const plan = shuffleWith(ROUND_PLAN.slice(0, n), mulberry32(Date.now() & 0xffff));
  return plan.map(type => {
    const tid = tenseIds[randInt(tenseIds.length)];
    return buildQuestion(makeSpec(tid, type));
  });
}
