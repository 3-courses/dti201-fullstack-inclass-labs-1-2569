# Lab 10 — จุดเริ่มต้น MongoDB

ใช้คู่กับ [Lab 10](../../labs/10-book-database-crud.md) และ backend ที่คุณสร้างใน Lab 09. โฟลเดอร์นี้ช่วยตรวจการเชื่อมต่อ Model และ seed หนังสือ 200 เล่ม; คุณต้องเขียน GET/POST และการตรวจข้อมูลในโปรเจกต์ของตนเอง

จากโฟลเดอร์นี้ ใช้ Node.js 20+ และ Docker:

```bash
cp .env.example .env
npm ci
docker compose up -d db
npm run seed
npm run seed
npm run dev
```

ทั้งสองครั้งของ seed ควรแสดง 200 รายการ หากฐานข้อมูลเดิมมีข้อมูลอื่น จำนวนทั้งหมดอาจมากกว่า 200 ตรวจด้วย `docker compose exec db mongosh course_books --eval 'db.books.countDocuments()'`. เปิด terminal อีกหน้าต่างแล้วเรียก `curl -i http://localhost:3001/health`. เส้นทาง `/api/books` ตอบ 501 จนกว่าจะเขียนกิจกรรมใน Lab 10

หลังเลิกใช้ กด Ctrl+C เพื่อหยุด Express แล้วรัน `docker compose stop db`. คำสั่งนี้เก็บ volume ไว้ อย่าใช้ `down -v` เมื่อต้องการเก็บข้อมูล ตัวอย่างนี้เปิด MongoDB เฉพาะ localhost สำหรับทดลองเท่านั้น
