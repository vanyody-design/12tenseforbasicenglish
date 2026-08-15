/* ===========================================================
   ตัวอย่างระบบ Login ด้วย Email + Password (Firebase Authentication)
   ใช้ Firebase Modular SDK (v9 ขึ้นไป) โหลดผ่าน ES Module จาก CDN
   =========================================================== */

import { firebaseConfig, SDK_VERSION, isConfigured } from './firebase-config.js';

const CDN = `https://www.gstatic.com/firebasejs/${SDK_VERSION}`;

const { initializeApp } = await import(`${CDN}/firebase-app.js`);
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} = await import(`${CDN}/firebase-auth.js`);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ให้ข้อความแจ้งเตือนของ Firebase เป็นภาษาไทยเท่าที่ระบบรองรับ */
auth.languageCode = 'th';

/* ---------- แปลรหัสข้อผิดพลาดของ Firebase เป็นภาษาคน ----------
   Firebase คืนมาเป็นรหัสอย่าง auth/invalid-credential ซึ่งเอาไปโชว์ตรง ๆ
   ผู้ใช้อ่านไม่รู้เรื่อง จึงต้องแมปเป็นข้อความที่บอกว่าต้องทำอะไรต่อ */
const ERROR_TH = {
  'auth/invalid-email': 'รูปแบบอีเมลไม่ถูกต้อง',
  'auth/missing-email': 'กรุณากรอกอีเมล',
  'auth/missing-password': 'กรุณากรอกรหัสผ่าน',
  'auth/weak-password': 'รหัสผ่านสั้นเกินไป ต้องมีอย่างน้อย 6 ตัวอักษร',
  'auth/email-already-in-use': 'อีเมลนี้ถูกใช้สมัครไปแล้ว ลองเข้าสู่ระบบแทน',
  'auth/invalid-credential': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  'auth/wrong-password': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  'auth/user-not-found': 'ไม่พบบัญชีนี้ในระบบ',
  'auth/user-disabled': 'บัญชีนี้ถูกระงับการใช้งาน',
  'auth/too-many-requests': 'ลองผิดหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่',
  'auth/network-request-failed': 'เชื่อมต่อเครือข่ายไม่สำเร็จ ตรวจสอบอินเทอร์เน็ต',
  'auth/operation-not-allowed': 'ยังไม่ได้เปิดใช้ Email/Password ใน Firebase Console',
  'auth/requires-recent-login': 'กรุณาเข้าสู่ระบบใหม่อีกครั้งก่อนทำรายการนี้',
  /* สองตัวนี้คือด่านแรกที่คนตั้งค่ายังไม่เสร็จจะเจอ ต้องบอกให้ชัดว่าไปแก้ตรงไหน */
  'auth/invalid-api-key': 'ค่า apiKey ใน firebase-config.js ไม่ถูกต้อง',
  'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
    'ค่า apiKey ใน firebase-config.js ยังไม่ถูกต้อง — คัดลอกค่าจริงจาก Firebase Console มาใส่ก่อน',
  'auth/configuration-not-found':
    'ยังไม่ได้เปิดใช้ Email/Password ใน Firebase Console (Authentication → Sign-in method)'
};

const messageOf = err => ERROR_TH[err?.code] || `เกิดข้อผิดพลาด: ${err?.code || err?.message || err}`;

/* ---------- ตัวช่วย DOM ---------- */
const $ = sel => document.querySelector(sel);
const show = (el, on) => el.classList.toggle('hidden', !on);

const banner = $('#banner');
let bannerTimer = null;

function notify(text, kind = 'info') {
  clearTimeout(bannerTimer);
  banner.textContent = text;
  banner.className = `banner ${kind}`;
  if (kind === 'ok') bannerTimer = setTimeout(() => banner.className = 'banner hidden', 6000);
}

/* ปิดปุ่มระหว่างรอผลจากเซิร์ฟเวอร์ กันผู้ใช้กดรัว */
async function withBusy(btn, fn) {
  const label = btn.textContent;
  btn.disabled = true;
  btn.dataset.busy = '1';
  btn.textContent = 'กำลังดำเนินการ...';
  try {
    await fn();
  } catch (err) {
    notify(messageOf(err), 'bad');
  } finally {
    btn.disabled = false;
    delete btn.dataset.busy;
    btn.textContent = label;
  }
}

/* ===========================================================
   สมัครสมาชิก
   =========================================================== */
async function signUp() {
  const name = $('#suName').value.trim();
  const email = $('#suEmail').value.trim();
  const pass = $('#suPass').value;
  const pass2 = $('#suPass2').value;

  if (pass !== pass2) return notify('รหัสผ่านทั้งสองช่องไม่ตรงกัน', 'bad');
  if (pass.length < 6) return notify('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', 'bad');

  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (name) await updateProfile(cred.user, { displayName: name });
  await sendEmailVerification(cred.user);
  notify('สมัครสำเร็จ ระบบส่งอีเมลยืนยันไปให้แล้ว กรุณาตรวจกล่องจดหมาย', 'ok');
}

/* ===========================================================
   เข้าสู่ระบบ
   =========================================================== */
async function signIn() {
  const email = $('#siEmail').value.trim();
  const pass = $('#siPass').value;
  const remember = $('#siRemember').checked;

  /* จำการเข้าสู่ระบบ = เก็บใน localStorage (ปิดเบราว์เซอร์แล้วยังอยู่)
     ไม่จำ = เก็บแค่ใน sessionStorage (ปิดแท็บแล้วหลุด) */
  await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  await signInWithEmailAndPassword(auth, email, pass);
  notify('เข้าสู่ระบบสำเร็จ', 'ok');
}

/* ===========================================================
   ลืมรหัสผ่าน
   =========================================================== */
async function resetPassword() {
  const email = $('#siEmail').value.trim();
  if (!email) return notify('กรอกอีเมลในช่องด้านบนก่อน แล้วกดลืมรหัสผ่านอีกครั้ง', 'bad');
  await sendPasswordResetEmail(auth, email);
  notify(`ส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่ ${email} แล้ว`, 'ok');
}

/* ===========================================================
   ส่งอีเมลยืนยันซ้ำ / ออกจากระบบ
   =========================================================== */
async function resendVerification() {
  if (!auth.currentUser) return;
  await sendEmailVerification(auth.currentUser);
  notify('ส่งอีเมลยืนยันใหม่แล้ว', 'ok');
}

async function doSignOut() {
  await signOut(auth);
  notify('ออกจากระบบแล้ว', 'info');
}

/* ===========================================================
   ตัวเฝ้าสถานะการล็อกอิน — หัวใจของระบบ
   ทำงานเองทุกครั้งที่ล็อกอิน ออกจากระบบ หรือเปิดหน้าเว็บใหม่
   จึงไม่ต้องเช็คสถานะเองในแต่ละหน้า
   =========================================================== */
onAuthStateChanged(auth, user => {
  show($('#authView'), !user);
  show($('#userView'), !!user);

  if (!user) return;

  $('#uName').textContent = user.displayName || '(ยังไม่ได้ตั้งชื่อ)';
  $('#uEmail').textContent = user.email;
  $('#uId').textContent = user.uid;

  const verified = user.emailVerified;
  $('#uVerified').textContent = verified ? 'ยืนยันอีเมลแล้ว' : 'ยังไม่ได้ยืนยันอีเมล';
  $('#uVerified').className = 'pill ' + (verified ? 'ok' : 'warn');
  show($('#resendBtn'), !verified);
});

/* ===========================================================
   ผูกปุ่มกับฟังก์ชัน
   =========================================================== */
$('#signUpBtn').onclick = e => withBusy(e.currentTarget, signUp);
$('#signInBtn').onclick = e => withBusy(e.currentTarget, signIn);
$('#resetBtn').onclick = e => withBusy(e.currentTarget, resetPassword);
$('#resendBtn').onclick = e => withBusy(e.currentTarget, resendVerification);
$('#signOutBtn').onclick = e => withBusy(e.currentTarget, doSignOut);

/* สลับแท็บ เข้าสู่ระบบ / สมัครสมาชิก */
document.querySelectorAll('[data-tab]').forEach(btn => {
  btn.onclick = () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('on', b === btn));
    show($('#signInPane'), tab === 'signin');
    show($('#signUpPane'), tab === 'signup');
    banner.className = 'banner hidden';
  };
});

/* ปุ่มดู/ซ่อนรหัสผ่าน */
document.querySelectorAll('[data-eye]').forEach(btn => {
  btn.onclick = () => {
    const input = $('#' + btn.dataset.eye);
    const showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    btn.textContent = showing ? 'ดู' : 'ซ่อน';
  };
});

/* กด Enter ในช่องกรอกให้ส่งฟอร์มที่กำลังใช้อยู่ */
document.querySelectorAll('input').forEach(inp => {
  inp.onkeydown = e => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const pane = inp.closest('.pane');
    const btn = pane && pane.querySelector('.btn.primary');
    if (btn && !btn.disabled) btn.click();
  };
});

/* บอกตัวเฝ้าใน index.html ว่าโมดูลเริ่มทำงานสำเร็จแล้ว */
window.__authBooted = true;

/* เตือนถ้ายังไม่ได้ใส่ค่า config จริง */
if (!isConfigured) {
  notify('ยังไม่ได้ใส่ค่าจริงใน firebase-config.js — ปุ่มต่าง ๆ จะยังใช้งานไม่ได้', 'warn');
}
