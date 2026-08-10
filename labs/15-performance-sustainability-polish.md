# Lab 15 — Performance, resource use, sustainability และ final polish

## เป้าหมาย

ก่อน final demo ให้ตรวจว่า app ไม่ใช่แค่ “รันได้” แต่ใช้งานได้ดีพอ อธิบายข้อจำกัดได้ และใช้ทรัพยากรไม่สิ้นเปลืองเกินจำเป็น

## สิ่งที่ต้องตรวจ

- payload จาก `/api/books` ใหญ่เกินไปไหม
- list page ดึงข้อมูลละเอียดเกินจำเป็นไหม
- image หรือ asset ใหญ่เกินไปไหม
- API ถูกเรียกซ้ำโดยไม่จำเป็นไหม
- loading/error/empty state ครบไหม
- responsive ยังดีไหม
- accessibility ยังพอใช้ไหม

## Resource note

เขียนใน `docs/ReasoningTrace.md`:

```text
Workflow: เปิดหน้า book catalog
Observed: GET /api/books ส่งข้อมูลครบทุก note ทำให้ response ใหญ่
Decision: list endpoint ส่งเฉพาะ summary fields
Verification: response size ลดลง และ UI ยังแสดงผลได้
Lesson: หน้า list ไม่ควรดึง detail ที่ยังไม่ได้ใช้
```

## Final polish checklist

```text
[ ] README ตรงกับวิธีรันจริง
[ ] screenshots หรือ demo URL พร้อม
[ ] API contract update แล้ว
[ ] DataDictionary update แล้ว
[ ] ไม่มี .env หรือ secret
[ ] build ผ่าน
[ ] smoke test ผ่าน
[ ] demo script พร้อม
```

## คำถาม oral defense

- คุณวัด performance จากอะไร
- ถ้าต้องลด payload จะทำอะไร
- จุดใดของ app ใช้ทรัพยากรเกินจำเป็น
- sustainability ในเว็บแอปเล็ก ๆ หมายถึงอะไร
