# Lab 12 — Automation, smoke test, Git PR และ CI concept

## เป้าหมาย

ทำให้โปรเจกต์รันซ้ำได้ ตรวจซ้ำได้ และ review ได้ ไม่ใช่รันได้เฉพาะเครื่องเรา

## npm scripts ที่ควรมี

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --workspace frontend\" \"npm run dev --workspace backend\"",
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "seed": "npm run seed --workspace backend",
    "smoke": "node scripts/smoke-test.js"
  }
}
```

ปรับตามโครงสร้างจริงของตนเองได้

## Smoke test

ขั้นต่ำ:

- backend start ได้
- `GET /health` ผ่าน
- `GET /api/books` ผ่าน
- invalid POST ได้ 400
- frontend build ผ่าน

## Git workflow

ทุก feature ควรมี:

```text
issue -> branch -> commit -> pull request -> review -> merge
```

Commit message ที่ดี:

```text
feat: add reading note validation
fix: handle empty book list state
docs: update API contract for books endpoint
```

## Evidence checklist

- scripts ใช้งานได้จริง
- smoke test evidence
- PR description อย่างน้อย 1 ฉบับ
- issue อย่างน้อย 1 ฉบับ
- commit ไม่ใช่ก้อนเดียวใหญ่ ๆ

## คำถาม oral defense

- smoke test ต่างจาก unit test อย่างไร
- ทำไม PR ช่วยให้สื่อสารดีขึ้น
- commit message แบบ “fix” เฉย ๆ มีปัญหาอะไร
- CI ช่วยตรวจอะไรได้บ้าง
