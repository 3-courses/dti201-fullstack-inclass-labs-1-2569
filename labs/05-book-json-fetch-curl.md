# Lab 05 — Chapter 4 Recovery: Asynchronous JavaScript, Promise และ JSON CRUD API

Lab นี้เป็นคาบกู้พื้นฐานจาก Chapter 4 ก่อนเดินต่อไป React และ backend จริง เราจะไม่เริ่มจากการจำ syntax แต่เริ่มจากการทำนายลำดับงาน อ่านหลักฐานใน Network panel และทำ CRUD ครบวงจร

ใช้เวลา **180 นาทีสำหรับ core lab** และ **30–45 นาทีสำหรับ React bridge (optional)** ถ้ามีเวลาไม่พอ ให้หยุดหลัง Checkpoint 6 แล้วทำ React ใน Lab 06

## Learning outcomes

เมื่อจบ core lab นักศึกษาต้องทำได้ดังนี้:

1. อธิบายว่าทำไม `fetch()` ไม่หยุด main thread และบอกสถานะ `pending`, `fulfilled`, `rejected` ของ Promise ได้
2. แยก network failure ออกจาก HTTP error และตรวจ `response.ok` ทุกครั้ง
3. อ่าน HTTP request/response: method, endpoint, header, status และ JSON body
4. ใช้ NPS API key โดยไม่เขียน key ลง client JavaScript หรือ commit ลง Git
5. ทำ Create, Read, Update, Delete กับ JSON API และตรวจผลด้วย UI, curl หรือ PowerShell
6. แสดง UI state อย่างน้อย `loading`, `success`, `empty` และ `error`
7. อธิบาย CORS ว่าเป็น browser policy ไม่ใช่ระบบ authorization

## เชื่อมกับ Chapter 4 และสื่อใน `slide/`

| Chapter 4 | จุดที่ใช้ใน lab |
|---|---|
| HTTP request/response, headers, MIME type | Checkpoint 2–3 |
| GET, POST, PATCH, DELETE | Checkpoint 2, 5, 6 |
| 200, 201, 204, 404, 422, 500 | Checkpoint 2 และ failure drill |
| JSON success/error contract | Checkpoint 3–6 |
| Fetch network error vs HTTP error | Checkpoint 3 และ failure drill |
| loading/empty/error/cancelled state | Checkpoint 4 และ stretch task |
| CORS, curl, Network panel | Checkpoint 2 และ 7 |

ก่อนเริ่ม lab ใช้สื่อสองชิ้นนี้เป็น concept check:

- `slide/20260908-HTTP-FetchAPI (1).png` — ภาพ coffee shop model ของ HTTP
- `slide/AJAX_training_index.html` — interactive recap เรื่อง async, request URL, fetch, error และ JSON → DOM

นักศึกษาที่มีหนังสือฉบับเต็มให้เปิด `slide/dti201-full-stack-course-book.pdf` หน้าที่พิมพ์ 35–46 และใช้ [full-book alignment guide](../docs/book-api-react-lab-alignment.md) เช็ก Section 4.1–4.17 ระหว่างทำงาน

ตัวอย่าง `JavaScript-Ajax-and-Fetch-3809063` ให้แนวคิดที่ดีเรื่อง NPS และการเปลี่ยน JSON เป็น DOM แต่ lab นี้ปรับให้ทันสมัยขึ้นด้วย `async/await`, generic error handler, CRUD, UI states และ server-side key proxy

## ภาพรวมระบบ

```text
Browser UI
  |  fetch /api/parks                 Local lab server
  |---------------------------------->|  เติม X-Api-Key จาก .env
  |                                   |--------> NPS API (read-only)
  |<----------------------------------|<-------- JSON parks
  |
  |  GET/POST/PATCH/DELETE /api/notes
  |---------------------------------->|  data/notes.json (local CRUD)
  |<----------------------------------|  JSON + HTTP status
```

เหตุผลที่ใช้ local lab server มีสองข้อ:

- browser ไม่ควรได้รับ NPS key; `.env` ต้องถูกอ่านฝั่ง server
- NPS เป็น read-only API สำหรับเรา จึงใช้ `/api/notes` เป็น resource ที่เขียนได้เพื่อฝึก CRUD

`server.mjs` เป็น scaffold ที่ผู้สอนเตรียมให้ ในคาบนี้ไม่ต้องเข้าใจ backend ทุกบรรทัด เพราะเราจะสร้าง backend เองใน Lab 09

## Prerequisites และ finish line

ต้องมี:

- Node.js 20.6 ขึ้นไป
- NPS API key ของตนเอง
- Chrome, Edge หรือ Firefox พร้อม DevTools
- Git working tree ที่ไม่มี `.env` ถูก track

จบ lab เมื่อผู้สอนเห็นหลักฐาน 4 อย่าง:

1. async trace พร้อมคำอธิบายลำดับ
2. NPS `GET` สำเร็จหรือใช้ offline fallback โดยระบุเหตุผล
3. Network/curl evidence ของ `POST 201`, `PATCH 200`, `DELETE 204`
4. failure evidence อย่างน้อยหนึ่งกรณี เช่น `404`, `422` หรือ offline

## Checkpoint 0 — เตรียมระบบอย่างปลอดภัย (15 นาที)

เปิด terminal ที่ root ของ public lab repository:

```bash
node --version
git status --short
cd examples/05-api-async-crud
```

ถ้าใช้ PowerShell:

```powershell
Copy-Item .env.example .env
notepad .env
```

ถ้าใช้ Bash/zsh:

```bash
cp .env.example .env
nano .env
```

ใส่ key โดยไม่ใส่ quote และไม่เพิ่ม key ลงไฟล์อื่น:

```dotenv
NPS_API_KEY=replace_with_your_own_key
NPS_OFFLINE=false
PORT=3000
```

ตรวจว่า Git ignore จริง:

```bash
git check-ignore -v .env
git status --short
```

ผลต้องไม่แสดง `.env` เป็นไฟล์ที่จะ commit จากนั้นเริ่ม server:

```bash
npm start
```

เปิด `http://127.0.0.1:3000` และเปิด DevTools → Console + Network

ถ้า NPS หรือเครือข่ายใช้ไม่ได้ ห้ามปิด TLS verification ให้หยุด server ด้วย `Ctrl+C` แล้วใช้:

```bash
npm run start:offline
```

offline mode ไม่ใช่การแกล้งทำว่าสำเร็จ นักศึกษาต้องเขียนในหลักฐานว่าใช้ fallback เพราะอะไร

## Checkpoint 1 — ทำนาย async ก่อนรัน (20 นาที)

ห้ามกด **Run trace** ทันที ให้เขียนลำดับที่คาดไว้ก่อน:

```js
console.log("1 synchronous start");

setTimeout(() => console.log("4 timer task"), 0);
Promise.resolve().then(() => console.log("3 Promise microtask"));

console.log("2 synchronous end");
await new Promise((resolve) => setTimeout(resolve, 30));
console.log("5 continuation after await");
```

จากนั้นกดปุ่มและอธิบายผล:

```text
1 → 2 → 3 → 4 → 5
```

- บรรทัด synchronous ทำงานจน call stack ว่างก่อน
- callback ของ `.then()` อยู่ใน microtask queue
- callback ของ `setTimeout` เป็น task จึงมาต่อหลัง microtask แม้ตั้ง `0 ms`
- `await` หยุดเฉพาะ function ปัจจุบัน ไม่ได้หยุดทั้งหน้า

แก้ `public/app.js` ให้เพิ่ม microtask อีกหนึ่งตัวด้วย `queueMicrotask(...)` แล้วทำนายลำดับใหม่ก่อน refresh

### Promise ที่ต้องรู้

```js
const promise = fetch("/api/notes"); // pending และคืนค่าทันที

promise
  .then((response) => response.json()) // fulfilled path
  .then((notes) => console.log(notes))
  .catch((error) => console.error(error)); // rejected path
```

โค้ดเดียวกันแบบ `async/await`:

```js
try {
  const response = await fetch("/api/notes");
  const notes = await response.json();
  console.log(notes);
} catch (error) {
  console.error(error);
}
```

`async/await` ไม่ได้เปลี่ยนการทำงานให้ synchronous แต่เป็น syntax ที่ช่วยเขียนและอ่าน Promise chain

## Checkpoint 2 — อ่าน API contract ด้วย HTTP client (25 นาที)

เปิด terminal ที่สองและตรวจ health endpoint:

```bash
curl -i http://127.0.0.1:3000/health
curl -i "http://127.0.0.1:3000/api/parks?stateCode=CA&limit=2"
curl -i http://127.0.0.1:3000/api/notes
```

Windows PowerShell ที่ `curl` เป็น alias ใช้ `curl.exe` หรือ:

```powershell
Invoke-RestMethod http://127.0.0.1:3000/health
Invoke-RestMethod 'http://127.0.0.1:3000/api/parks?stateCode=CA&limit=2'
Invoke-RestMethod http://127.0.0.1:3000/api/notes
```

บันทึกหลักฐานให้ครบ:

```text
Method:
URL/endpoint:
Request header/body:
Response status:
Response Content-Type:
JSON path ที่ UI ใช้:
```

### CRUD contract

| Intent | Method + endpoint | Request body | Success response |
|---|---|---|---|
| Create | `POST /api/notes` | JSON note | `201` + note และ `Location` header |
| Read list | `GET /api/notes` | ไม่มี | `200` + JSON array |
| Read detail | `GET /api/notes/:id` | ไม่มี | `200` + JSON object |
| Update บาง field | `PATCH /api/notes/:id` | JSON fields ที่เปลี่ยน | `200` + note ล่าสุด |
| Delete | `DELETE /api/notes/:id` | ไม่มี | `204` และไม่มี response body |

## Checkpoint 3 — สร้าง Fetch pipeline กลาง (25 นาที)

หัวใจของ client คือแยกขั้นตอนให้ชัด:

```text
fetch → Response → อ่าน body → ตรวจ HTTP status → คืน data หรือ throw Error
```

อ่าน `requestJson()` ใน `public/app.js` แล้วตอบว่าเหตุใดจึงมี `await` สองครั้ง จากนั้นนำ pattern นี้ไปใช้ใน Course Book Explorer ของตนเอง:

```js
async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const responseText = await response.text();
  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const body = responseText && isJson
    ? JSON.parse(responseText)
    : responseText || null;

  if (!response.ok) {
    const error = new Error(body?.title ?? `HTTP ${response.status}`);
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body;
}
```

เหตุผลที่ไม่เรียก `response.json()` ทันทีทุกครั้งคือ `204 No Content` ไม่มี JSON body และ error บางระบบอาจตอบเป็น text

### Failure drill

เปิด Console แล้วทดลอง:

```js
fetch("/api/not-found")
  .then((response) => console.log(response.status, response.ok))
  .catch((error) => console.error("network", error));
```

ผลคือ Promise ของ `fetch` ยัง fulfilled แต่ได้ `404` และ `response.ok === false` เพราะ server ตอบกลับถึง browser แล้ว

## Checkpoint 4 — READ จาก NPS และ JSON → DOM (30 นาที)

กด `GET parks` แล้วตรวจ Network request `/api/parks`:

- browser request ต้อง **ไม่มี** NPS key
- response ต้องเป็น `application/json`
- JSON list อยู่ที่ `data`
- UI ต้องเปลี่ยน `loading → success`, `empty` หรือ `error`

อ่าน `loadParks()` และ `renderParks()` ใน `public/app.js` แล้วเพิ่มงานต่อไปนี้:

1. แสดงค่า `meta.rateLimitRemaining` เมื่อใช้ live API
2. ถ้า `description` ว่าง ให้แสดงข้อความ fallback
3. ใช้ `textContent` สำหรับข้อความจาก API ห้ามส่ง string จาก API เข้า `innerHTML`

ทดสอบ `stateCode=CA`, `UT` และรหัสที่ไม่มีผลลัพธ์ เปรียบเทียบ `total` กับจำนวน `data` ที่ได้รับเมื่อใช้ `limit`

## Checkpoint 5 — CREATE และ validation (25 นาที)

เลือก park เขียน note อย่างน้อย 10 ตัวอักษร แล้วกด `POST note` ใน Network panel ต้องเห็น:

```text
POST /api/notes
Content-Type: application/json
201 Created
Location: /api/notes/<generated-id>
```

request body สร้างด้วย:

```js
const created = await requestJson("/api/notes", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ parkCode, parkName, text }),
});
```

จากนั้นส่ง note สั้นกว่า 10 ตัวอักษรโดยใช้ DevTools หรือ PowerShell เพื่อให้เห็น `422`:

```powershell
$body = @{
  parkCode = 'acad'
  parkName = 'Acadia National Park'
  text = 'short'
} | ConvertTo-Json

try {
  Invoke-RestMethod http://127.0.0.1:3000/api/notes `
    -Method Post `
    -ContentType 'application/json' `
    -Body $body
} catch {
  $_.Exception.Response.StatusCode.value__
}
```

ตอบให้ได้ว่า frontend `minlength` กับ server validation ทำหน้าที่ต่างกันอย่างไร

## Checkpoint 6 — UPDATE และ DELETE (25 นาที)

กด `PATCH` เพื่อแก้ note และ `DELETE` เพื่อลบ พร้อมตรวจ method/status ใน Network panel

```js
await requestJson(`/api/notes/${encodeURIComponent(noteId)}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: newText }),
});

await requestJson(`/api/notes/${encodeURIComponent(noteId)}`, {
  method: "DELETE",
});
```

สิ่งที่ต้องสังเกต:

- UI เปลี่ยนหลัง server ตอบสำเร็จ ไม่ใช่เปลี่ยนก่อนแล้วหวังว่า request จะผ่าน
- `PATCH` ส่งเฉพาะ field ที่แก้
- `DELETE 204` ไม่มี JSON body แต่ยังเป็น success
- ลบ ID เดิมซ้ำต้องได้ `404`

รีเซ็ตข้อมูลเมื่อจบการทดลอง:

```bash
npm run reset
```

## Checkpoint 7 — Diagnose ด้วย Network panel (15 นาที)

เลือก request อย่างน้อยหนึ่งรายการจากแต่ละกลุ่มและบันทึก screenshot โดยไม่ให้มี secret:

| Case | สิ่งที่ต้องชี้ให้ผู้สอนดู |
|---|---|
| NPS Read | query parameter, status 200, JSON path `data` |
| Create | method POST, request payload, status 201, Location |
| Update | method PATCH, ID ใน URL, field ที่เปลี่ยน |
| Delete | method DELETE, status 204, empty body |
| Failure | status 404/422 หรือ network/offline message |

ถ้า browser เรียก API จาก port อื่นแล้วเจอ CORS ให้ตอบก่อนแก้:

1. frontend origin คืออะไร (scheme + host + port)
2. API origin คืออะไร
3. request ถึง server หรือถูก browser block

CORS อนุญาตให้ browser อ่าน response ข้าม origin เท่านั้น ไม่ได้พิสูจน์ตัวตนหรือให้สิทธิ์กับผู้ใช้

## Optional — React bridge (30–45 นาที)

ทำส่วนนี้เมื่อ core evidence ผ่านแล้ว จุดประสงค์คือเห็นว่า React เปลี่ยนวิธี render แต่ไม่เปลี่ยน HTTP/Promise contract

สร้าง Vite app ตาม Lab 06 แล้วเขียน component แบบย่อ:

```tsx
import { useEffect, useState } from "react";

type Park = {
  id: string;
  parkCode: string;
  fullName: string;
  description: string;
};

export function ParkList() {
  const [parks, setParks] = useState<Park[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch(
          "http://127.0.0.1:3000/api/parks?stateCode=CA&limit=6",
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        setParks(result.data);
        setStatus("success");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
      }
    }

    load();
    return () => controller.abort();
  }, []);

  if (status === "loading") return <p>Loading…</p>;
  if (status === "error") return <p role="alert">Load failed</p>;
  if (parks.length === 0) return <p>No parks found</p>;

  return <ul>{parks.map((park) => <li key={park.id}>{park.fullName}</li>)}</ul>;
}
```

จับคู่แนวคิด:

| Vanilla JavaScript | React |
|---|---|
| variable/array | state |
| event listener | JSX event prop |
| `replaceChildren()`/`textContent` | render จาก state |
| request ตอน page load | effect |
| abort เมื่อออกจากหน้า | effect cleanup |

CRUD service layer เต็มรูปแบบทำต่อใน Lab 07

## Stretch tasks

เลือกอย่างน้อยหนึ่งข้อสำหรับกลุ่มที่เสร็จเร็ว:

- ใช้ `Promise.all()` โหลด parks และ notes พร้อมกัน แล้วอธิบายว่า fail หนึ่ง request มีผลอย่างไร
- ใช้ `Promise.allSettled()` เพื่อให้ส่วนหนึ่งของหน้าแสดงต่อได้แม้อีก request ล้มเหลว
- ใช้ `AbortController` ยกเลิก request เก่าเมื่อผู้ใช้เปลี่ยน state code เร็ว ๆ
- filter notes ด้วย `GET /api/notes?parkCode=acad`
- เพิ่ม retry เฉพาะ network error/429 โดยไม่ retry validation error 422

## Evidence checklist

- [ ] `git status --short` ไม่แสดง `.env` หรือ key
- [ ] อธิบาย async trace และ Promise 3 states ได้
- [ ] มี NPS GET หรือระบุ offline fallback อย่างซื่อสัตย์
- [ ] มีหลักฐาน `200`, `201`, `204` และ error อย่างน้อยหนึ่งสถานะ
- [ ] CRUD notes ทำงานครบ Create, Read, Update, Delete
- [ ] UI มี loading, success, empty และ error
- [ ] ใช้ `response.ok`, `try/catch/finally` และ `textContent`
- [ ] บันทึก method, endpoint, status และ JSON path ใน `docs/ReasoningTrace.md`
- [ ] หยุด server ด้วย `Ctrl+C`

## ReasoningTrace template

```text
Problem:
สิ่งใดที่เราไม่เข้าใจหรือทำให้ request ล้มเหลว

Prediction:
คาดว่า method/status/async order จะเป็นอย่างไร

Evidence:
สิ่งที่เห็นจาก Console, Network หรือ curl โดยไม่มี secret

Decision:
แก้อะไร และเหตุใด

Verification:
ทดสอบ success และ failure อย่างไร
```

## Oral defense

- `fetch()` คืนอะไรทันที และ `response.json()` คืนอะไร
- ทำไม `404` จึงไม่เข้า `.catch()` โดยอัตโนมัติ
- `200`, `201` และ `204` ต่างกันอย่างไร
- ทำไม NPS key อยู่ใน `.env` ฝั่ง server แต่ไม่อยู่ใน browser code
- `POST` กับ `PATCH` ต่างกันทั้ง intent และ request body อย่างไร
- CORS ต่างจาก authentication/authorization อย่างไร
- ถ้า component React ถูก unmount ระหว่าง request ควรทำอะไร

## เอกสารอ้างอิง

- NPS API documentation: <https://www.nps.gov/subjects/developer/api-documentation.htm>
- NPS API authentication and rate limits: <https://www.nps.gov/subjects/developer/guides.htm>
- MDN — Using the Fetch API: <https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch>
- React — Synchronizing with Effects: <https://react.dev/learn/synchronizing-with-effects>
- Full-book API/React/CRUD alignment: [`docs/book-api-react-lab-alignment.md`](../docs/book-api-react-lab-alignment.md)
- Companion app: [`examples/05-api-async-crud/`](../examples/05-api-async-crud/)
