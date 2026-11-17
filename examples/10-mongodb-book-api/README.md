# ไฟล์อ้างอิง Lab 10 — MongoDB Atlas, Express และ React

เริ่มงานจาก [สร้าง GitHub repository ของตนเอง](../../docs/lab10/00-create-your-repository.md) แล้วสร้าง backend/frontend ตาม [ลำดับ Lab 10](../../labs/10-book-database-crud.md)

โฟลเดอร์นี้เก็บเนื้อหาไฟล์ที่เปิดอ่านและคัดลอกทีละไฟล์จาก browser ตารางในแต่ละช่วงระบุว่าคัดลอกไฟล์ใด วางที่ไหนใน repo ของเรา และตรวจผลอย่างไร

| ไฟล์อ้างอิงที่นี่ | ตำแหน่งในงานนักศึกษา |
|---|---|
| src/, scripts/, demo/ | backend/src/, backend/scripts/, backend/demo/ |
| .env.example | backend/.env.example |
| compose.yaml (Docker ทางเลือก) | backend/compose.yaml |
| client/index.html และ client/vite.config.js | frontend/index.html และ frontend/vite.config.js |
| client/src/ | frontend/src/ |

package.json และ package-lock.json ของงานนักศึกษาสร้างด้วย npm init/install ตามคู่มือ ไม่คัดลอกทั้งโปรเจกต์หรือ clone repo แลบเป็นฐานงาน .env ของแต่ละคนสร้างใน backend และไม่ส่งขึ้น GitHub

## ลำดับเนื้อหา

- [0. สร้าง repo, clone, สร้างไฟล์ และ commit/push](../../docs/lab10/00-create-your-repository.md)
- [1. สร้าง backend, เข้าใจ .env, ต่อ Atlas และสร้าง sample DB](../../docs/lab10/01-atlas-and-sample.md)
- [2. สร้าง Drink model และ query](../../docs/lab10/02-drinks-walkthrough.md)
- [3. อ่าน ER และข้อมูลร้านหนังสือ](../../docs/lab10-book-data-model.md)
- [4. สร้าง Book model และ HTTP API](../../docs/lab10/03-book-api-walkthrough.md)
- [5. สร้าง React frontend และตรวจข้อมูล](../../docs/lab10/04-react-and-checks.md)

## ตรวจไฟล์อ้างอิง

ชุดทดสอบใน test/ ใช้ตรวจไฟล์ต้นฉบับนี้ ได้แก่ npm test, npm run test:integration และ npm run build ใน client integration ใช้ MongoDB บนเครื่องและฐานชื่อสุ่ม course_books_lab10_test_* ไม่อ่าน .env ของนักศึกษา
