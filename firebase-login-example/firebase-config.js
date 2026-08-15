/* ===========================================================
   ไฟล์เดียวที่ต้องแก้ — เอาค่าจริงจาก Firebase Console มาใส่
   Project settings ⚙ → General → Your apps → Web app → SDK setup
   =========================================================== */

export const firebaseConfig = {
  apiKey: 'ใส่ค่าจริงตรงนี้',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project',
  storageBucket: 'your-project.firebasestorage.app',
  messagingSenderId: '000000000000',
  appId: '1:000000000000:web:xxxxxxxxxxxxxxxx'
};

/* เวอร์ชัน Firebase SDK ที่จะโหลดจาก CDN — แก้ที่เดียวใช้ทั้งโปรเจกต์ */
export const SDK_VERSION = '11.0.2';

/* ยังไม่ได้ใส่ค่าจริงหรือเปล่า ใช้เตือนบนหน้าเว็บ */
export const isConfigured = !firebaseConfig.apiKey.startsWith('ใส่ค่าจริง');
