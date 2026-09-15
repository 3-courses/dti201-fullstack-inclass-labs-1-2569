# DTI201 Chapter 4 API lab support app

แอปนี้เป็น reference implementation และ local API สำหรับ [Lab 05](../../labs/05-book-json-fetch-curl.md) โดยตั้งใจให้ผู้เรียนโฟกัสที่ asynchronous JavaScript, Promise, `fetch`, HTTP และ JSON CRUD ก่อนสร้าง backend เองใน Lab 09

## สิ่งที่มีให้

- static frontend ที่ `http://127.0.0.1:3000`
- NPS proxy ที่ `GET /api/parks` เพื่อไม่ส่ง `NPS_API_KEY` ไป browser
- JSON CRUD API สำหรับ reading notes
- offline NPS sample สำหรับวันที่ network หรือ upstream API มีปัญหา
- smoke test สำหรับ health endpoint และ CRUD

ไม่ต้องรัน `npm install` เพราะตัวอย่างนี้ใช้เฉพาะ API ที่มากับ Node.js

## เริ่มแบบ live NPS

ต้องใช้ Node.js 20.6 ขึ้นไป

PowerShell:

```powershell
Copy-Item .env.example .env
notepad .env
npm start
```

Bash/zsh:

```bash
cp .env.example .env
nano .env
npm start
```

ใส่ key ของตนเองใน `.env`:

```dotenv
NPS_API_KEY=replace_with_your_own_key
NPS_OFFLINE=false
PORT=3000
```

ห้าม commit `.env` และห้ามวาง key ใน `public/app.js`, URL, screenshot หรือข้อความส่งงาน

## เริ่มแบบ offline

```bash
npm run start:offline
```

CRUD notes ยังทำงานปกติ ส่วน `GET /api/parks` จะอ่าน `data/nps-parks.sample.json`

## ตรวจระบบ

เปิด terminal ที่สองขณะที่ server ทำงาน:

```bash
npm test
```

ผลที่ควรเห็น:

```text
Smoke test passed: health + notes CRUD + failure/cancellation endpoints
NPS check skipped; run with TEST_NPS=true to include it
```

ตรวจ NPS ด้วย PowerShell:

```powershell
$env:TEST_NPS="true"
npm test
Remove-Item Env:TEST_NPS
```

ตรวจ NPS ด้วย Bash/zsh:

```bash
TEST_NPS=true npm test
```

รีเซ็ตข้อมูล:

```bash
npm run reset
```

หยุด server ด้วย `Ctrl+C`

## API contract

| Intent | Method + endpoint | Success |
|---|---|---:|
| health check | `GET /health` | 200 |
| NPS park list | `GET /api/parks?stateCode=CA&limit=6` | 200 |
| delayed response for cancellation | `GET /api/demo/delay?ms=2000` | 200 |
| deterministic HTTP error | `GET /api/demo/status/500` | selected status |
| list notes | `GET /api/notes` | 200 |
| note detail | `GET /api/notes/:id` | 200 หรือ 404 |
| create note | `POST /api/notes` | 201 |
| update part of note | `PATCH /api/notes/:id` | 200 |
| delete note | `DELETE /api/notes/:id` | 204 |

ตัวอย่าง success body ของ note:

```json
{
  "id": "generated-on-server",
  "parkCode": "acad",
  "parkName": "Acadia National Park",
  "text": "ข้อความที่ผู้เรียนเขียนเองอย่างน้อย 10 ตัวอักษร",
  "createdAt": "2026-09-15T00:00:00.000Z",
  "updatedAt": "2026-09-15T00:00:00.000Z"
}
```

ตัวอย่าง validation error:

```json
{
  "type": "request-error",
  "title": "Validation failed",
  "status": 422,
  "errors": {
    "text": ["text must contain at least 10 characters"]
  }
}
```

## ขอบเขตการสอน

`server.mjs` เป็น backend scaffold ที่ผู้สอนเตรียมให้ ไม่จำเป็นต้องอธิบายทุกบรรทัดในคาบนี้ ให้ผู้เรียนมองเป็น API ภายนอกและใช้ DevTools/curl ตรวจ contract ก่อน ใน Lab 09 จึงค่อยสร้าง routing, validation และ persistence ด้วยตนเอง

ข้อมูล NPS live มาจาก `https://developer.nps.gov/api/v1/parks` และ server ส่ง key ด้วย header `X-Api-Key` ตาม NPS API guide

## Troubleshooting

| อาการ | วิธีตรวจ/แก้ |
|---|---|
| `NPS_API_KEY is not configured` | ตรวจว่าชื่อไฟล์คือ `.env` ไม่ใช่ `.env.txt` และ restart server |
| `NPS API could not be reached` | ตรวจ network/TLS certificate; ห้ามปิด TLS verification ใช้ `npm run start:offline` ระหว่างแก้ |
| port 3000 ถูกใช้ | เปลี่ยน `PORT=3001` ใน `.env` แล้วเปิด URL ใหม่ |
| note เก่าค้าง | หยุด server แล้วรัน `npm run reset` |
| เปิด HTML ด้วย double-click | เปิด URL ของ server แทน `file://` |
