# Lab 09 — สร้าง Express API สำหรับหนังสือ

## เป้าหมาย

เริ่ม backend อย่างเป็นระบบ: health endpoint, routing, middleware, validation และ error response ที่สม่ำเสมอ

## โครงสร้าง

```text
backend/
  src/
    server.ts
    routes/books.ts
    data/books.ts
  package.json
  tsconfig.json
  .env.example
```

## Endpoint ขั้นต่ำ

```text
GET /health
GET /api/books
GET /api/books/:id
POST /api/books
```

## Health endpoint

```json
{ "status": "ok", "service": "course-book-api" }
```

## Validation

สำหรับ `POST /api/books`:

- `title` ต้องมีอย่างน้อย 3 ตัวอักษร
- `author` ต้องไม่ว่าง
- `sourceType` ต้องเป็น `book`, `documentation`, หรือ `course`
- `summary` ต้องเขียนเอง ไม่คัดลอกจากหนังสือ

## ทดสอบด้วย curl

```bash
curl http://localhost:3001/health
curl http://localhost:3001/api/books
curl -X POST http://localhost:3001/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"MDN Web Docs","author":"Mozilla","sourceType":"documentation","summary":"เอกสารอ้างอิงเว็บ"}'
```

## Evidence checklist

- backend รันได้
- health endpoint ผ่าน
- GET books ผ่าน
- POST valid ผ่าน
- POST invalid ได้ 400
- API contract อยู่ใน README หรือ docs

## คำถาม oral defense

- middleware คืออะไร
- status 400 กับ 500 ต่างกันอย่างไร
- ทำไม backend ต้อง validate อีกครั้ง
- error response ของคุณมี shape สม่ำเสมอไหม
