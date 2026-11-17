# Lab 10 — ตัวอย่างสมบูรณ์ MongoDB Atlas + Express + React

เริ่มจาก [คู่มือภาษาไทยตั้งแต่ดู sample DB](../../labs/10-book-database-crud.md) มีโค้ดครบทุกขั้น ไม่มี TODO หรือ route 501 คำสั่งด้านล่างใช้ทบทวนหลังอ่านคู่มือ ไม่แทนขั้นตั้ง Atlas ในช่วง 1

## ลำดับคู่มือ

1. [Atlas account, database user, IP access list, URI และข้อมูลตัวอย่าง](../../docs/lab10/01-atlas-and-sample.md)
2. [อ่าน model/query ด้วยเครื่องดื่มสองรายการ](../../docs/lab10/02-drinks-walkthrough.md)
3. [ER ทั้งสามภาพ → reference และ embedded documents](../../docs/lab10-book-data-model.md)
4. [Book schema/store/API CRUD พร้อมคำอธิบายและ curl](../../docs/lab10/03-book-api-walkthrough.md)
5. [React ตั้งแต่เปิด terminal ถึงเพิ่ม/แก้/ลบและตรวจ Atlas](../../docs/lab10/04-react-and-checks.md)

ใช้ Node.js 22.12+ สำหรับทั้ง backend และ client จากโฟลเดอร์นี้ สร้าง .env จาก .env.example ถ้ายังไม่มี แล้วตั้ง URI จริงของ Cluster0 ของตน ห้ามคัดลอกทับ .env เดิม

```bash
npm ci
npm run db:check
npm run demo:seed
npm run demo:drinks
npm run demo:inspect
npm run seed
npm run seed
npm run dev
```

demo ใช้ฐาน **course_books_demo** ส่วน API ใช้ **course_books** บัญชี DB ต้องมีสิทธิ์ทั้งสองฐาน โค้ดตัวอย่างร้านเต็มใน demo ใช้สำหรับอ่าน model และความสัมพันธ์ ไม่ได้เปิด checkout API

เปิด terminal อีกหน้าจากโฟลเดอร์นี้:

```bash
cd client
npm ci
npm run dev
```

เปิด http://127.0.0.1:5174/ Express อยู่ port 3001 ถ้าเปลี่ยน PORT ให้แก้ target ใน client/vite.config.js ด้วย ทุก route ของ /api/books มีให้ครบ GET list/detail, POST, PATCH, DELETE แอปฝึกยังไม่มี login ให้ใช้กับเครื่องและฐานของตนตามคู่มือ

## Docker ทางเลือก

หากไม่ใช้ Atlas ให้เปิด Docker เปลี่ยน .env เป็น `MONGODB_URI=mongodb://127.0.0.1:27018/course_books` แล้ว `npm run db:up` เพื่อรอ healthy ก่อนทำคำสั่งด้านบน อ่านวิธีเปลี่ยน port/ตรวจ logs ในใบงาน หยุดด้วย `npm run db:stop` ไม่ใช้ down -v

## ตรวจโค้ด

```bash
npm test
npm run test:integration
```

integration ใช้ local MongoDB 127.0.0.1:27018 (เปลี่ยนด้วย LAB10_TEST_URI) สร้าง/ลบเฉพาะฐานชื่อสุ่ม course_books_lab10_test_* ไม่อ่าน .env ของผู้เรียน ตรวจ seed แบบคัดลอกแยกโฟลเดอร์, ไม่ทับข้อมูลเดิม, CRUD จริง และ POST/PATCH → restart process → GET เดิม

จาก client ใช้ `npm run build` ตรวจการสร้าง frontend
