# Lab 13 — Docker/Compose และ deployment rehearsal

## เป้าหมาย

ทำให้ Course Book Explorer มี run path ที่คนอื่นทำตามได้

## ไฟล์ที่ต้องมี

```text
infra/
  DEPLOYMENT.md
  docker-compose.yml
  rollback.md
.env.example
```

## docker-compose ตัวอย่างแนวคิด

```yaml
services:
  api:
    build: ./backend
    ports:
      - "3001:3001"
    env_file:
      - ./backend/.env

  web:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - api
```

ปรับตาม stack จริงของตนเอง

## Deployment rehearsal

ใน `infra/DEPLOYMENT.md` ต้องตอบ:

- install dependencies อย่างไร
- start frontend/backend อย่างไร
- port คืออะไร
- environment variables มีอะไรบ้าง
- health check ตรวจที่ไหน
- ถ้าพัง rollback อย่างไร

## Evidence checklist

- `.env.example`
- docker/deploy note
- health check evidence
- rollback note
- ไม่มี secret ใน Git

## คำถาม oral defense

- container ช่วยแก้ปัญหา “เครื่องฉันรันได้” อย่างไร
- `.env.example` ควรมีค่าแบบไหน
- CORS origin เปลี่ยนเมื่อ deploy อย่างไร
- rollback คืออะไร
