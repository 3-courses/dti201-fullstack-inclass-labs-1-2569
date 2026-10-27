# Lab 09 — Chapter 8: Express API สำหรับ Course Book Explorer

ในบทก่อน คุณสร้างหน้า **Course Book Explorer** ด้วย React + Vite แล้ว หน้าเว็บแสดงหนังสือ รับการกดปุ่ม และใช้ `fetch` ส่งคำขอได้ คาบนี้เราจะทำโปรแกรมฝั่งเซิร์ฟเวอร์ให้รับคำขอนั้น: เมื่อขอดูหนังสือ จะส่งรายการกลับมา; เมื่อเพิ่มหนังสือ จะตรวจข้อมูลก่อนบันทึก แล้วบอกว่าทำสำเร็จหรือกรอกผิดตรงไหน

หนังสือบทที่ 8 ใช้คำสั่งซื้อร้านกาแฟเป็นตัวอย่าง หลักการเดียวกันใช้กับหนังสือได้ Lab นี้ชื่อ **09** เพราะ Lab 08 เป็นสอบกลางภาค

## เป้าหมายและเตรียมตัว

เมื่อจบคาบ คุณควรอธิบาย **เส้นทางของคำขอและคำตอบ**, แยกข้อมูลจาก URL กับ JSON, เลือกรหัสสถานะ และตรวจผลด้วย `curl` หรือ DevTools ได้ อ่านหนังสือ Chapter 8 §8.1–8.10 ควบคู่กับ [สไลด์ฉบับปรับปรุง](../slide/09-express-book-api/express-api-v2.pdf) และเติม [worksheet](../slide/09-express-book-api/request-map-workbook.pdf) ระหว่างทำ

มี **6 กิจกรรม (0–5)**: ดูคำตอบจริง → แยก GET/POST → แบ่งหน้ารายการ → ค้นด้วยรหัส → เพิ่มหนังสือ → ตรวจข้อผิดพลาด ภาพเป้าหมายอยู่ในสไลด์หน้า 4: หน้า React แสดงหนังสือที่เพิ่งเพิ่ม และ API ตอบได้ทั้งกรณีสำเร็จและกรณีกรอกผิด

| กิจกรรมใน Lab | สไลด์ฉบับปรับปรุง | สิ่งที่ตรวจหรือสร้าง |
|---|---:|---|
| 0 | หน้า 18 | สร้างโปรเจกต์ Express และตรวจ `/health` ด้วย `curl` |
| 1 | หน้า 20–21 | สร้าง route หนังสือและแยก GET/POST |
| 2 | หน้า 25 | ตรวจ `limit` และ `offset` ก่อนแบ่งหน้า |
| 3 | หน้า 27 | แยก ID ผิดรูปกับหนังสือที่ไม่พบ |
| 4 | หน้า 33 | เพิ่มหนังสือและตรวจผล 201, 409, 422 |
| 5 | หน้า 38 | ส่ง JSON ผิดรูปและตรวจคำตอบข้อผิดพลาด |

ดู [แผนผังและดัชนีสไลด์](../slide/09-express-book-api/slide-index-v2.md) เมื่อต้องการย้อนกลับไปทบทวนแนวคิดก่อนทำกิจกรรม

**สำหรับคาบนี้ ให้ยึดขั้นตอนสร้างโปรเจกต์ใหม่ด้านล่าง** หากสไลด์ยังแสดงคำสั่งเปิด starter ด้วย `npm ci` ให้ใช้สไลด์อธิบายแนวคิด แล้วทำตามคำสั่งใน Lab นี้แทน

### คำที่ต้องรู้ก่อนเริ่ม

- **JavaScript** คือภาษาที่เขียนโค้ด; **Node.js** รัน JavaScript ฝั่งเซิร์ฟเวอร์; **Express** ช่วยรับคำขอและเลือกฟังก์ชันที่จะตอบ
- **คำขอ (request)** คือสิ่งที่เบราว์เซอร์ส่งไป เช่น `GET /api/books`; **คำตอบ (response)** มีรหัสสถานะ เช่น `200` และอาจมี JSON
- **API** คือข้อตกลงว่าเรียกเส้นทางไหน ส่งข้อมูลอะไร และจะได้อะไรกลับมา
- **route** คือกติกาจับคู่ method + path กับฟังก์ชัน; **middleware** คือขั้นตอนที่ทำงานก่อนหรือหลัง route เช่น อ่าน JSON

### รู้จักไฟล์และดูผลให้เป็น

| งานจากบทก่อน | งานในบทนี้ | ดูผลที่ไหน |
|---|---|---|
| `App.tsx`: แสดงหน้าจอ React | `src/app.js`: route และการตรวจข้อมูล | DevTools → Network → เลือกคำขอ → Headers/Response |
| `bookApi.ts`: เรียก `fetch` | `src/server.js`: เปิดพอร์ต 3001 | terminal ที่รัน `npm run dev` |
| `package.json`: คำสั่ง Vite | `src/books.js`: หนังสือตัวอย่างในหน่วยความจำ | `curl -i` เพื่อดู status, headers, body |

`.tsx` คือ TypeScript ที่เขียน JSX, `.ts` คือ TypeScript, `.js` คือ JavaScript ที่ Node.js รัน, และ `.json` คือข้อความข้อมูลหรือการตั้งค่า เซิร์ฟเวอร์ตัวอย่างเก็บข้อมูลในหน่วยความจำ เมื่อ restart ข้อมูลที่เพิ่มจะหาย; บทฐานข้อมูลจะทำให้เก็บถาวร

ใช้ Node.js 20 ขึ้นไปและ npm. **เริ่มจากศูนย์ใน repository งานของตนเอง** เปิด terminal ที่ root ของ repository งาน (หรือโฟลเดอร์งานที่ต้องการ) แล้วสร้างโฟลเดอร์ backend ใหม่ข้างโปรเจกต์ React เดิม อย่ารันคำสั่งนี้ภายในโฟลเดอร์ React:

```bash
mkdir 09-express-book-api
cd 09-express-book-api
npm init -y
npm install express
npm pkg set type=module 'scripts.dev=node --watch src/server.js' 'scripts.start=node src/server.js'
mkdir src
printf 'node_modules/\n.env\n' > .gitignore
```

`npm init -y` สร้าง `package.json`; `npm install express` ติดตั้ง Express และสร้าง lockfile. `npm run dev` ใช้ Node watch mode เพื่อ restart เมื่อแก้ไฟล์; `npm start` รันครั้งเดียว. สองคำสั่งนี้กำหนดไว้เองใน `package.json` ด้วย `npm pkg set`. หลังสร้างไฟล์ในกิจกรรม 0 จึงค่อยเปิดเซิร์ฟเวอร์. โปรเจกต์นี้แยกจาก React + Vite เดิม; เมื่อถึงช่วงเชื่อม frontend ให้เปิดทั้งสองโปรเจกต์คนละ terminal

## ข้อตกลง API

| คำขอ | ผลสำเร็จ | กรณีอื่น |
|---|---|---|
| `GET /health` | 200, status/service | — |
| `GET /api/books?limit=1&offset=0` | 200, `{data,pagination}` | 422 query ผิด |
| `GET /api/books/:id` | 200, `{data}` | 422 ID ผิดรูป; 404 ID ถูกแต่ไม่พบ |
| `POST /api/books` | 201, `{data}` และ `Location` | 400 JSON อ่านไม่ได้; 422 ฟิลด์ผิด; 409 ชื่อซ้ำ |
| endpoint อื่น | — | 404 แบบ problem JSON |

ข้อผิดพลาดใช้รูปแบบนี้ (รายการ `errors` มีเมื่ออธิบายช่องที่ผิดได้):

```json
{
  "type": "about:blank",
  "title": "Invalid input",
  "status": 422,
  "requestId": "...",
  "errors": { "title": ["Use at least 3 characters"] }
}
```

ค่า `X-Request-Id` ใน header ต้องตรงกับ `requestId` ใน body

## Activity 0 — สร้างเซิร์ฟเวอร์และดูคำตอบครั้งแรก (15 นาที)

สร้าง `src/app.js` ด้วย editor แล้วพิมพ์โค้ดนี้ ลำดับมีผล: middleware ทำงานก่อน route; route ที่ไม่พบและ error handler อยู่ท้ายไฟล์

```js
import express from 'express';
import { randomUUID } from 'node:crypto';

export const app = express();
app.disable('x-powered-by');

app.use((req, res, next) => {
  req.requestId = randomUUID();
  res.set('X-Request-Id', req.requestId);
  next();
});
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'course-book-api' });
});

// กิจกรรม 1–4: เพิ่ม route หนังสือตรงนี้ ก่อน route 404

app.use((req, res) => {
  res.status(404).type('application/problem+json').json({
    type: 'about:blank', title: 'Endpoint not found', status: 404,
    requestId: req.requestId
  });
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  res.status(500).type('application/problem+json').json({
    type: 'about:blank', title: 'Internal server error', status: 500,
    requestId: req.requestId
  });
});
```

สร้าง `src/server.js` แล้วพิมพ์:

```js
import { app } from './app.js';

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => console.log(`Course Book API on http://localhost:${port}`));
```

ก่อนรัน ให้ทำนายว่า `/health` จะตอบอะไร แล้ววาดเส้นทางจาก terminal ไปยัง Express และกลับมาพร้อมคำตอบ จากโฟลเดอร์ `09-express-book-api` รัน `npm run dev` และเปิด terminal อีกหน้าสำหรับ `curl`. หากพอร์ต 3001 ถูกใช้อยู่ ให้หยุดเซิร์ฟเวอร์เก่าก่อน

ลอง `curl -i http://localhost:3001/health` และ `curl -i http://localhost:3001/not-there`. จดรหัสสถานะ ชนิดคำตอบ และ `X-Request-Id`; เทียบกับโค้ดใน `src/app.js`

## Activity 1 — สร้าง route GET/POST และดูข้อมูลในคำขอ (12 นาที)

สร้าง `src/books.js` เป็นข้อมูลตัวอย่างในหน่วยความจำ:

```js
export const books = [
  { id: 1, title: 'Web Basics', author: 'Nok', sourceType: 'book', summary: 'พื้นฐานเว็บ' },
  { id: 2, title: 'React Practice', author: 'Lee', sourceType: 'course', summary: 'แบบฝึก React' }
];
```

เพิ่ม `import { books } from './books.js';` ที่ต้น `src/app.js`. จากนั้นแทนบรรทัด comment `กิจกรรม 1–4` ด้วย route ต่อไปนี้ **ก่อน** route 404:

```js
app.get('/api/books', (req, res) => {
  res.json({ data: books.slice(0, 20), pagination: { limit: 20, offset: 0 } });
});

app.get('/api/books/:id', (req, res) => {
  // กิจกรรม 3: ตรวจ ID แล้วค้นหนังสือ
  res.status(501).json({ title: 'Complete Activity 3' });
});

app.post('/api/books', (req, res) => {
  // กิจกรรม 4: ตรวจ body แล้วเพิ่มหนังสือ
  res.status(501).json({ title: 'Complete Activity 4' });
});
```

ทำนายผลของ `GET /api/books`, `POST /api/books`, `GET /api/books/1`, `GET /api/books/999`. ชี้ว่า path parameter อยู่ใน `req.params`, query ใน `req.query`, JSON body ใน `req.body`. ลอง `curl -i http://localhost:3001/api/books`. ตอนนี้ GET collection ทำงาน; POST และ GET รายการเดียวคืน 501 เพื่อบอกจุดที่ต้องทำต่อ

## Activity 2 — ตรวจ query ก่อนอ่านข้อมูล (12 นาที)

แก้ `GET /api/books` ให้ `limit` เริ่มที่ 20 และเป็นจำนวนเต็ม 1–100; `offset` เริ่มที่ 0 และเป็นจำนวนเต็มไม่ติดลบ. ตรวจข้อความก่อนแปลงเป็น number เพื่อปฏิเสธ `1.5`, `abc` และค่าว่าง. ถ้าผิดคืน 422 พร้อม `errors.limit` หรือ `errors.offset`; ถ้าถูกส่ง `{data:books.slice(offset,offset+limit),pagination:{limit,offset}}`

```bash
curl -i 'http://localhost:3001/api/books?limit=1&offset=1'
curl -i 'http://localhost:3001/api/books?limit=0'
curl -i 'http://localhost:3001/api/books?offset=-1'
```

เขียนก่อนทดลองว่า `limit=0` จะได้อะไรถ้าไม่ตรวจ แล้วอธิบายว่าทำไมต้องปฏิเสธ

## Activity 3 — ID ผิดรูปกับหนังสือไม่พบ (10 นาที)

แทน 501 ใน `GET /api/books/:id`. ยอมรับเฉพาะจำนวนเต็มบวกที่ปลอดภัย; `req.params.id` เป็นข้อความ. คืน 422 พร้อม `errors.id` สำหรับ `abc`, `0`, `1.5`; คืน 404 `Book not found` สำหรับ `999`; คืน 200 `{data:book}` สำหรับ `1`. ใช้ `books.find(book => book.id === id)` หลังตรวจ

```bash
curl -i http://localhost:3001/api/books/1
curl -i http://localhost:3001/api/books/abc
curl -i http://localhost:3001/api/books/999
```

อธิบายว่า 404 ของ `/api/books/999` ต่างจาก `/not-there` อย่างไร

## Activity 4 — ตรวจ body และสร้างทรัพยากร (20 นาที)

แทน 501 ใน `POST /api/books`. อนุญาตเฉพาะ `title`, `author`, `sourceType`, `summary` เป็น string. ตัดช่องว่างหัวท้าย; `title` อย่างน้อย 3 ตัวอักษร, `author` และ `summary` ไม่ว่าง, `sourceType` เป็น `book`, `documentation` หรือ `course`. ปฏิเสธฟิลด์อื่น เช่น `isAdmin` ด้วย 422 และ `errors` รายฟิลด์. `summary` ต้องเป็นข้อความที่เขียนเอง

ใช้ `books.some(...)` ตรวจชื่อซ้ำโดยไม่สนตัวพิมพ์เล็ก/ใหญ่แล้วคืน 409. เมื่อสำเร็จ สร้าง ID ใหม่จาก ID ที่มากที่สุดใน `books` บวก 1, `books.push(book)`, ตั้ง `Location: /api/books/<id>` แล้วตอบ 201 `{data:book}`

```bash
curl -i -X POST http://localhost:3001/api/books -H 'Content-Type: application/json' \
  -d '{"title":"Node Practice","author":"Mali","sourceType":"course","summary":"สรุปที่เขียนเอง"}'
curl -i -X POST http://localhost:3001/api/books -H 'Content-Type: application/json' \
  -d '{"title":"x","author":"","sourceType":"blog","summary":"","isAdmin":true}'
```

คำขอแรกได้ 201 กับ Location; ส่งซ้ำได้ 409; คำขอที่สองได้ 422 พร้อมหลายฟิลด์. GET หนังสือใหม่ด้วย Location

## Activity 5 — ข้อผิดพลาดที่ตามรอยได้ (12 นาที)

แก้ error handler ท้าย `src/app.js`: JSON อ่านไม่ได้จาก `express.json` ให้ 400 `Invalid JSON`; ข้อผิดพลาดไม่คาดหมายให้ 500 `Internal server error`. ตั้ง `Content-Type: application/problem+json`; body มี `type`, `title`, `status`, `requestId`. หากส่ง header ไปแล้วให้ `next(error)`. อย่าส่ง stack trace, request body, token หรือข้อความภายในของ 500 ไป client. เพิ่ม middleware ต้นไฟล์เพื่อบันทึก method/path/status/duration เมื่อคำตอบจบ โดยไม่บันทึก body

```bash
curl -i -X POST http://localhost:3001/api/books -H 'Content-Type: application/json' -d '{'
```

ทำนาย → ลอง → อธิบาย: JSON parser ผิดพลาดก่อนหรือหลัง route? ทำไม error handler อยู่ท้ายสุด? Express 5 ส่ง rejection จาก async route ที่คืน Promise ไปอย่างไร?

## ลองต่อกับหน้า React + Vite ที่ทำไว้

ทำส่วนนี้หลัง API ผ่านกิจกรรม 0–5 แล้ว เปิด Express ที่พอร์ต 3001 และ Vite ของงาน React ในอีก terminal หนึ่ง ถ้าแอปเดิมใช้ `bookApi.ts` ให้ดูฟังก์ชัน `getBooks` ก่อนแก้: API ใหม่ตอบ `{ data: [...], pagination: {...} }` จึงต้องอ่าน `body.data` ไม่ใช่ใช้ JSON ทั้งก้อนเป็น array

เพื่อให้ `fetch('/api/books')` จากหน้า Vite ส่งต่อไปยัง Express ระหว่างพัฒนา เพิ่ม proxy ใน `vite.config.ts` ของแอป React:

```ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/api': 'http://localhost:3001' },
  },
});
```

จากนั้นให้ service เรียก path แบบสั้นและอ่านรูปคำตอบให้ตรง:

```ts
type ApiBook = {
  id: number;
  title: string;
  author: string;
  sourceType: 'book' | 'documentation' | 'course';
  summary: string;
};

export async function getBooks(): Promise<Book[]> {
  const response = await fetch('/api/books');
  const body: { data: ApiBook[] } = await response.json();
  if (!response.ok) throw new Error('โหลดหนังสือไม่สำเร็จ');
  return body.data.map(book => ({ ...book, id: String(book.id) }));
}
```

`Book` ในตัวอย่าง React เดิมใช้ `id: string` แต่ API นี้ส่ง `id: number`; ตัวอย่างจึงแปลงเป็นข้อความก่อนส่งให้ UI หากงานของคุณปรับ type ให้ใช้ number แล้ว ก็ไม่ต้องแปลง หากมี `VITE_API_BASE_URL` ที่ชี้ตรงไปพอร์ต 3001 ให้แก้ service ในการทดลองนี้ให้เรียก `'/api/books'` ผ่าน proxy แทน

**ตรวจในเบราว์เซอร์:** เปิด DevTools → Network → เลือกคำขอ `/api/books`. ดู Request URL, Status, Response และเวลาที่ใช้ จากนั้นดู log ใน terminal ของ Express ว่ามี GET เดียวกัน ถ้า Vite เปิดคนละพอร์ตให้ใช้ URL ที่ terminal แสดง การตั้งค่า proxy นี้ใช้ระหว่างพัฒนา; เมื่อเผยแพร่จริงต้องกำหนดเส้นทาง API ตามสภาพแวดล้อมที่ใช้

อ่าน [การตั้งค่า proxy ของ Vite](https://vite.dev/config/server-options.html#server-proxy) เมื่อสงสัยว่าทำไมคำขอจากพอร์ตของ Vite ไปถึง Express ได้

## ส่งหลักฐานและอธิบายปากเปล่า

ส่งใน repository ส่วนตัว: โค้ด, ตารางคำขออย่างน้อย 10 กรณี (method/path/input → คาดว่า → status จริง → หลักฐาน), request ID จากข้อผิดพลาดหนึ่งกรณี, และ worksheet ที่เติมจากการทดลอง. เพิ่ม automated tests หากมีเวลา; curl เป็นหลักฐานขั้นต่ำ. อย่า commit `node_modules`, `.env`, ข้อมูลรับรอง หรือ log ที่มี body

ตอบปากเปล่า: ทำไม backend ตรวจข้อมูลซ้ำหลัง frontend? อะไรเป็นกฎธุรกิจ (ชื่อซ้ำ) และอะไรเป็นการตรวจรูปแบบ? ทำไม ID ผิดรูปได้ 422 แต่ ID ไม่พบได้ 404? ถ้า store เปลี่ยนเป็น PostgreSQL ในบทถัดไป ข้อตกลง HTTP ใดควรคงเดิม?

แหล่งอ่าน: [Express routing](https://expressjs.com/en/guide/routing.html), [middleware](https://expressjs.com/en/guide/using-middleware.html), [Express 5 error handling](https://expressjs.com/en/5x/guide/error-handling/).
