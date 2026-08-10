# Lab 14 — Learning Journey Dataset และ RAG readiness

## เป้าหมาย

เปลี่ยนการเรียนทั้งภาคให้กลายเป็น dataset ที่ตรวจได้และนำไปใช้ค้นคืนความรู้ภายหลังได้

## ไฟล์ที่ต้องมี

```text
docs/LearningJourneyDataset.md
docs/ReasoningTrace.md
docs/PromptPlaybook.md
data/learning-journey.sample.jsonl
```

## Entry ขั้นต่ำ

```md
## LJ-008: Debug API contract

- Week: 9
- Topic: API validation
- Problem: frontend ส่ง bookTitle แต่ backend ต้องการ title
- Bad prompt: fix my api
- Improved prompt: ช่วยดูจาก request body และ API contract ว่า field ไหนไม่ตรงกัน พร้อมเสนอวิธี verify ก่อนแก้โค้ด
- Reasoning:
  - Evidence: Network tab ส่ง `bookTitle`
  - Option: แก้ frontend, map backend, หรือเปลี่ยน contract
  - Decision: แก้ frontend ให้ส่ง `title`
  - Verification: curl และ form ผ่านทั้งคู่
- Lesson: เช็ก contract ก่อนแก้ database
- Tags: api, validation, contract
- RAG ready: true
```

## RAG-ready ต้องเป็นอย่างไร

- ไม่มี secret
- ไม่มีข้อมูลส่วนตัวอ่อนไหว
- มี context พอเข้าใจ
- มี verification
- lesson ใช้ซ้ำได้

## Evidence checklist

- entries อย่างน้อย 8 รายการ
- bad/improved prompt อย่างน้อย 5 คู่
- reasoning trace อย่างน้อย 5 รายการ
- rejected/corrected AI suggestion อย่างน้อย 1 รายการ
- sample JSONL

## คำถาม oral defense

- entry ไหนยังไม่ควร RAG-ready เพราะอะไร
- verification ต่างจาก outcome อย่างไร
- คุณเคยปฏิเสธคำแนะนำ AI ตอนไหน
- dataset นี้ช่วยคุณเรียนอย่างไร
