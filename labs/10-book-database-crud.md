# Lab 10 — Database, seed data และ CRUD สำหรับ Course Book Explorer

## เป้าหมาย

เปลี่ยนจาก in-memory data เป็นข้อมูลที่อยู่ต่อหลัง restart server

เลือก database ตามที่ผู้สอนกำหนด เช่น SQLite, PostgreSQL, MongoDB หรือ file-based storage สำหรับ MVP

## Data model

```text
Book
- id
- title
- author
- sourceType
- topics
- summary
- createdAt
- updatedAt
```

```text
ReadingNote
- id
- bookId
- note
- confidence
- tags
- createdAt
```

## Seed data

ต้องมี seed อย่างน้อย 5 รายการจากหนังสือ/แหล่งเรียนรู้ของรายวิชา

## DataDictionary.md

เพิ่มใน `docs/DataDictionary.md`:

| Field | Type | Required | Source | Privacy note |
|---|---|---|---|---|
| `title` | string | yes | course resource metadata | not sensitive |
| `summary` | string | yes | student-written | must not copy copyrighted text |
| `note` | string | yes | student input | may contain personal reflection |

## CRUD ที่ต้องมี

- create book หรือ reading note
- read list
- read detail
- update note
- delete note หรือ mark archived

## Evidence checklist

- seed command หรือ seed script
- database connection note
- CRUD endpoint ผ่านด้วย curl
- DataDictionary.md
- privacy note

## คำถาม oral defense

- ข้อมูลใดควรเก็บ และข้อมูลใดไม่ควรเก็บ
- seed data ช่วยผู้ตรวจอย่างไร
- delete จริงกับ archive ต่างกันอย่างไร
- ถ้าข้อมูลเยอะขึ้นต้องเริ่มคิดเรื่อง query อย่างไร
