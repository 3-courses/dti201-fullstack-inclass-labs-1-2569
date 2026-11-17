# Lab 10 — MongoDB Atlas starter

เริ่มที่ [ใบงาน Lab 10 ภาษาไทย](../../labs/10-book-database-crud.md) และ [คู่มือ data model ร้านหนังสือ](../../docs/lab10-book-data-model.md) ใช้ **Atlas Free Cluster0 ของตนเอง** เป็นหลัก Docker เป็นทางเลือก ไม่ต้องรันทั้งสองทาง

## 1. เตรียม backend นี้

ใช้ Node.js 20.6+ จากราก repo:

```bash
cd examples/10-mongodb-book-api
cp .env.example .env
npm ci
```

ถ้ามี `.env` แล้ว ให้แก้ไฟล์เดิม ไม่คัดลอกทับ สามารถคัดลอกโฟลเดอร์นี้ทั้งโฟลเดอร์ไป repo งานของตนได้ seed อยู่ใน `src/books.js` ไม่ต้องมีโฟลเดอร์ Lab 09 อยู่ข้าง ๆ

## 2. ตั้ง Atlas ก่อนรัน

เปิด Cluster0 → Connect → Drivers คัดลอก **hostname ของตน** ใส่ใน `.env` พร้อม database user/password และฐาน `course_books` เพิ่ม IP เครื่องที่รัน Express ใน Atlas IP access list ดูรายละเอียดและ URL encoding ในใบงาน อย่าใช้รหัสผ่านเข้าเว็บ Atlas แทน database user

```bash
npm run db:check
npm run seed
npm run seed
npm run db:check
npm run dev
```

ผ่าน ping ก่อน seed ฐานใหม่ควรมี 200 เล่มหลัง seed ทั้งสองครั้ง ตรวจ document ใน Atlas → Browse Collections → course_books → books

## 3. จุดที่คุณต้องแก้

| ไฟล์ | สิ่งที่ทำ |
|---|---|
| `.env` | ใส่ URI ส่วนตัว; ห้าม commit |
| `src/models/Book.js` | อ่าน schema ที่มีให้และเขียน DataDictionary |
| `src/book-store.js` | เติม `LAB10-LIST`, `LAB10-FIND`, `LAB10-INSERT` ตามขั้น 4 |
| `src/server.js` | แทน `LAB10-ROUTES` ด้วย routes จาก Lab 09 ของตน; await store; เปลี่ยน ID validation; จัดการ errors ตามขั้น 5–6 |

เปิดอีก terminal: `curl -i http://localhost:3001/health` ควรได้ 200 แต่ `/api/books` **ยังตอบ 501** จนกว่าคุณเขียนกิจกรรม ไม่ใช่ DB เสีย ตรวจความสำเร็จด้วย GET/POST และ POST → restart → GET ตามใบงาน ไม่ใช้ health อย่างเดียว

## ทางเลือก Docker

ใช้เมื่อไม่ใช้ Atlas: เปิด Docker แล้วเปลี่ยน `.env` เป็น `MONGODB_URI=mongodb://127.0.0.1:27018/course_books` จากนั้น:

```bash
docker info
docker compose version
docker compose config --quiet
npm run db:up
docker compose ps
npm run db:check
npm run seed
npm run seed
npm run dev
```

`db:up` รอ healthcheck ก่อน seed ใช้ Compose v2 ที่รองรับ `--wait` หาก port ชน เปลี่ยน `MONGO_PORT` และ port ใน URI พร้อมกัน ดูตารางแก้ปัญหาในใบงาน

## หยุดและตรวจ scaffold

หยุด Express ด้วย Ctrl+C ถ้าใช้ Docker ให้ `npm run db:stop` เพื่อเก็บ volume ห้ามใช้ `down -v` เมื่อต้องการเก็บข้อมูล Atlas ไม่ต้องมีคำสั่ง Docker

`npm test` ตรวจ model โดยไม่ใช้ DB ส่วน `npm run test:integration` ต้องมี local MongoDB ที่ 127.0.0.1:27018 (ปรับด้วย `LAB10_TEST_URI`) ชุดทดสอบสร้างและลบเฉพาะฐานชั่วคราวชื่อสุ่ม `course_books_lab10_test_*` และไม่อ่าน `.env` ของคุณ การทดสอบนี้ตรวจ scaffold ไม่ได้ตรวจ GET/POST ที่คุณต้องเขียน
