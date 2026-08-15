/* ===========================================================
   Tense Lab — ข้อมูลไวยากรณ์ (12 Tenses), ประธาน, และคลังคำกริยา
   =========================================================== */

/* ---------- ประธาน ----------
   s  = รูปขึ้นต้นประโยค
   l  = รูปกลางประโยค (ใช้ในประโยคคำถาม)
   be / bp / have / do = กริยาช่วยที่ผันตามประธาน
   third = เป็นเอกพจน์บุรุษที่ 3 หรือไม่ (ต้องเติม s ใน Present Simple)
*/
const SUBJECTS = [
  { s: 'I',            l: 'I',            be: 'am',  bp: 'was',  have: 'have', do: 'do',   third: false },
  { s: 'You',          l: 'you',          be: 'are', bp: 'were', have: 'have', do: 'do',   third: false },
  { s: 'He',           l: 'he',           be: 'is',  bp: 'was',  have: 'has',  do: 'does', third: true  },
  { s: 'She',          l: 'she',          be: 'is',  bp: 'was',  have: 'has',  do: 'does', third: true  },
  { s: 'We',           l: 'we',           be: 'are', bp: 'were', have: 'have', do: 'do',   third: false },
  { s: 'They',         l: 'they',         be: 'are', bp: 'were', have: 'have', do: 'do',   third: false },
  { s: 'Tom',          l: 'Tom',          be: 'is',  bp: 'was',  have: 'has',  do: 'does', third: true  },
  { s: 'Anna',         l: 'Anna',         be: 'is',  bp: 'was',  have: 'has',  do: 'does', third: true  },
  { s: 'My sister',    l: 'my sister',    be: 'is',  bp: 'was',  have: 'has',  do: 'does', third: true  },
  { s: 'The teacher',  l: 'the teacher',  be: 'is',  bp: 'was',  have: 'has',  do: 'does', third: true  },
  { s: 'The students', l: 'the students', be: 'are', bp: 'were', have: 'have', do: 'do',   third: false },
  { s: 'My parents',   l: 'my parents',   be: 'are', bp: 'were', have: 'have', do: 'do',   third: false }
];

/* ---------- คลังคำกริยา ----------
   b = V1, s = V1+s/es, p = V2, pp = V3, ing = V-ing, o = ส่วนขยาย, th = คำแปล
*/
const VERBS = [
  { b: 'eat',      s: 'eats',      p: 'ate',    pp: 'eaten',    ing: 'eating',     o: 'breakfast',      th: 'กิน' },
  { b: 'play',     s: 'plays',     p: 'played', pp: 'played',   ing: 'playing',    o: 'football',       th: 'เล่น' },
  { b: 'write',    s: 'writes',    p: 'wrote',  pp: 'written',  ing: 'writing',    o: 'a letter',       th: 'เขียน' },
  { b: 'read',     s: 'reads',     p: 'read',   pp: 'read',     ing: 'reading',    o: 'a book',         th: 'อ่าน' },
  { b: 'watch',    s: 'watches',   p: 'watched',pp: 'watched',  ing: 'watching',   o: 'a movie',        th: 'ดู' },
  { b: 'study',    s: 'studies',   p: 'studied',pp: 'studied',  ing: 'studying',   o: 'English',        th: 'เรียน' },
  { b: 'clean',    s: 'cleans',    p: 'cleaned',pp: 'cleaned',  ing: 'cleaning',   o: 'the kitchen',    th: 'ทำความสะอาด' },
  { b: 'drink',    s: 'drinks',    p: 'drank',  pp: 'drunk',    ing: 'drinking',   o: 'coffee',         th: 'ดื่ม' },
  { b: 'buy',      s: 'buys',      p: 'bought', pp: 'bought',   ing: 'buying',     o: 'a new bag',      th: 'ซื้อ' },
  { b: 'cook',     s: 'cooks',     p: 'cooked', pp: 'cooked',   ing: 'cooking',    o: 'dinner',         th: 'ทำอาหาร' },
  { b: 'finish',   s: 'finishes',  p: 'finished',pp:'finished', ing: 'finishing',  o: 'the report',     th: 'ทำเสร็จ' },
  { b: 'send',     s: 'sends',     p: 'sent',   pp: 'sent',     ing: 'sending',    o: 'an email',       th: 'ส่ง' },
  { b: 'take',     s: 'takes',     p: 'took',   pp: 'taken',    ing: 'taking',     o: 'photos',         th: 'ถ่าย/หยิบ' },
  { b: 'wash',     s: 'washes',    p: 'washed', pp: 'washed',   ing: 'washing',    o: 'the dishes',     th: 'ล้าง' },
  { b: 'visit',    s: 'visits',    p: 'visited',pp: 'visited',  ing: 'visiting',   o: 'the museum',     th: 'ไปเยี่ยม' },
  { b: 'teach',    s: 'teaches',   p: 'taught', pp: 'taught',   ing: 'teaching',   o: 'math',           th: 'สอน' },
  { b: 'build',    s: 'builds',    p: 'built',  pp: 'built',    ing: 'building',   o: 'a website',      th: 'สร้าง' },
  { b: 'fix',      s: 'fixes',     p: 'fixed',  pp: 'fixed',    ing: 'fixing',     o: 'the car',        th: 'ซ่อม' },
  { b: 'paint',    s: 'paints',    p: 'painted',pp: 'painted',  ing: 'painting',   o: 'the wall',       th: 'ทาสี' },
  { b: 'listen',   s: 'listens',   p: 'listened',pp:'listened', ing: 'listening',  o: 'to music',       th: 'ฟัง' },
  { b: 'run',      s: 'runs',      p: 'ran',    pp: 'run',      ing: 'running',    o: 'in the park',    th: 'วิ่ง' },
  { b: 'call',     s: 'calls',     p: 'called', pp: 'called',   ing: 'calling',    o: 'the doctor',     th: 'โทรหา' },
  { b: 'open',     s: 'opens',     p: 'opened', pp: 'opened',   ing: 'opening',    o: 'the window',     th: 'เปิด' },
  { b: 'practice', s: 'practices', p: 'practiced',pp:'practiced',ing:'practicing', o: 'the piano',      th: 'ฝึกซ้อม' },
  { b: 'draw',     s: 'draws',     p: 'drew',   pp: 'drawn',    ing: 'drawing',    o: 'a picture',      th: 'วาด' },
  { b: 'speak',    s: 'speaks',    p: 'spoke',  pp: 'spoken',   ing: 'speaking',   o: 'French',         th: 'พูด' },
  { b: 'drive',    s: 'drives',    p: 'drove',  pp: 'driven',   ing: 'driving',    o: 'to work',        th: 'ขับรถ' },
  { b: 'wait',     s: 'waits',     p: 'waited', pp: 'waited',   ing: 'waiting',    o: 'for the bus',    th: 'รอ' },
  { b: 'help',     s: 'helps',     p: 'helped', pp: 'helped',   ing: 'helping',    o: 'the new student',th: 'ช่วยเหลือ' }
];

/* ---------- 12 Tenses ----------
   marks = จุด/แท่งบนเส้นเวลา (0 = อดีตไกล, 50 = ตอนนี้, 100 = อนาคตไกล)
   foes  = tense ที่ใช้เป็นตัวเลือกลวง (เลือกมาแล้วว่าไม่กำกวมกับข้อนั้น)
*/
const TENSES = [
  {
    id: 'pres-simple',
    name: 'Present Simple',
    th: 'ปัจจุบันกาลธรรมดา',
    group: 'Present',
    formula: { aff: 'S + V1 (+s/es)', neg: 'S + do/does + not + V1', q: 'Do/Does + S + V1 ?' },
    uses: [
      'ความจริงทั่วไป ที่เป็นจริงเสมอ — The sun rises in the east.',
      'กิจวัตร สิ่งที่ทำเป็นประจำ — I go to work at 8.',
      'ตารางเวลา เวลาเดินรถ/เที่ยวบิน — The train leaves at 6 p.m.'
    ],
    markers: ['every day', 'every morning', 'twice a week', 'on Mondays', 'usually'],
    marks: [{ type: 'dots' }],
    foes: ['pres-cont', 'past-simple', 'fut-simple', 'pres-perf'],
    contrast: [
      {
        vs: 'pres-cont',
        point: 'ทำเป็นประจำ / เป็นจริงเสมอ → Present Simple · กำลังทำอยู่ตอนนี้ (ชั่วคราว) → Present Continuous',
        mine: 'She drinks coffee every morning.',
        theirs: 'She is drinking coffee right now.'
      }
    ],
    mistakes: [
      'ลืมเติม s/es กับประธานเอกพจน์บุรุษที่ 3 — He <b>go</b> ✗ / He <b>goes</b> ✓',
      'ในประโยคปฏิเสธ/คำถาม ที่มี do/does แล้ว กริยาต้องเป็น V1 เสมอ — She doesn\'t <b>goes</b> ✗ / doesn\'t <b>go</b> ✓'
    ],
    examples: [
      { en: 'She drinks coffee every morning.', th: 'เธอดื่มกาแฟทุกเช้า' },
      { en: 'They do not play football on Mondays.', th: 'พวกเขาไม่เล่นฟุตบอลวันจันทร์' },
      { en: 'Does Tom study English every day?', th: 'ทอมเรียนภาษาอังกฤษทุกวันไหม' }
    ]
  },
  {
    id: 'pres-cont',
    name: 'Present Continuous',
    th: 'ปัจจุบันกาลกำลังกระทำ',
    group: 'Present',
    formula: { aff: 'S + is/am/are + V-ing', neg: 'S + is/am/are + not + V-ing', q: 'Is/Am/Are + S + V-ing ?' },
    uses: [
      'กำลังทำอยู่ ณ ขณะที่พูด — I am reading now.',
      'ช่วงนี้ (ชั่วคราว ไม่ถาวร) — She is living in Tokyo this year.',
      'แผนอนาคตอันใกล้ที่นัดไว้แล้ว — We are meeting John tomorrow.'
    ],
    markers: ['right now', 'at the moment', 'now', 'today'],
    marks: [{ type: 'bar', from: 42, to: 58 }],
    foes: ['pres-simple', 'past-simple', 'fut-simple', 'past-cont'],
    contrast: [
      {
        vs: 'pres-simple',
        point: 'ช่วงนี้เท่านั้น ไม่ถาวร → Present Continuous · เป็นแบบนี้ตลอด เป็นกิจวัตร → Present Simple',
        mine: 'I am living in Bangkok this year.',
        theirs: 'I live in Bangkok.'
      }
    ],
    mistakes: [
      'ลืม verb to be — She <b>reading</b> ✗ / She <b>is reading</b> ✓',
      'กริยาบอกสภาวะ (know, want, like, need) ไม่นิยมใช้รูป -ing — I <b>am knowing</b> ✗ / I <b>know</b> ✓'
    ],
    examples: [
      { en: 'He is washing the dishes right now.', th: 'ตอนนี้เขากำลังล้างจาน' },
      { en: 'We are not watching a movie at the moment.', th: 'ตอนนี้เราไม่ได้กำลังดูหนัง' },
      { en: 'Are the students studying English now?', th: 'ตอนนี้นักเรียนกำลังเรียนภาษาอังกฤษอยู่ไหม' }
    ]
  },
  {
    id: 'pres-perf',
    name: 'Present Perfect',
    th: 'ปัจจุบันกาลสมบูรณ์',
    group: 'Present',
    formula: { aff: 'S + has/have + V3', neg: 'S + has/have + not + V3', q: 'Has/Have + S + V3 ?' },
    uses: [
      'เกิดในอดีต แต่ผลยังส่งถึงปัจจุบัน — I have lost my key. (ตอนนี้ยังหาไม่เจอ)',
      'ประสบการณ์ (ไม่ระบุว่าเมื่อไร) — She has been to Japan.',
      'เพิ่งเสร็จสิ้น — They have just finished the report.'
    ],
    markers: ['already', 'so far', 'this week', 'recently', 'twice this month'],
    marks: [{ type: 'bar', from: 18, to: 50 }, { type: 'dot', at: 50 }],
    foes: ['pres-simple', 'past-cont', 'fut-simple', 'past-perf'],
    contrast: [
      {
        vs: 'past-simple',
        point: 'ไม่ระบุเวลา เน้นผลที่ยังอยู่ถึงตอนนี้ → Present Perfect · มีเวลาที่จบไปแล้วระบุชัด (yesterday, last week, ago) → Past Simple',
        mine: 'I have lost my key.',
        theirs: 'I lost my key yesterday.'
      },
      {
        vs: 'pres-perf-cont',
        point: 'เน้นว่า "เสร็จแล้ว ได้ผลเท่าไร" → Present Perfect · เน้นว่า "ทำมานานแค่ไหน" และอาจยังทำอยู่ → Present Perfect Continuous',
        mine: 'I have written three letters.',
        theirs: 'I have been writing letters all morning.'
      }
    ],
    mistakes: [
      'ห้ามใช้คู่กับเวลาที่จบไปแล้วชัดเจน — I have seen him <b>yesterday</b> ✗ / I <b>saw</b> him yesterday ✓',
      'ใช้ V2 แทน V3 — She has <b>ate</b> ✗ / She has <b>eaten</b> ✓'
    ],
    examples: [
      { en: 'Anna has finished the report already.', th: 'แอนนาทำรายงานเสร็จแล้ว' },
      { en: 'I have not read a book this week.', th: 'สัปดาห์นี้ฉันยังไม่ได้อ่านหนังสือเลย' },
      { en: 'Have they visited the museum recently?', th: 'ช่วงนี้พวกเขาได้ไปพิพิธภัณฑ์มาบ้างไหม' }
    ]
  },
  {
    id: 'pres-perf-cont',
    name: 'Present Perfect Continuous',
    th: 'ปัจจุบันกาลสมบูรณ์กำลังกระทำ',
    group: 'Present',
    formula: { aff: 'S + has/have + been + V-ing', neg: 'S + has/have + not + been + V-ing', q: 'Has/Have + S + been + V-ing ?' },
    uses: [
      'ทำต่อเนื่องจากอดีตถึงตอนนี้ และยังทำอยู่ — I have been working here for 5 years.',
      'เน้น "ระยะเวลา" ที่ทำ ไม่ใช่ผลลัพธ์ — She has been studying all day.',
      'อธิบายผลที่เห็นตอนนี้ — He is tired. He has been running.'
    ],
    markers: ['for two hours', 'since this morning', 'all day', 'all morning'],
    marks: [{ type: 'bar', from: 12, to: 52, hatch: true }],
    foes: ['pres-simple', 'past-simple', 'fut-simple', 'pres-cont'],
    contrast: [
      {
        vs: 'pres-perf',
        point: 'เน้นระยะเวลาที่ทำต่อเนื่องและยังทำอยู่ → Present Perfect Continuous · เน้นผลลัพธ์ที่เสร็จแล้ว → Present Perfect',
        mine: 'She has been cleaning the kitchen for two hours.',
        theirs: 'She has cleaned the kitchen.'
      },
      {
        vs: 'pres-cont',
        point: 'เริ่มมาตั้งแต่อดีตจนนับระยะเวลาได้ → has/have been + V-ing · แค่กำลังทำอยู่ตอนนี้ ไม่นับระยะเวลา → is/am/are + V-ing',
        mine: 'He has been waiting for an hour.',
        theirs: 'He is waiting now.'
      }
    ],
    mistakes: [
      'ลืม been — She has <b>studying</b> ✗ / She has <b>been studying</b> ✓',
      'สับสน for กับ since — for + ช่วงเวลา (for 2 hours) / since + จุดเริ่ม (since 2020)'
    ],
    examples: [
      { en: 'They have been waiting for the bus for two hours.', th: 'พวกเขารอรถเมล์มาสองชั่วโมงแล้ว' },
      { en: 'She has not been practicing the piano all day.', th: 'เธอไม่ได้ซ้อมเปียโนมาทั้งวัน' },
      { en: 'Have you been cleaning the kitchen since this morning?', th: 'คุณทำความสะอาดครัวมาตั้งแต่เช้าเลยหรือ' }
    ]
  },
  {
    id: 'past-simple',
    name: 'Past Simple',
    th: 'อดีตกาลธรรมดา',
    group: 'Past',
    formula: { aff: 'S + V2', neg: 'S + did + not + V1', q: 'Did + S + V1 ?' },
    uses: [
      'เหตุการณ์ที่จบไปแล้วในอดีต มีเวลากำกับชัดเจน — I met him yesterday.',
      'เล่าเรื่องเรียงลำดับในอดีต — She woke up, ate breakfast, and left.',
      'สิ่งที่เคยเป็นแต่ตอนนี้ไม่ใช่แล้ว — He worked in Bangkok in 2015.'
    ],
    markers: ['yesterday', 'last night', 'two days ago', 'last weekend'],
    marks: [{ type: 'dot', at: 25 }],
    foes: ['pres-simple', 'pres-cont', 'fut-simple', 'pres-perf-cont'],
    contrast: [
      {
        vs: 'pres-perf',
        point: 'จบไปแล้วพร้อมเวลาที่ระบุชัด → Past Simple · ยังส่งผลถึงตอนนี้ ไม่ระบุเวลา → Present Perfect',
        mine: 'I saw that movie last night.',
        theirs: 'I have seen that movie.'
      },
      {
        vs: 'past-cont',
        point: 'เหตุการณ์สั้นที่เกิดแล้วจบ (ตัวแทรก) → Past Simple · เหตุการณ์ยาวที่กำลังดำเนินอยู่ตอนนั้น (ฉากหลัง) → Past Continuous',
        mine: 'The phone rang at 8 p.m.',
        theirs: 'I was cooking at 8 p.m.'
      }
    ],
    mistakes: [
      'ใช้ did แล้วยังผัน V2 ซ้ำ — She didn\'t <b>went</b> ✗ / didn\'t <b>go</b> ✓',
      'กริยาอปกติจำผิด — I <b>buyed</b> ✗ / I <b>bought</b> ✓'
    ],
    examples: [
      { en: 'My sister bought a new bag yesterday.', th: 'เมื่อวานพี่สาวฉันซื้อกระเป๋าใบใหม่' },
      { en: 'We did not cook dinner last night.', th: 'เมื่อคืนเราไม่ได้ทำอาหารเย็น' },
      { en: 'Did Tom send an email two days ago?', th: 'ทอมส่งอีเมลไปเมื่อสองวันก่อนไหม' }
    ]
  },
  {
    id: 'past-cont',
    name: 'Past Continuous',
    th: 'อดีตกาลกำลังกระทำ',
    group: 'Past',
    formula: { aff: 'S + was/were + V-ing', neg: 'S + was/were + not + V-ing', q: 'Was/Were + S + V-ing ?' },
    uses: [
      'กำลังทำอยู่ ณ เวลาหนึ่งในอดีต — At 8 p.m. I was studying.',
      'เหตุการณ์ยาวที่ถูกเหตุการณ์สั้นขัด — I was cooking when he called.',
      'สองเหตุการณ์เกิดพร้อมกันในอดีต — She was reading while he was cooking.'
    ],
    markers: ['at 8 o\'clock last night', 'when I called', 'at that moment', 'all evening yesterday'],
    marks: [{ type: 'bar', from: 16, to: 36 }],
    foes: ['pres-cont', 'pres-simple', 'fut-simple', 'pres-perf'],
    contrast: [
      {
        vs: 'past-simple',
        point: 'ฉากหลังที่กำลังทำอยู่ตอนนั้น → Past Continuous · ตัวแทรกสั้น ๆ ที่เข้ามาขัด → Past Simple (รวมกันเป็น "I was cooking when the phone rang.")',
        mine: 'I was cooking dinner.',
        theirs: 'The phone rang.'
      }
    ],
    mistakes: [
      'ใช้ was กับ we/they — They <b>was</b> playing ✗ / They <b>were</b> playing ✓',
      'สลับกับ Past Simple: เหตุการณ์สั้นที่มาขัดใช้ Past Simple — When he <b>was calling</b>, I was cooking ✗'
    ],
    examples: [
      { en: 'I was cooking dinner when I called.', th: 'ฉันกำลังทำอาหารเย็นตอนที่โทรไป' },
      { en: 'They were not playing football at that moment.', th: 'ตอนนั้นพวกเขาไม่ได้กำลังเล่นฟุตบอล' },
      { en: 'Was she watching a movie at 8 o\'clock last night?', th: 'เมื่อคืนสองทุ่มเธอกำลังดูหนังอยู่ไหม' }
    ]
  },
  {
    id: 'past-perf',
    name: 'Past Perfect',
    th: 'อดีตกาลสมบูรณ์',
    group: 'Past',
    formula: { aff: 'S + had + V3', neg: 'S + had + not + V3', q: 'Had + S + V3 ?' },
    uses: [
      'เกิดขึ้น "ก่อน" อีกเหตุการณ์ในอดีต — อดีตซ้อนอดีต',
      'เน้นว่าเสร็จแล้วก่อนถึงเวลาหนึ่งในอดีต — By 9 p.m. she had left.',
      'ใช้กับประโยคเงื่อนไขแบบที่ 3 — If I had known, I would have come.'
    ],
    markers: ['before the meeting started', 'before we arrived', 'by the time I got home'],
    marks: [{ type: 'dot', at: 14, label: 'ก่อน' }, { type: 'dot', at: 34, label: 'หลัง' }],
    foes: ['past-simple', 'pres-perf', 'pres-simple', 'fut-simple'],
    contrast: [
      {
        vs: 'past-simple',
        point: 'เหตุการณ์ที่เกิด "ก่อน" อีกเหตุการณ์ในอดีต → Past Perfect · เหตุการณ์ที่เกิดทีหลัง → Past Simple (ห้ามใช้ had ทั้งคู่)',
        mine: 'She had left the office.',
        theirs: 'I arrived at nine.'
      },
      {
        vs: 'pres-perf',
        point: 'จุดอ้างอิงอยู่ในอดีต → had + V3 ทุกประธาน · จุดอ้างอิงคือตอนนี้ → has/have + V3',
        mine: 'By 2020 he had finished school.',
        theirs: 'He has finished school.'
      }
    ],
    mistakes: [
      'ใช้ Past Perfect ทั้งสองเหตุการณ์ — เหตุการณ์ที่เกิดทีหลังใช้ Past Simple',
      'ใช้ has/have แทน had — เมื่อพูดถึงอดีตต้องใช้ <b>had</b> เสมอทุกประธาน'
    ],
    examples: [
      { en: 'She had finished the report by the time I got home.', th: 'เธอทำรายงานเสร็จก่อนที่ฉันจะถึงบ้าน' },
      { en: 'We had not eaten breakfast before we arrived.', th: 'เรายังไม่ได้กินข้าวเช้าก่อนที่เราจะมาถึง' },
      { en: 'Had he sent an email before the meeting started?', th: 'เขาส่งอีเมลไปก่อนประชุมเริ่มหรือเปล่า' }
    ]
  },
  {
    id: 'past-perf-cont',
    name: 'Past Perfect Continuous',
    th: 'อดีตกาลสมบูรณ์กำลังกระทำ',
    group: 'Past',
    formula: { aff: 'S + had + been + V-ing', neg: 'S + had + not + been + V-ing', q: 'Had + S + been + V-ing ?' },
    uses: [
      'ทำต่อเนื่องมาระยะหนึ่ง ก่อนอีกเหตุการณ์ในอดีต',
      'เน้นระยะเวลาที่ทำก่อนจุดหนึ่งในอดีต — He had been working for 3 hours before lunch.',
      'อธิบายสาเหตุของสิ่งที่เกิดในอดีต — She was tired because she had been running.'
    ],
    markers: ['for two hours before I arrived', 'since morning before the class began', 'for a long time before we met'],
    marks: [{ type: 'bar', from: 8, to: 30, hatch: true }, { type: 'dot', at: 38 }],
    foes: ['past-simple', 'pres-perf-cont', 'pres-simple', 'fut-simple'],
    contrast: [
      {
        vs: 'pres-perf-cont',
        point: 'นับระยะเวลาถึงจุดหนึ่งใน "อดีต" → had been + V-ing · นับถึง "ตอนนี้" → has/have been + V-ing',
        mine: 'He had been working here for five years before he quit.',
        theirs: 'He has been working here for five years.'
      },
      {
        vs: 'past-cont',
        point: 'เน้นระยะเวลาที่สะสมมาก่อนหน้านั้น → had been + V-ing · แค่กำลังทำอยู่ ณ ตอนนั้น → was/were + V-ing',
        mine: 'She had been studying for three hours before dinner.',
        theirs: 'She was studying at seven.'
      }
    ],
    mistakes: [
      'ลืม been — He had <b>working</b> ✗ / He had <b>been working</b> ✓',
      'สับสนกับ Present Perfect Continuous — ถ้าจุดอ้างอิงอยู่ในอดีต ต้องใช้ <b>had</b> ไม่ใช่ has/have'
    ],
    examples: [
      { en: 'They had been waiting for the bus for two hours before I arrived.', th: 'พวกเขารอรถเมล์มาสองชั่วโมงก่อนที่ฉันจะมาถึง' },
      { en: 'She had not been studying English for a long time before we met.', th: 'เธอไม่ได้เรียนภาษาอังกฤษมานานก่อนที่เราจะเจอกัน' },
      { en: 'Had he been painting the wall since morning before the class began?', th: 'เขาทาสีผนังมาตั้งแต่เช้าก่อนคลาสเริ่มหรือเปล่า' }
    ]
  },
  {
    id: 'fut-simple',
    name: 'Future Simple',
    th: 'อนาคตกาลธรรมดา',
    group: 'Future',
    formula: { aff: 'S + will + V1', neg: 'S + will + not + V1', q: 'Will + S + V1 ?' },
    uses: [
      'ตัดสินใจ ณ ตอนที่พูด — I will help you.',
      'คาดการณ์อนาคต — It will rain tomorrow.',
      'สัญญา / เสนอตัว — I will call you tonight.'
    ],
    markers: ['tomorrow', 'next week', 'next month', 'tonight'],
    marks: [{ type: 'dot', at: 75 }],
    foes: ['pres-simple', 'past-simple', 'pres-cont', 'pres-perf'],
    contrast: [
      {
        vs: 'fut-cont',
        point: 'จะทำ (มองทั้งเหตุการณ์) → will + V1 · จะกำลังทำอยู่ ณ เวลานั้นพอดี → will be + V-ing',
        mine: 'I will call you tonight.',
        theirs: 'I will be driving at 8 tonight.'
      },
      {
        vs: 'pres-cont',
        point: 'เพิ่งตัดสินใจ ณ ตอนที่พูด → will · นัดหมายไว้เรียบร้อยแล้ว → is/am/are + V-ing',
        mine: 'I will help you.',
        theirs: 'I am meeting John tomorrow.'
      }
    ],
    mistakes: [
      'ใส่ to หลัง will — I will <b>to go</b> ✗ / I will <b>go</b> ✓',
      'เติม s หลัง will — She will <b>goes</b> ✗ / She will <b>go</b> ✓ (หลัง will ใช้ V1 เสมอ)'
    ],
    examples: [
      { en: 'I will call the doctor tomorrow.', th: 'พรุ่งนี้ฉันจะโทรหาหมอ' },
      { en: 'He will not drive to work next week.', th: 'สัปดาห์หน้าเขาจะไม่ขับรถไปทำงาน' },
      { en: 'Will they build a website next month?', th: 'เดือนหน้าพวกเขาจะสร้างเว็บไซต์ไหม' }
    ]
  },
  {
    id: 'fut-cont',
    name: 'Future Continuous',
    th: 'อนาคตกาลกำลังกระทำ',
    group: 'Future',
    formula: { aff: 'S + will + be + V-ing', neg: 'S + will + not + be + V-ing', q: 'Will + S + be + V-ing ?' },
    uses: [
      'จะกำลังทำอยู่ ณ เวลาหนึ่งในอนาคต — At 9 a.m. tomorrow I will be flying.',
      'เหตุการณ์ที่คาดว่าจะดำเนินอยู่ตามปกติ — He will be working as usual.',
      'ถามอย่างสุภาพว่าอีกฝ่ายมีแผนไหม — Will you be using the car tonight?'
    ],
    markers: ['at 9 o\'clock tomorrow', 'this time tomorrow', 'at noon tomorrow'],
    marks: [{ type: 'bar', from: 66, to: 86 }],
    foes: ['fut-simple', 'pres-cont', 'past-cont', 'pres-simple'],
    contrast: [
      {
        vs: 'fut-simple',
        point: 'จะกำลังทำค้างอยู่ ณ จุดเวลานั้น → will be + V-ing · จะทำ (ทั้งเหตุการณ์) → will + V1',
        mine: 'At 9 tomorrow I will be teaching.',
        theirs: 'Tomorrow I will teach three classes.'
      },
      {
        vs: 'fut-perf',
        point: 'ตอนนั้นยังทำอยู่ (ยังไม่เสร็จ) → will be + V-ing · ตอนนั้นเสร็จไปแล้ว → will have + V3',
        mine: 'At 5 p.m. I will be writing the report.',
        theirs: 'By 5 p.m. I will have written the report.'
      }
    ],
    mistakes: [
      'ลืม be — She will <b>working</b> ✗ / She will <b>be working</b> ✓',
      'ใช้ V-ing หลัง will โดยไม่มี be — โครงสร้างต้องครบ will + be + V-ing'
    ],
    examples: [
      { en: 'She will be teaching math at 9 o\'clock tomorrow.', th: 'พรุ่งนี้เก้าโมงเธอจะกำลังสอนคณิตศาสตร์อยู่' },
      { en: 'We will not be watching a movie this time tomorrow.', th: 'เวลานี้ของพรุ่งนี้เราจะไม่ได้กำลังดูหนัง' },
      { en: 'Will you be waiting for the bus at noon tomorrow?', th: 'เที่ยงวันพรุ่งนี้คุณจะกำลังรอรถเมล์อยู่ไหม' }
    ]
  },
  {
    id: 'fut-perf',
    name: 'Future Perfect',
    th: 'อนาคตกาลสมบูรณ์',
    group: 'Future',
    formula: { aff: 'S + will + have + V3', neg: 'S + will + not + have + V3', q: 'Will + S + have + V3 ?' },
    uses: [
      'จะเสร็จสิ้นก่อนถึงเวลาหนึ่งในอนาคต — I will have finished it by Friday.',
      'มักมาคู่กับ by + เวลาในอนาคต',
      'คาดคะเนว่าถึงตอนนั้นน่าจะเสร็จแล้ว'
    ],
    markers: ['by next Friday', 'by the end of this year', 'by then'],
    marks: [{ type: 'bar', from: 55, to: 78 }, { type: 'dot', at: 78, label: 'เส้นตาย' }],
    foes: ['fut-simple', 'pres-perf', 'past-perf', 'pres-simple'],
    contrast: [
      {
        vs: 'fut-simple',
        point: 'เสร็จ "ก่อน" ถึงเวลาที่กำหนด (คู่กับ by) → will have + V3 · แค่จะเกิดขึ้นตอนนั้น → will + V1',
        mine: 'I will have finished it by Friday.',
        theirs: 'I will finish it on Friday.'
      },
      {
        vs: 'fut-perf-cont',
        point: 'เน้นว่า "เสร็จแล้ว" → will have + V3 · เน้นว่า "ทำมาครบกี่ปี/กี่ชั่วโมง" → will have been + V-ing',
        mine: 'By June I will have finished the course.',
        theirs: 'By June I will have been studying for five years.'
      }
    ],
    mistakes: [
      'ใช้ has/have แทน have หลัง will — will <b>has</b> ✗ / will <b>have</b> ✓ (หลัง will ไม่ผัน)',
      'ใช้ V2 แทน V3 — will have <b>wrote</b> ✗ / will have <b>written</b> ✓'
    ],
    examples: [
      { en: 'He will have finished the report by next Friday.', th: 'ศุกร์หน้าเขาจะทำรายงานเสร็จแล้ว' },
      { en: 'They will not have built a website by then.', th: 'ถึงตอนนั้นพวกเขาคงยังสร้างเว็บไซต์ไม่เสร็จ' },
      { en: 'Will she have painted the wall by the end of this year?', th: 'สิ้นปีนี้เธอจะทาสีผนังเสร็จไหม' }
    ]
  },
  {
    id: 'fut-perf-cont',
    name: 'Future Perfect Continuous',
    th: 'อนาคตกาลสมบูรณ์กำลังกระทำ',
    group: 'Future',
    formula: { aff: 'S + will + have + been + V-ing', neg: 'S + will + not + have + been + V-ing', q: 'Will + S + have + been + V-ing ?' },
    uses: [
      'จะทำต่อเนื่องครบระยะเวลาหนึ่ง ณ จุดหนึ่งในอนาคต',
      'เน้น "ระยะเวลารวม" ที่จะสะสมได้ — By June I will have been working here for 5 years.',
      'มักมาคู่กับ for + ระยะเวลา + by + จุดเวลาในอนาคต'
    ],
    markers: ['for five years by next month', 'for two hours by then', 'for ten years by next June'],
    marks: [{ type: 'bar', from: 45, to: 82, hatch: true }, { type: 'dot', at: 82 }],
    foes: ['fut-perf', 'fut-cont', 'pres-perf-cont', 'fut-simple'],
    contrast: [
      {
        vs: 'fut-perf',
        point: 'เน้น "ครบกี่ชั่วโมง/กี่ปี" ณ จุดนั้น → will have been + V-ing · เน้น "เสร็จแล้ว" → will have + V3',
        mine: 'By next month I will have been working here for five years.',
        theirs: 'By next month I will have finished the project.'
      },
      {
        vs: 'fut-cont',
        point: 'นับระยะเวลาที่สะสมมาถึงจุดนั้น → will have been + V-ing · แค่กำลังทำอยู่ตอนนั้น ไม่นับระยะเวลา → will be + V-ing',
        mine: 'At noon I will have been driving for six hours.',
        theirs: 'At noon I will be driving.'
      }
    ],
    mistakes: [
      'ลืม been — will have <b>working</b> ✗ / will have <b>been working</b> ✓',
      'เรียงลำดับผิด — ต้องเป็น will + have + been + V-ing เท่านั้น'
    ],
    examples: [
      { en: 'I will have been studying English for five years by next month.', th: 'เดือนหน้าฉันจะเรียนภาษาอังกฤษครบห้าปีแล้ว' },
      { en: 'She will not have been waiting for the bus for two hours by then.', th: 'ถึงตอนนั้นเธอคงยังรอรถเมล์ไม่ครบสองชั่วโมง' },
      { en: 'Will they have been building a website for ten years by next June?', th: 'มิถุนายนหน้าพวกเขาจะสร้างเว็บไซต์มาครบสิบปีไหม' }
    ]
  }
];

const TENSE_BY_ID = Object.fromEntries(TENSES.map(t => [t.id, t]));

/* ---------- คำบอกเวลา: ค้นหาย้อนกลับ ----------
   ในข้อสอบจริงเราเห็น "คำ" ก่อน แล้วต้องเดา tense ให้ออก
   ตารางนี้จึงเรียงจากคำ → tense ตรงข้ามกับ markers ที่เรียงจาก tense → คำ
*/
const SIGNAL_WORDS = [
  { w: 'every day / every morning / twice a week', ids: ['pres-simple'], note: 'ความถี่ที่ทำเป็นประจำ' },
  { w: 'usually / always / often / sometimes / never', ids: ['pres-simple'], note: 'คำบอกความถี่ วางหน้ากริยาแท้' },
  { w: 'on Mondays / at weekends', ids: ['pres-simple'], note: 'ทำซ้ำทุกสัปดาห์ ไม่ใช่ครั้งเดียว' },
  { w: 'right now / at the moment / now', ids: ['pres-cont'], note: 'ณ วินาทีที่กำลังพูด' },
  { w: 'Look! / Listen!', ids: ['pres-cont'], note: 'ชี้ให้ดูสิ่งที่กำลังเกิดตรงหน้า' },
  { w: 'this year / these days', ids: ['pres-cont'], note: 'ช่วงนี้ ชั่วคราว ไม่ถาวร' },
  { w: 'already / just / yet', ids: ['pres-perf'], note: 'yet ใช้ในประโยคปฏิเสธและคำถามเท่านั้น' },
  { w: 'ever / never', ids: ['pres-perf'], note: 'ถามหรือเล่าประสบการณ์ โดยไม่ระบุว่าเมื่อไร' },
  { w: 'so far / up to now / recently', ids: ['pres-perf'], note: 'นับจากอดีตมาถึงตอนนี้' },
  { w: 'this week / this month (ที่ยังไม่จบ)', ids: ['pres-perf'], note: 'ช่วงเวลาที่ยังดำเนินอยู่' },
  { w: 'since + จุดเริ่มต้น', ids: ['pres-perf', 'pres-perf-cont'], note: 'since 2020 / since Monday — บอกจุดเริ่ม ไม่ใช่ความยาว' },
  { w: 'for + ความยาวเวลา', ids: ['pres-perf', 'pres-perf-cont', 'past-perf-cont', 'fut-perf-cont'], note: 'for two hours / for five years — บอกว่านานเท่าไร' },
  { w: 'all day / all morning', ids: ['pres-perf-cont'], note: 'เน้นว่าทำต่อเนื่องมาตลอด' },
  { w: 'How long ...?', ids: ['pres-perf-cont', 'pres-perf'], note: 'ถามระยะเวลา มักตอบด้วย for หรือ since' },
  { w: 'yesterday / last night / last week', ids: ['past-simple'], note: 'เวลาที่จบไปแล้วชัดเจน' },
  { w: '... ago (two days ago)', ids: ['past-simple'], note: 'ago คู่กับ Past Simple เท่านั้น ห้ามใช้กับ Present Perfect' },
  { w: 'in 2015 / when I was young', ids: ['past-simple'], note: 'จุดเวลาในอดีตที่ผ่านพ้นไปแล้ว' },
  { w: 'while / as', ids: ['past-cont'], note: 'while + กำลังทำอยู่ (was/were V-ing)' },
  { w: 'when + Past Simple', ids: ['past-cont', 'past-simple'], note: 'ตัวแทรกใช้ Past Simple · ฉากหลังใช้ Past Continuous' },
  { w: 'at 8 o\'clock last night / at that moment', ids: ['past-cont'], note: 'จุดเวลาที่เหตุการณ์กำลังดำเนินอยู่' },
  { w: 'before / after (ในอดีต)', ids: ['past-perf', 'past-simple'], note: 'เหตุการณ์ที่เกิดก่อนใช้ had + V3' },
  { w: 'by the time + Past Simple', ids: ['past-perf'], note: 'ถึงตอนนั้นเรื่องนั้นจบไปแล้ว' },
  { w: 'tomorrow / next week / tonight', ids: ['fut-simple'], note: 'จุดเวลาในอนาคต' },
  { w: 'I think / probably / maybe', ids: ['fut-simple'], note: 'คาดการณ์หรือตัดสินใจตอนที่พูด' },
  { w: 'this time tomorrow / at 9 tomorrow', ids: ['fut-cont'], note: 'ตอนนั้นจะยังทำค้างอยู่' },
  { w: 'by + เวลาในอนาคต (by Friday / by then)', ids: ['fut-perf', 'fut-perf-cont'], note: 'by = เส้นตาย ถึงตอนนั้นต้องเสร็จ' },
  { w: 'by ... + for ...', ids: ['fut-perf-cont'], note: 'ถึงตอนนั้นจะทำมาครบตามระยะเวลาที่ระบุ' }
];

/* คู่คำที่คนไทยสลับกันบ่อยที่สุด — แยกออกมาเน้นเป็นพิเศษ */
const SIGNAL_TRAPS = [
  {
    pair: 'since ↔ for',
    body: '<b>since</b> ตามด้วย <i>จุดเริ่มต้น</i> (since 2020, since Monday) · <b>for</b> ตามด้วย <i>ความยาวเวลา</i> (for two hours, for five years) — ทั้งคู่ใช้กับ Perfect ได้ทั้งหมด'
  },
  {
    pair: 'ago ↔ since / for',
    body: '<b>ago</b> ใช้กับ Past Simple เท่านั้น — I saw him <b>two days ago</b> ✓ / I have seen him two days ago ✗'
  },
  {
    pair: 'by ↔ until',
    body: '<b>by</b> = เสร็จภายในเวลานั้น (คู่กับ Future Perfect) · <b>until</b> = ทำต่อเนื่องไปจนถึงเวลานั้น — Finish it <b>by</b> 5. ≠ Wait <b>until</b> 5.'
  },
  {
    pair: 'yet ↔ already',
    body: '<b>already</b> ใช้ในประโยคบอกเล่า วางกลางประโยค · <b>yet</b> ใช้ในปฏิเสธและคำถาม วางท้ายประโยค — He has <b>already</b> left. / Has he left <b>yet</b>?'
  }
];
