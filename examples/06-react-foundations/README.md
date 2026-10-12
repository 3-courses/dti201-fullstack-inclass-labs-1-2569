# React foundations starter

โครงตั้งต้นสำหรับ [Lab 06](../../labs/06-react-book-explorer.md)

ใช้ Node.js 24 แล้วรันจากโฟลเดอร์นี้:

```bash
npm ci
npm run dev
```

เปิด URL ที่ terminal แสดง; หยุดด้วย Ctrl+C

`src/App.tsx` เป็นหน้าเริ่มต้น; `src/types.ts` และ `src/data/books.ts` เป็นข้อมูลสมมติสำหรับฝึก ไม่มี API
ทำกิจกรรมตาม Lab 06 แล้วตรวจด้วย `npm run build`

`experiments/` มีตัวอย่างทดลอง snapshot และ key ให้นำ App.tsx ไปแทน `src/App.tsx` ชั่วคราว
เก็บสำเนางานก่อนสลับ และคืนงาน Book Explorer เมื่อทดลองเสร็จ
