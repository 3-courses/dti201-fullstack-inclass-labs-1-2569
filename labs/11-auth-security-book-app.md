# Lab 11 — Authentication, authorization และ security habit

## เป้าหมาย

คาบนี้ไม่ใช่การทำระบบ auth ใหญ่โต แต่เป็นการฝึกคิดว่า endpoint ใดควรถูกป้องกัน และข้อมูลใดไม่ควรหลุด

## เลือก scope

เลือกหนึ่งแนวทาง:

### A. มี auth

- login demo
- protected route สำหรับเพิ่ม/edit reading note
- token/session flow แบบง่าย

### B. ยังไม่มี auth

- เขียนเหตุผลว่า MVP ยังไม่ต้อง auth
- ใช้ demo data เท่านั้น
- เพิ่ม validation และ privacy note ให้ชัด

ทั้งสองแบบทำคะแนนได้ ถ้าอธิบาย risk ได้ดี

## Security checklist

```text
[ ] ไม่มี .env ใน Git
[ ] มี .env.example
[ ] ไม่ log password/token
[ ] error ไม่ส่ง stack trace ให้ผู้ใช้
[ ] validate input ทุก POST/PUT
[ ] CORS จำกัดตาม environment
[ ] seed data ไม่มีข้อมูลจริงของผู้ใช้
```

## Evidence checklist

- security checklist ใน `docs/ReasoningTrace.md`
- `.env.example`
- protected endpoint หรือ reasoning ว่ายังไม่ทำ auth เพราะอะไร
- ไม่มี secret ใน Git

## คำถาม oral defense

- authentication กับ authorization ต่างกันอย่างไร
- ทำไม API key ไม่ควรอยู่ frontend
- ถ้า commit `.env` ไปแล้วต้องทำอะไร
- summary จากหนังสือมีความเสี่ยงลิขสิทธิ์อย่างไร
