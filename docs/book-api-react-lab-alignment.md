# Full Course Book Alignment — API, React และ CRUD

เอกสารหลักของนักศึกษาคือ `slide/dti201-full-stack-course-book.pdf` จำนวน 157 หน้า ไม่ใช่เฉพาะไฟล์ Chapter 4 extract การจัด hands-on จึงใช้ลำดับของหนังสือเป็นแกน แล้วเปลี่ยน domain example ให้เหมาะกับ lab โดยไม่เปลี่ยน concept

## เส้นทางจากหนังสือไปยัง public labs

| หนังสือ | Printed pages | แนวคิดหลัก | Public lab |
|---|---:|---|---|
| Chapter 4 | 35–46 | HTTP, headers/MIME/cookies, methods/status, JSON, Fetch, UI states, CORS, curl | [Lab 05](../labs/05-book-json-fetch-curl.md) |
| Chapter 5 | 47–54 | React/Vite, component, props, state, derived data, key, routing, project structure | [Lab 06](../labs/06-react-book-explorer.md) |
| Chapter 6 | 55–61 | controlled form, state machine, validation, API service, Effect, cleanup | [Lab 07](../labs/07-react-forms-api-service.md) |
| Chapter 7 | 63 onward | integrated practical and evidence | [Lab 08](../labs/08-midterm-ai-off-practical.md) |
| Chapter 8 | 69–75 | Node/Express, routing, middleware, validation, CRUD API | [Lab 09](../labs/09-express-book-api.md) |
| Chapters 9–10 | 77 onward | database design, SQL/repository/persistence | [Lab 10](../labs/10-book-database-crud.md) |

ลำดับที่ห้ามสลับใน recovery path คือ:

```text
Chapter 4 contract + async
  → Chapter 5 React render/state
  → Chapter 6 form/effect/API service
  → Chapter 8 สร้าง backend CRUD เอง
```

## Chapter 4 reading-to-lab guide

ให้นักศึกษาเปิดหนังสือหน้าที่พิมพ์ 35–46 ระหว่างทำ Lab 05 และเติม evidence column ของตนเอง

| Section | สิ่งที่หนังสือวางไว้ | Hands-on/evidence |
|---:|---|---|
| 4.1–4.2 | API เป็นข้อตกลงระหว่างระบบและ learning outcomes | วาด Browser → local API → NPS และบอกว่าแต่ละลูกศรส่งอะไร |
| 4.3 | โครงสร้าง HTTP request/response | Network screenshot ที่ชี้ method, target, header, body, status |
| 4.4 | headers, MIME type และ cookie | หา `Content-Type`, `Accept`; อธิบายว่า cookie เป็น state ไม่ใช่ JSON body |
| 4.5 | GET/POST/PUT/PATCH/DELETE, safe และ idempotent | จัด method ลงตาราง intent; อธิบายผลของการ retry POST เทียบกับ DELETE |
| 4.6 | status code เป็นส่วนหนึ่งของ contract | พิสูจน์ 200, 201, 204, 404/422; จำลอง 500 |
| 4.7 | JSON success และ structured problem details | เปรียบเทียบ note success body กับ validation error body |
| 4.8 | CSV, XML, JSON และ schema | เลือก format สำหรับ menu/list, nested order และ validation พร้อมเหตุผล |
| 4.9 | image/video/audio และ MIME | concept check: เลือก JPG/PNG/SVG/WebP/MP4/MP3 ให้ตรง use case; ไม่เพิ่ม media coding task |
| 4.10 | polling, long polling, SSE, WebSocket | จับคู่ coffee queue status กับ pattern และอธิบาย trade-off 1 ข้อ |
| 4.11 | Fetch: network failure ≠ HTTP failure | `404` ได้ fulfilled Response แต่ `response.ok=false`; หยุด serverเพื่อดู rejected Promise |
| 4.12 | idle/loading/success/empty/error/cancelled | ชี้แต่ละ state ใน UI; ใช้ delayed endpoint ฝึก cancel |
| 4.13 | same-origin policy และ CORS | เปรียบเทียบ browser กับ curl; ย้ำว่า CORS ไม่ใช่ authorization |
| 4.14 | curl และ Network panel | ส่ง request เดียวกันสองเครื่องมือแล้วเทียบ evidence |
| 4.15 | practical API client | ทำ Checkpoint 1–7 ของ Lab 05 |
| 4.16 | rubric และ oral questions | ใช้ rubric เดียวใน instructor guide |
| 4.17 | summary | เขียน ReasoningTrace 5 ช่องและ exit ticket |

### คำสั่งเสริมสำหรับหัวข้อที่อยู่ในหนังสือ

จำลอง status โดยไม่ทำ server พังจริง:

```bash
curl -i http://127.0.0.1:3000/api/demo/status/500
curl -i http://127.0.0.1:3000/api/demo/status/429
```

ฝึก cancellation ใน browser Console:

```js
const controller = new AbortController();

fetch("/api/demo/delay?ms=5000", { signal: controller.signal })
  .then((response) => response.json())
  .then(console.log)
  .catch((error) => console.log(error.name));

setTimeout(() => controller.abort(), 500);
```

expected output คือ `AbortError` ซึ่งเป็น cancelled state ไม่ควรแสดงเป็น server error

### Safe และ idempotent quick check

| Method | Safe | โดยเจตนา idempotent | สิ่งที่ต้องระวัง |
|---|---|---|---|
| GET | yes | yes | ต้องไม่แอบเปลี่ยนข้อมูล |
| POST | no | no | retry อาจสร้างซ้ำ; บางระบบใช้ idempotency key |
| PUT | no | yes | ส่ง representation เต็มตาม contract |
| PATCH | no | ขึ้นกับ contract | operation บางชนิด เช่น increment อาจทำซ้ำแล้วได้ผลต่าง |
| DELETE | no | yes | state ปลายทางเหมือนเดิมแม้ response ครั้งหลังอาจเป็น 404 |

## Domain translation: อย่าให้ชื่อ resource กลบ concept

หนังสือใช้ **Campus Coffee Queue**, recovery lab ใช้ **NPS Park Notes**, และโปรเจกต์หลักใช้ **Course Book Explorer** นักศึกษาต้องแปล intent ไม่ใช่คัดลอกชื่อ field

| Intent | Campus Coffee Queue ในหนังสือ | Recovery lab | Course Book Explorer |
|---|---|---|---|
| อ่าน catalog | `GET /api/menu` | `GET /api/parks` | `GET /api/books` |
| สร้างข้อมูลของผู้ใช้ | `POST /api/orders` | `POST /api/notes` | `POST /api/reading-notes` |
| แก้บาง field | `PATCH /api/orders/:id` | `PATCH /api/notes/:id` | `PATCH /api/reading-notes/:id` |
| ลบ resource | `DELETE /api/orders/:id` | `DELETE /api/notes/:id` | `DELETE /api/reading-notes/:id` |
| list data path | `data` ตาม contract | NPS parks อยู่ที่ `data`; notes เป็น array | กำหนดใน API contract ของกลุ่ม |

ให้ผู้เรียนตอบทุกครั้งว่า “resource นี้ใครเป็นเจ้าของ และ client มีสิทธิ์เปลี่ยนหรือไม่” NPS park data จึงใช้ Read เท่านั้น ส่วน note/order เป็นข้อมูลของแอปที่ออกแบบ CRUD ได้

## Chapter 5–6 bridge to React

หลัง Chapter 4 core ผ่าน จึงเปลี่ยนเฉพาะ presentation model:

| Book concept | Vanilla Lab 05 | React Lab 06–07 |
|---|---|---|
| render จาก data | DOM nodes + `textContent` | JSX จาก props/state |
| local memory | variables/arrays | `useState` |
| derived list | filter ก่อน render | คำนวณระหว่าง render; ไม่เก็บ state ซ้ำโดยไม่จำเป็น |
| stable identity | `data-id` | `key` |
| request lifecycle | event handler + status text | Effect/service + state machine |
| cleanup | `AbortController` เมื่อ query ใหม่ | Effect cleanup เมื่อ dependency เปลี่ยน/unmount |
| API base | local relative URL | `VITE_API_BASE_URL` สำหรับ URL เท่านั้น ไม่ใส่ secret |

Chapter 5 ให้เน้น component/props/state ก่อน ส่วน Chapter 6 จึงเพิ่ม controlled form, validation, API service, Effect และ cleanup ไม่ควรสอน Axios หรือ state library เพิ่มก่อนจบสองบทนี้

## Exit ticket จากหนังสือ

ให้นักศึกษาตอบโดยไม่เปิด code:

1. `fetch()` กับ `response.json()` คืน Promise คนละตัวเพราะอะไร
2. เหตุใด `404` เป็น HTTP evidence แต่ network failure ไม่มี status
3. retry method ใดเสี่ยงสร้างข้อมูลซ้ำ และป้องกันระดับ contract ได้อย่างไร
4. JSON success กับ JSON problem detail ต่างกันที่ intent ใด
5. curl ผ่านแต่ browser ไม่ผ่าน มีสมมติฐานเรื่อง CORS อย่างไร
6. state ใดของ UI ที่มักถูกลืมระหว่าง loading, empty, error และ cancelled
7. React เปลี่ยน HTTP contract หรือเปลี่ยนวิธีนำ data ไป render
