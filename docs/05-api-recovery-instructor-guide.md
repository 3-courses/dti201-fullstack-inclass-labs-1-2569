# Instructor Guide — Chapter 4 API Recovery Lab

เอกสารนี้ใช้คู่กับ [Lab 05](../labs/05-book-json-fetch-curl.md) สำหรับคาบที่ต้องกู้ความเข้าใจหลัง Chapter 4 ไม่เป็นไปตามแผน เป้าหมายไม่ใช่สอนเนื้อหาเดิมเร็วขึ้น แต่ทำให้ผู้เรียนเห็นเส้นทางเดียวกันซ้ำหลายมุม:

```text
user event → async function → HTTP request → response/status → JSON → UI state
```

หนังสือฉบับเต็ม `slide/dti201-full-stack-course-book.pdf` เป็นแหล่ง authoritative สำหรับลำดับ Chapter 4 → 5 → 6 → 8 ดู mapping ราย section และการแปล domain example ได้ที่ [Full Course Book Alignment](book-api-react-lab-alignment.md)

## Teaching decision

แบ่งเนื้อหาเป็นสองชั้น:

- **Core, 180 นาที:** async/Promise, HTTP, Fetch, NPS GET, JSON CRUD, error diagnosis
- **Optional, 30–45 นาที:** React bridge หลังผู้เรียนส่วนใหญ่ผ่าน CRUD เท่านั้น

เกณฑ์เปิด React คืออย่างน้อย 80% ของห้องแสดง `POST 201`, `PATCH 200`, `DELETE 204` และอธิบาย `fetch + response.ok` ได้ ถ้ายังไม่ถึง ให้เก็บ React ไว้ Lab 06

## สิ่งที่พบจากสื่อปัจจุบัน

### `Chapter4-dti201-full-stack-course-book (1).pdf`

Chapter 4 ครอบคลุมกว้างกว่าห้องทดลองเดิมมาก:

- HTTP request/response, header, MIME type, cookie
- method semantics: GET, POST, PUT, PATCH, DELETE; safe/idempotent
- status: 200, 201, 204, 400, 401, 403, 404, 409, 422, 500
- JSON success/error contract และชนิดข้อมูลอื่น
- polling, long polling, SSE, WebSocket
- Fetch network failure เทียบกับ HTTP error
- idle/loading/success/empty/error/cancelled
- CORS, curl และ Network panel

Recovery lab จึงเน้นหัวข้อที่นักศึกษาต้องใช้เขียนโปรแกรมทันที ส่วน media format และ real-time patterns ให้ทบทวนเชิงเปรียบเทียบ ไม่ควรแทรก coding task เพิ่มในคาบนี้

### `AJAX_training_index.html`

เหมาะกับ concept recap 15–20 นาที มี interaction เรื่อง event loop, URL, Fetch pipeline, error และ JSON → DOM แต่ไม่มี writable API จึงยังไม่ครอบคลุม CRUD

### `20260908-HTTP-FetchAPI (1).png`

ใช้เปิด mental model ได้ดี ให้ผู้เรียนชี้เองว่า “customer, order ticket, barista, status board” ตรงกับ frontend, request, backend และ response อย่างไร ภาพแสดง GET/POST/PATCH; ผู้สอนเติม DELETE และ `204 No Content` ด้วยปากเปล่า

### `JavaScript-Ajax-and-Fetch-3809063`

เก็บแนวคิด NPS request และ JSON → DOM แต่ไม่ควร live-code ตามไฟล์เดิมตรง ๆ เพราะ:

- ตัวอย่างเดิมมี key ฝังใน client source
- มีทั้ง Fetch และ Axios ทำให้ cognitive load สูงเกิน recovery class
- callback หลายตัวทำให้เส้นทาง error/success กระจาย
- ไม่มี CRUD และ UI state ครบ

ใช้ `async/await` และ `requestJson()` กลางเพียง pattern เดียวก่อน แล้วค่อยเปรียบเทียบ `.then()` เพื่ออธิบายว่าเป็น Promise เดียวกัน

## ก่อนเข้าห้อง 30 นาที

1. ตรวจ Node.js:

   ```powershell
   node --version
   ```

   ต้องเป็น 20.6 ขึ้นไป

2. ไปที่ companion app:

   ```powershell
   cd examples\05-api-async-crud
   ```

3. ถ้า key ของผู้สอนอยู่ใน sibling repository แล้ว สามารถ copy เฉพาะเครื่องผู้สอน:

   ```powershell
   Copy-Item ..\..\..\JavaScript-Ajax-and-Fetch-3809063\.env .env
   git check-ignore -v .env
   ```

   ผลต้องยืนยันว่า `.env` ถูก ignore ห้ามเปิดไฟล์นี้บน projector

4. ทดสอบ live mode:

   ```powershell
   npm start
   ```

   เปิด terminal ที่สอง:

   ```powershell
   Invoke-RestMethod 'http://127.0.0.1:3000/api/parks?stateCode=CA&limit=1'
   ```

5. ถ้า network, certificate หรือ NPS ไม่พร้อม ให้ใช้แผนสำรองทันที:

   ```powershell
   npm run start:offline
   ```

6. รัน smoke test:

   ```powershell
   npm test
   npm run reset
   ```

7. เปิด tab ล่วงหน้า:

   - `slide/AJAX_training_index.html`
   - ภาพ HTTP coffee shop
   - `http://127.0.0.1:3000`
   - DevTools Console + Network โดยเปิด Preserve log และปิด cache

## Run sheet สำหรับ 180 นาที

| เวลา | กิจกรรม | จุดตรวจ |
|---:|---|---|
| 0–10 | ตั้ง recovery contract: วันนี้วัดจากหลักฐาน ไม่วัดจากจำ syntax | ผู้เรียนรู้ finish line 4 ชิ้น |
| 10–25 | ใช้ interactive HTML ทำ concept diagnostic | ทุกคู่ตอบ `404 เข้า catch หรือไม่` |
| 25–45 | Predict → run async trace → เพิ่ม microtask | อธิบาย 1→2→3→4→5 ได้ |
| 45–65 | Coffee shop HTTP model + contract table | แยก method/URL/header/body/status |
| 65–80 | curl/PowerShell อ่าน health, parks, notes | ชี้ Content-Type และ JSON path |
| 80–90 | พัก | — |
| 90–115 | Live-code `requestJson()` ทีละ boundary | เห็น Promise ของ fetch และ body |
| 115–140 | NPS GET + loading/empty/error + Network | browser ไม่เห็น NPS key |
| 140–165 | Pair CRUD: คนหนึ่งขับ คนหนึ่งอ่าน Network | 201, 200, 204 ครบ |
| 165–175 | Failure injection 404 หรือ 422 | อธิบาย HTTP vs network |
| 175–180 | Exit ticket + save evidence + stop server | ส่ง ReasoningTrace สั้น ๆ |

ถ้าคาบสั้น 120 นาที ให้ตัด NPS DOM extension และ React ออก แต่ยังต้องทำ async trace, generic fetch handler และ CRUD ด้วย Network/curl

## วิธีสอนแต่ละช่วง

### 1. Predict ก่อน execute

ให้ผู้เรียนเขียนคำตอบบนกระดาษหรือ chat ก่อนกดปุ่ม ทุกตัวอย่างใช้วงจรเดียวกัน:

1. **Predict:** จะเห็นอะไรและลำดับใด
2. **Observe:** รันและดู Console/Network
3. **Explain:** ใช้คำว่า call stack, Promise, request, response
4. **Modify:** เปลี่ยนหนึ่งตัวแปรแล้วทำนายใหม่

อย่าเริ่มด้วย event-loop diagram เต็มรูป ให้ trace สั้นสร้างความขัดแย้งกับความคาดเดาก่อน แล้วจึงวาด call stack → microtask → task

### 2. Fetch มี asynchronous boundary สองชั้น

เขียนสองบรรทัดนี้แยกกันบนจอ:

```js
const response = await fetch(url);
const data = await response.json();
```

ถามก่อนเฉลย:

- บรรทัดแรกได้ข้อมูล business object หรือยัง
- ทำไม body จึงอ่านอีกครั้ง
- ถ้า status 204 ควรเรียก `.json()` หรือไม่

### 3. สอน status เป็น contract ไม่ใช่รายการให้ท่อง

ให้จำชุดเล็กจาก flow จริง:

```text
GET success      200
POST created     201
DELETE no body   204
missing          404
invalid fields   422
unexpected bug   500
rate limited     429
```

หลังจากนั้นให้ผู้เรียนใช้ DevTools หา status ไม่ใช่ให้ผู้สอนบอก

### 4. แยก NPS read-only ออกจาก local writable resource

อธิบายตรง ๆ ว่า CRUD ไม่ได้แปลว่าทุก external API อนุญาตให้เราแก้ข้อมูล NPS ดังนั้น:

- `/api/parks` เป็น Read จาก authoritative external API
- `/api/notes` เป็น CRUD กับข้อมูลที่แอปเราเป็นเจ้าของ

นี่คือ boundary สำคัญของ full-stack: ownership และ authorization มาก่อน HTTP method

### 5. Key handling

NPS แนะนำให้เก็บ key เป็น private และส่งผ่าน `X-Api-Key`; default rate limit ที่เอกสารระบุคือ 1,000 requests ต่อชั่วโมง พร้อม response header บอกจำนวนคงเหลือ

ใน architecture นี้ browser เรียก local proxy โดยไม่มี key แล้ว server จึงเติม header ไป NPS ให้เปิด Network panel พิสูจน์กับนักศึกษาว่า key ไม่ปรากฏใน browser request

ไฟล์ `.env` ป้องกัน accidental Git publication เท่านั้น การใช้ตัวแปรชื่อ `VITE_*` จะนำค่าเข้า browser bundle จึงไม่ใช่ secret storage

### 6. CRUD pair protocol

ให้นักศึกษาทำงานคู่และสลับบทบาททุก request:

- **Driver:** กด UI หรือเขียน request
- **Observer:** พูด method, URL, body, expected status ก่อนส่ง แล้วตรวจ Network หลังส่ง

ห้ามนับว่าเสร็จเพราะ UI เปลี่ยนอย่างเดียว ต้องชี้ request evidence ได้

## Failure injection menu

เลือกเพียง 2–3 กรณีตามเวลาที่เหลือ:

| Failure | วิธีสร้าง | Expected evidence | แนวคิด |
|---|---|---|---|
| 404 | เปิด `/api/not-found` หรือลบ ID เดิมซ้ำ | fulfilled Fetch + `ok=false` | HTTP error |
| 422 | POST note สั้นกว่า 10 ตัวอักษร | structured JSON error | validation contract |
| network | หยุด server แล้วกด reload | rejected Promise ไม่มี HTTP status | transport failure |
| empty | query filter ที่ไม่มี note | 200 + `[]` | empty ไม่ใช่ error |
| upstream/TLS | live NPS ใช้ไม่ได้ | local 502 พร้อม recovery | proxy/upstream boundary |
| rate limit | อธิบายจาก header ห้ามยิง request จำนวนมาก | 429 concept | responsible API use |

อย่าสร้าง 500 ด้วยการทำ server เสียต่อหน้าห้องถ้าเวลาน้อย ใช้ status board ในภาพและถามว่าผู้ใช้ควรเห็นอะไรแทน stack trace

## Formative questions ที่ใช้หยุดห้อง

หลังแต่ละ checkpoint ให้สุ่มถามหนึ่งข้อ:

- Promise pending มี value ให้ render แล้วหรือยัง
- `fetch()` สำเร็จระดับ network หมายความว่า business operation สำเร็จหรือไม่
- `Content-Type` ของ request กับ response ทำหน้าที่เหมือนกันหรือไม่
- ทำไม `POST` retry แบบไม่คิดอาจสร้างข้อมูลซ้ำ
- `204` ต่างจาก `200` ที่ body ว่างอย่างไร
- empty array ควรเข้า error state หรือ empty state
- curl ผ่านแต่ browser ไม่ผ่าน ควรตรวจ CORS ตรงไหน
- ถ้า key อยู่ใน `.env` ของ Vite key ยังออกไป browser หรือไม่

## Rubric 10 คะแนน

น้ำหนักรักษาแนวเดียวกับ Chapter 4:

| มิติ | คะแนน | หลักฐานขั้นต่ำ |
|---|---:|---|
| HTTP semantics | 2.5 | method, endpoint, status ตรงกับ intent |
| JSON contract | 2.0 | อธิบาย success/error shape และ JSON path |
| Fetch/async/error | 2.5 | async trace, `response.ok`, loading/error |
| Diagnosis | 2.0 | Network/curl evidence และ failure case |
| Accessibility/security | 1.0 | status text, disabled control, no key, `textContent` |

หักทั้งมิติ security หากพบ key ใน commit/screenshot และให้ผู้เรียน revoke/rotate key ก่อนทำต่อ แต่ไม่ให้ผู้เรียนส่ง key มาให้ผู้สอน

## Common misconceptions และประโยคแก้

| ผู้เรียนพูด | ให้ถามกลับ |
|---|---|
| “await ทำให้ JavaScript synchronous” | หน้าเว็บยังกดปุ่มอื่นได้ระหว่างรอหรือไม่; await หยุด scope ใด |
| “404 คือ catch” | request ไปถึง serverและได้ Response หรือยัง; `response.ok` เป็นอะไร |
| “JSON คือ JavaScript object” | ขณะอยู่บน network เป็น text/bytes หรือ object; แปลงตอนไหน |
| “CORS คือ permission” | curl ผ่านแต่ browser ไม่ผ่านได้อย่างไร; ใคร enforce CORS |
| “อยู่ใน .env แล้วปลอดภัย” | process ใดอ่าน `.env`; ค่าถูก bundle ไป client หรือไม่ |
| “DELETE ต้องได้ JSON” | contract บอก 204 หรือไม่; 204 มี body ได้หรือไม่ |

## React go/no-go

เปิด optional React bridge เมื่อ:

- นักศึกษาส่วนใหญ่ทำ core evidence ครบ
- ไม่มี key อยู่ client
- ผู้เรียนอธิบาย loading/error/empty โดยไม่ดูคำตอบ
- เหลืออย่างน้อย 30 นาทีจริง

React bridge สอนเพียง mapping ต่อไปนี้:

```text
API result → state → render
request on mount → effect
leave page/change query → effect cleanup + AbortController
```

ยังไม่สอน routing, global state, Axios หรือ form library ใน recovery session

## หลังคาบ

1. ให้ส่ง evidence ไม่ใช่ zip ทั้ง project
2. ตรวจ `git status --short` และ secret scan ก่อน push
3. ให้ผู้เรียนที่ยังไม่ผ่านทำ core checkpoint ต่อก่อน Lab 06
4. ใช้คำตอบ exit ticket แบ่งกลุ่มต้น Lab 06: Promise, HTTP contract, DOM/UI state
5. reset demo data และหยุด server:

   ```powershell
   npm run reset
   # กด Ctrl+C ใน terminal ของ server
   ```

## Official references

- NPS API documentation: <https://www.nps.gov/subjects/developer/api-documentation.htm>
- NPS API guide (authentication and rate limits): <https://www.nps.gov/subjects/developer/guides.htm>
- MDN Fetch guide: <https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch>
- React effect guidance: <https://react.dev/learn/synchronizing-with-effects>
