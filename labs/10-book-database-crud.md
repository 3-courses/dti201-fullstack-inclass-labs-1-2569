# Lab 10 — จาก array สู่ MongoDB Atlas: ให้ข้อมูลหนังสืออยู่หลัง restart

**สถานการณ์:** แอปร้านหนังสือของเราเพิ่มหนังสือได้ แต่ข้อมูลหายเมื่อปิด Express เพราะ Lab 09 เก็บใน array ของ Node.js วันนี้เราจะย้ายรายการหนังสือไป MongoDB แล้วใช้หน้า React เดิมอ่านข้อมูลกลับมา

โปรเจกต์ของรายวิชาชื่อ **Course Book Explorer**: คาบนี้ทำส่วนรายการหนังสือของร้าน ยังไม่มีราคา สต็อก ตะกร้า หรือการชำระเงิน อ่าน [แบบจำลองข้อมูลและการนำไปใช้ในแอป](../docs/lab10-book-data-model.md) ประกอบ อย่าส่ง field ราคา/สต็อกเข้า schema ปัจจุบันโดยยังไม่ออกแบบและปรับ validation

**เมื่อจบ:** POST → จด `id` → restart Express → GET ด้วย `id` เดิมยังพบข้อมูล และเห็น document เดียวกันใน Atlas ใช้เวลาประมาณ 150–180 นาที แบ่งทำสองช่วงได้

อ่านหนังสือ DTI201 บทที่ 9 เรื่องข้อมูลที่คงอยู่, data model, ข้อจำกัด, index และ seed ประกอบ หนังสือใช้ PostgreSQL; แลบนี้ใช้ MongoDB/Mongoose จึงใช้ collection/document/`_id` แทนตาราง/แถว/คีย์

## 0. เตรียมงานและรู้ก่อนว่าต้องแก้อะไร (10 นาที)

ต้องมี Node.js **20.6 ขึ้นไป** (รองรับ `--env-file`), npm, Git และ Atlas **Free Cluster0 ของตนเอง** หากมีแล้วใช้ของเดิม ไม่ต้องสร้าง cluster ใหม่ Docker เป็นทางเลือกท้ายใบงาน

คำสั่งใช้ Bash เช่น macOS/Linux/Git Bash บน Windows ใช้ `curl.exe` หาก PowerShell แปล `curl` เป็นคำสั่งอื่น

เปิด terminal ที่ราก repository ของแลบที่ clone มา:

```bash
node --version
npm --version
cd examples/10-mongodb-book-api
cp .env.example .env
npm ci
```

**ถ้ามี `.env` อยู่แล้ว อย่าคัดลอกทับ** ให้เปิดแก้ไฟล์เดิม จากนี้ทุกคำสั่ง backend รันที่ `examples/10-mongodb-book-api/` จนกว่าจะบอกให้เปลี่ยนโฟลเดอร์ นักศึกษาคัดลอกโฟลเดอร์นี้ทั้งโฟลเดอร์ไปไว้ใน repo งานของตนได้ มี seed อยู่ใน `src/books.js` ครบแล้ว

ใช้โฟลเดอร์ Lab 10 นี้เป็น backend สำหรับคาบนี้ และนำ **route ที่ทำเสร็จแล้วของตนเองจาก Lab 09** มาใส่ ไม่ต้องติดตั้ง Express ใหม่หรือแก้ Lab 09 ต้นฉบับ ก่อนเริ่มย้าย ให้ทดลอง POST/restart/GET ใน Lab 09 และบันทึกว่าข้อมูลจาก array หายอย่างไร หาก GET/POST ของคุณยังตอบ 501 ให้ทำกิจกรรม Lab 09 ให้เสร็จก่อนขั้น 5

| ไฟล์ใน backend Lab 10 | มีให้แล้ว | นักศึกษาต้องทำ | จุดตรวจ |
|---|---|---|---|
| `.env` | คัดลอกจากตัวอย่าง | ใส่ URI ของ Cluster0 ตนเอง (ขั้น 1) | `npm run db:check` ผ่าน |
| `src/models/Book.js` | schema และ unique index | อ่านและเขียน data dictionary (ขั้น 2) | อธิบายแต่ละ field ได้ |
| `src/books.js`, `scripts/seed.js` | seed 200 เล่ม | รันสองครั้งและสังเกต (ขั้น 3) | ฐานใหม่มี 200 ทั้งสองครั้ง |
| `src/book-store.js` | ฟังก์ชันว่างพร้อมป้าย `LAB10-*` | เติม list/find/insert (ขั้น 4) | query คืน document และแปลงเป็น API JSON |
| `src/server.js` | เชื่อม DB ก่อน listen, health และ 501 | แทน fallback ด้วย routes ของตน (ขั้น 5–6) | GET/POST ใช้ DB จริง |
| frontend ของตน | React จาก Lab 07/09 | ตรวจ API URL, `id` และ error UI (ขั้น 7) | เห็นข้อมูลหลัง restart |
| `compose.yaml` | MongoDB พร้อม healthcheck | ใช้เฉพาะทางเลือก Docker | `healthy` ก่อน seed |

**501 เป็นงานที่ยังต้องเขียน ไม่ใช่ Docker เสีย**: starter ยังไม่ทำ GET/POST ให้ การที่ `/health` ตอบ 200 บอกเพียงว่า Express เปิดแล้วหลังเชื่อม DB สำเร็จตอนเริ่ม ไม่ได้พิสูจน์ว่า route หนังสือทำงานหรือว่า DB ยังพร้อมตลอดเวลา

## 1. ต่อ Atlas Cluster0 ของตนเอง (20 นาที)

1. เข้า Atlas เลือก project ของตน → **Database / Clusters** → หา **Cluster0** ตรวจว่าเป็น Free และพร้อมใช้งาน ถ้าถูก pause ให้ resume และรอพร้อมก่อน
2. ใน **Database Access** (บางหน้ารวมอยู่ใน **Database & Network Access**) สร้าง **database user** สำหรับแอป เช่น `book_app` ให้สิทธิ์ `readWrite` เฉพาะฐาน `course_books` จดรหัสผ่านไว้ส่วนตัว บัญชีนี้คนละบัญชีกับ email/password ที่ใช้เข้าเว็บไซต์ Atlas
3. ใน **Network Access / IP Access List** เพิ่ม **IP สาธารณะปัจจุบันของเครื่องที่รัน Express** ด้วย Add Current IP Address ถ้าย้าย Wi-Fi หรือใช้ VPN อาจต้องเพิ่มใหม่ หากรันบนเครื่องอื่นต้องใช้ IP ขาออกของเครื่องนั้น ไม่ต้องเปิด `0.0.0.0/0` สำหรับงานนี้
4. กลับไป **Cluster0 → Connect → Drivers → Node.js** คัดลอก connection string จาก cluster ของตน ชื่อ `Cluster0` เหมือนกันทั้งห้อง แต่ **hostname ไม่เหมือนกัน** ห้ามใช้ hostname หรือข้อมูลรับรองของเพื่อน
5. เปิด **ไฟล์ `.env`** ใน editor แทนค่าตัวอย่างทั้งหมดเป็นของตน ใส่ชื่อฐาน `course_books` หลัง `/` ก่อน `?` รักษา query options ที่ Atlas ให้มา ตัวอย่างต่อไปนี้เป็น placeholder ใช้เชื่อมจริงไม่ได้:

```dotenv
MONGODB_URI=mongodb+srv://DB_USER:ENCODED_PASSWORD@YOUR_HOST/course_books?retryWrites=true&w=majority
PORT=3001
```

`YOUR_HOST` ต้องเป็น hostname ที่ Atlas ให้ เช่นรูป `cluster0.<รหัสของคุณ>.mongodb.net` ไม่ใช่คำว่า `Cluster0` อย่างเดียว รหัสผ่านที่มี `@`, `:`, `/`, `#`, `%` ต้อง URL-encode เฉพาะส่วนรหัสผ่าน เช่น `@` → `%40` ไม่ใช่ encode URI ทั้งเส้น ไม่วางรหัสผ่านจริงใน terminal command, screenshot, commit หรือ React และอย่าแก้ `.env.example` เป็นข้อมูลจริง

6. ทดสอบจาก terminal ใน backend:

```bash
npm run db:check
```

ควรเห็น `Database ping: OK` และ `Books: 0` สำหรับฐานใหม่ ถ้ามีข้อมูลอยู่แล้วจำนวนอาจมากกว่า 0 ฐาน/collection จะปรากฏใน Atlas หลังมีการเขียนครั้งแรก **Cluster0 คือเครื่องบริการ; course_books คือ database; books คือ collection**

**ผ่านด่านนี้ก่อน seed หรือแก้ routes** ถ้ายังเชื่อมไม่ได้ ดูตารางแก้ปัญหาท้ายใบงาน ไม่ต้องเปิด Docker เพื่อเชื่อม Atlas

## 2. อ่าน model และเขียน data dictionary (15 นาที)

เปิด `src/models/Book.js` เทียบกับ [ตัวอย่างข้อมูลทีละชั้น](../docs/lab10-book-data-model.md) แล้วสร้าง `docs/DataDictionary.md` ใน repo งานของตน ระบุ field/type/required/ข้อจำกัด/ที่มา/สิ่งที่ API เปิดเผย อย่างน้อย:

| Field ใน MongoDB | ชนิด/กติกา | ผู้สร้างค่า |
|---|---|---|
| `_id` | ObjectId | MongoDB สร้าง; API ส่งเป็น `id` string |
| `title` | string, trim, required, อย่างน้อย 3 ตัวอักษร | ผู้ใช้ส่ง; server ตรวจ |
| `author` | string, trim, required | ผู้ใช้ส่ง; server ตรวจ |
| `sourceType` | `book`, `documentation`, `course` | ผู้ใช้ส่ง; server ตรวจ |
| `summary` | string, trim, required | ผู้ใช้เขียนสรุปเอง |
| `titleKey` | string, required, unique index | server คำนวณจากชื่อที่ trim และแปลงเป็นตัวพิมพ์เล็ก |
| `createdAt`, `updatedAt` | Date | Mongoose timestamps |

Model นี้มีให้แล้ว ไม่ต้องเขียนทับ `unique` เป็น index ของ MongoDB ไม่ใช่ validator ของ Mongoose `Book.init()` รอสร้าง index ก่อน seed/รับ POST ในแลบนี้ นโยบายชื่อไม่ซ้ำเป็นกติกาฝึกของแอป ไม่ใช่กฎของร้านหนังสือจริงทุกแห่ง

## 3. Seed แล้วตรวจใน Atlas (15 นาที)

```bash
npm run seed
npm run seed
npm run db:check
```

ฐานใหม่ควรแสดง `Seed complete. Books: 200` สองครั้ง และ `db:check` แสดง 200 พร้อมตัวอย่าง 3 เล่ม ถ้ามีหนังสือที่เพิ่มเองแล้ว จำนวนอาจเกิน 200 ให้เทียบก่อน/หลังการ seed ครั้งที่สองว่าไม่เพิ่มซ้ำ **อย่าลบข้อมูลเพื่อบังคับให้จำนวนเป็น 200**

ใน Atlas เปิด **Browse Collections / Data Explorer → course_books → books** กด refresh ดู document หนึ่งเล่ม ตรวจ `title`, `_id`, `titleKey`, timestamps แล้วใช้ชื่อเดียวกันตรวจจาก `db:check` ใน Atlas filter ชื่อได้ เช่น `{ "title": "Pride and Prejudice" }`

เปิด `scripts/seed.js`: อ่านข้อมูลจาก `src/books.js`, ไม่ส่งเลข `id` เดิมเข้า `_id`, สร้าง `titleKey`, ใช้ `$setOnInsert` + `upsert` จึงเพิ่มเฉพาะชื่อที่ยังไม่มี และไม่เขียนทับหนังสือที่แก้ไว้แล้ว

## 4. เติมชั้นจัดเก็บข้อมูลทีละฟังก์ชัน (30 นาที)

**ไฟล์ที่แก้: `src/book-store.js`** ค้นป้าย `LAB10-LIST`, `LAB10-FIND`, `LAB10-INSERT` ใช้ `Book` จาก `./models/Book.js` แทน array จาก Lab 09 อ่านตัวอย่างการไหลของข้อมูลใน [คู่มือ data model](../docs/lab10-book-data-model.md#จาก-model-สู่โค้ดในแอป)

1. สร้างตัวแปลง document → API book ให้ได้ `{id:String(doc._id), title, author, sourceType, summary}` โดยอ่านค่าจาก document อย่าส่ง `titleKey`, `__v` หรือ spread document ทั้งก้อนให้ client
2. **`list({limit,offset})`**: query `Book.find()` เรียง `_id` เพิ่มขึ้น, ข้าม `offset`, จำกัด `limit`, รอผลด้วย `await`, แล้วแปลงแต่ละเล่มเป็น API book คงการตรวจ query parameters ไว้ใน route
3. **`find(id)`**: หลัง route ตรวจ ID แล้ว ใช้ `Book.findById(id)` ถ้าไม่พบ คืน `null`; ถ้าพบ แปลงเป็น API book
4. **`insert(command)`**: รับเฉพาะสี่ field ที่ route ตรวจแล้ว คำนวณ `titleKey` จาก `title.trim().toLocaleLowerCase()` ภายใน server เรียก `Book.create` และแปลงผลเป็น API book อย่ารับ `titleKey`, `_id` หรือ MongoDB operators จาก request

ทำสองฟังก์ชันอ่านก่อน แล้วไปต่อ GET ในขั้น 5 จึงกลับมาเติม insert อย่าเปลี่ยนชื่อฟังก์ชันหรือใช้ `books.push()` ต่อ เพราะจะกลับไปเก็บข้อมูลในหน่วยความจำ

## 5. ย้าย GET จาก Lab 09 มาใช้ store (25 นาที)

**ไฟล์ที่แก้: `src/server.js` ที่ป้าย `LAB10-ROUTES` และ `LAB10-ID`**

1. รักษาส่วนเชื่อมต่อ `connectDatabase()` และ `Book.init()` ก่อน `app.listen` ไว้
2. นำ middleware request ID, routes GET และตัวจัดการ error ที่ทำเสร็จจาก Lab 09 มาใส่ใน `app` ของไฟล์นี้ อย่านำ `app.listen` จาก Lab 09 มาใส่ซ้ำ
3. import `createBookStore` จาก `./book-store.js` และสร้าง store ก่อนประกาศ routes
4. เปลี่ยน handler ที่เรียก DB เป็น `async` และรอ `await store.list(...)` / `await store.find(...)` ถ้าไม่ await จะส่ง Promise แทนข้อมูล
5. GET list ยังคง validation เดิม: `limit` จำนวนเต็ม 1–100, `offset` จำนวนเต็มตั้งแต่ 0 ตอบ `{data:[...],pagination:{limit,offset}}`
6. GET detail เปลี่ยน validation จากเลขบวกเป็น string รูป `/^[0-9a-fA-F]{24}$/` แล้วจึง query; รูปผิดตอบ 422, รูปถูกแต่ไม่พบตอบ 404, พบตอบ `{data:book}`
7. ลบ `app.use('/api/books', ...501...)` เดิมเมื่อมี routes ของตนแล้ว และวาง error middleware ท้าย routes

```bash
npm run dev
```

เปิด terminal อีกหน้าที่ backend เดียวกัน (ไม่ปิด server):

```bash
curl -i 'http://localhost:3001/api/books?limit=2&offset=0'
curl -i http://localhost:3001/api/books/1
curl -i http://localhost:3001/api/books/000000000000000000000000
```

คาดหวัง 200/422/404 ตามลำดับ สำหรับ GET detail ที่ต้องได้ 200 **คัดลอก `id` จริงจาก GET list** มาแทน path อย่าใช้เลข `1` หรือ ObjectId ตัวอย่างในคู่มือ

## 6. ย้าย POST และพิสูจน์ persistence (25 นาที)

**แก้ `src/server.js` ป้าย `LAB10-ERRORS` และเติม insert ใน `src/book-store.js`**

นำ POST validation ของตนจาก Lab 09 มาด้วย: body เป็น object, อนุญาตเฉพาะ `title`, `author`, `sourceType`, `summary`, ตรวจชนิด/ข้อความว่าง/ชื่อสั้น/enum แล้วจึง `await store.insert(command)` ตอบ **201**, `{data:book}` และ `Location: /api/books/<id>`

แปลง duplicate-key `error.code === 11000` เป็น **409** แบบ `application/problem+json` พร้อม request ID การตรวจ `findOne` ก่อน insert อย่างเดียวไม่ป้องกันคำขอพร้อมกันได้ ปัญหาข้อมูลจากผู้ใช้ตอบ 422 ส่วน DB ใช้งานไม่ได้ตอบ 500 โดยไม่ส่ง driver message หรือ URI กลับ

```bash
curl -i -X POST http://localhost:3001/api/books -H 'Content-Type: application/json' \
  -d '{"title":"Database Practice","author":"Mali","sourceType":"course","summary":"สรุปจากการทดลองของฉัน"}'
curl -i -X POST http://localhost:3001/api/books -H 'Content-Type: application/json' \
  -d '{"title":"database practice","author":"Mali","sourceType":"course","summary":"ทดสอบชื่อซ้ำ"}'
```

คาดหวัง 201 แล้ว 409 ถ้ารันซ้ำจากครั้งก่อน ชื่อแรกอาจมีแล้ว ให้ใช้ชื่อทดลองใหม่และบันทึกไว้ จด `id` และ `Location` ของคำขอที่สำเร็จ กด Ctrl+C **เฉพาะ Express** เปิด `npm run dev` ใหม่ GET ตาม Location เดิมต้องได้ 200 พร้อม ID เดิม ตรวจชื่อเดียวกันใน Atlas ด้วย หลังเพิ่มหนึ่งเล่มบนฐานใหม่ จำนวนจะเป็น 201

## 7. เชื่อมกลับ React และทดสอบความล้มเหลว (20 นาที)

กลับไปโฟลเดอร์ React ของตน เปิด Vite ตาม Lab 07/09:

- React เรียก `/api/books` ผ่าน proxy ไป Express หรือ API base URL ที่ตั้งไว้ ตรวจใน `vite.config.*` และไฟล์ API service ของตน ไม่ใส่ URI ของ Atlas ใน `VITE_*` เพราะส่งไปถึงเบราว์เซอร์
- เปิด DevTools → Network: ตรวจ URL/status/response ให้เห็น `{data:[...]}` และ `id` เป็น string ใช้ ID นี้ทำ key และ detail URL
- เพิ่มหนังสือจากหน้าแอป → refresh → restart Express → refresh อีกครั้ง ต้องพบเล่มเดิมและ document เดิมใน Atlas
- หาก frontend กับ Express ต่าง origin ให้คงการตั้ง CORS เฉพาะ origin ของ frontend ตาม Lab 09

ทดสอบ startup failure โดยหยุด Express ก่อน แล้วรัน `MONGODB_URI=mongodb://127.0.0.1:1/course_books npm start` ใน Bash: ต้องจบด้วย error และ exit code ที่ไม่ใช่ 0 **ไม่แสดง API listening** จากนั้นเปิดด้วย `npm run dev` ตามปกติ (คำสั่งนี้ override ค่าเฉพาะครั้งนั้น ไม่แก้ `.env`)

สำหรับ runtime failure ของ routes ให้ใช้ mock store ที่ throw ในชุดทดสอบของตน ตรวจว่าได้ 500 problem JSON และ request ID โดยไม่มีข้อมูลเชื่อมต่อ ถ้าใช้ Docker ทางเลือก สามารถ stop DB แล้วลอง GET จริงก่อน start กลับได้ ไม่ต้องลบ IP access list หรือหยุด Cluster0 เพื่อทดลอง

## ทางเลือก: ใช้ MongoDB ใน Docker แทน Atlas

เลือกทางนี้เฉพาะเมื่อจะใช้ DB บนเครื่องตนเอง ทั้ง Express และ npm ยังคงรันบนเครื่อง Docker เปิดเฉพาะ DB อ่าน [ใบงาน Docker](docker-container-primer.md) หากยังไม่รู้จัก container

ที่ backend Lab 10:

```bash
docker version
docker info
docker compose version
```

ต้องติดต่อ Engine ได้ และใช้ Compose v2 ที่รองรับ `up --wait` เปิด Docker Desktop ก่อนบน Windows/macOS จากนั้น **แก้ `.env` เปลี่ยน MONGODB_URI เพียงบรรทัดเดียว** เป็น:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27018/course_books
PORT=3001
MONGO_PORT=27018
```

```bash
docker compose config --quiet
npm run db:up
docker compose ps
docker compose exec db mongosh --quiet course_books --eval 'db.runCommand({ping:1})'
npm run db:check
npm run seed
npm run seed
npm run dev
```

`db:up` ใช้ healthcheck และ `--wait` เพื่อรอ DB พร้อม **ก่อน seed** ควรเห็น `healthy` และ `{ ok: 1 }` หาก timeout ให้ดู `docker compose logs --tail=60 db` ไม่รัน seed ต่อแบบเดาสุ่ม

Port **27018** อยู่บนเครื่อง → **27017** ใน container; URI นี้ใช้เพราะ Express รันบนเครื่อง `db:27017` ใช้เมื่อ Express อยู่ใน Compose network เดียวกันเท่านั้น URI Atlas ไม่ใช้ port mapping นี้ ทั้งสองทางเป็น **คนละฐานข้อมูล** แม้ชื่อ `course_books` เหมือนกัน

เมื่อเลิกใช้ กด Ctrl+C แล้ว `npm run db:stop` เปิดใหม่ด้วย `npm run db:up` ข้อมูลยังอยู่ใน named volume อย่าใช้ `docker compose down -v` เพราะลบข้อมูล

## เมื่อไม่ผ่าน ให้แก้ตรงไหน

| อาการ | ตรวจ/แก้ที่ไหน | ตรวจผลอีกครั้ง |
|---|---|---|
| `no configuration file provided` | terminal ผิดโฟลเดอร์: เข้า backend ที่มี `compose.yaml` | `docker compose config --quiet` |
| `Cannot connect to Docker daemon` / named pipe / permission denied | เปิด Docker Desktop/Engine ตรวจ context และสิทธิ์ใช้งาน หรือเลือก Atlas | `docker info` |
| ไม่รู้จัก `--wait` | อัปเดต Compose v2 หรือใช้ Atlas | `docker compose version`, `npm run db:up` |
| `port is already allocated` ที่ 27018 | อย่าหยุด service ของผู้อื่น เปลี่ยน `MONGO_PORT=27019` และ URI เป็น 27019 ใน `.env` ทั้งคู่ | `npm run db:up`, `npm run db:check` |
| MongoDB container ไม่ healthy / image download ล้มเหลว | ดู logs, network, พื้นที่ดิสก์; error เกี่ยวกับ CPU/virtualization ให้ใช้ Atlas | `docker compose logs --tail=60 db` |
| `.env: not found` | สร้าง `.env` ใน backend ที่รัน npm; ตรวจชื่อไฟล์ไม่เป็น `.env.txt` | `npm run db:check` |
| ยังมีข้อความให้แทน placeholder | แก้ `.env` จริง ไม่ใช่ `.env.example` | `npm run db:check` |
| authentication / connection failed | Atlas database user/password/URL encoding, สิทธิ์ course_books, IP access list, cluster พร้อม และ DNS/network | `npm run db:check` |
| `ECONNREFUSED` / server selection timeout (Docker) | DB พร้อมหรือยัง? URI/port ตรงกับ `.env` และ Compose หรือไม่? | `npm run db:up`, `npm run db:check` |
| `EADDRINUSE` ที่ 3001 | เปลี่ยน `PORT` ใน `.env` เช่น 3002 แล้วเปลี่ยน curl และ frontend proxy ให้ตรงกัน | เปิด server แล้ว GET API |
| `/api/books` ได้ 501 | เติม `LAB10-*` ตามขั้น 4–6 และเอา fallback 501 ออก | GET list/detail และ POST |
| เห็น `{}` แทน book | ลืม await store/query หรือยังไม่แปลง document เป็น API JSON | ตรวจ `src/book-store.js` และ handlers |
| GET `/api/books/1` ได้ 422 | เลขจาก Lab 09 ใช้ไม่ได้แล้ว | คัดลอก ID string จาก GET list ใหม่ |
| Atlas ไม่เห็นข้อมูล | เลือก project/cluster/database ให้ตรง URI; refresh Collections; seed ผ่านหรือไม่ | `npm run db:check` และดูชื่อเดียวกันใน Atlas |

สคริปต์ตั้งใจไม่พิมพ์ driver error ที่อาจมี host/URI ส่วนตัว ถ้าขอความช่วยเหลือ ส่งชื่อขั้น, คำสั่ง, ข้อความ error ที่ปิดบังข้อมูลแล้ว ห้ามส่ง `.env` หรือภาพ connection string

## หลักฐานที่ส่งและเกณฑ์ตรวจ

1. โค้ด backend, `.env.example` ที่เป็น placeholder, DataDictionary; ไม่มี `.env` หรือรหัสผ่าน
2. ผล db:check และ seed สองครั้ง พร้อมจำนวนก่อน/หลัง บอกว่าใช้ Atlas หรือ Docker
3. ตารางผลจริง: GET list 200; detail ที่มี 200; ID ผิด 422; ID ไม่พบ 404; POST 201; ชื่อซ้ำ 409; field เกิน/ข้อมูลผิด 422; JSON เสีย 400; startup DB failure; runtime DB error 500
4. ผล POST → restart Express → GET ID เดิม และ document ใน Atlas/DB เดิม ปิดบังชื่อบัญชีและข้อมูลเชื่อมต่อในภาพ
5. ภาพการเดินทาง React → Express → store → Book model → MongoDB และผลจากหน้าแอปหลัง restart
6. ตรวจ `git status --short` และ `git diff --cached` ก่อน commit ไม่ส่งข้อมูลรับรอง

**อธิบายปากเปล่า:** Cluster0/database/collection ต่างกันอย่างไร? `_id` กลายเป็น `id` ตรงไหน? ทำไมต้อง await? unique index ต่างจาก validation อย่างไร? ทำไม React ไม่เชื่อม Atlas ตรง ๆ?

**ทำต่อเมื่อแกนหลักเสร็จ:** ออกแบบ ReadingNote ที่อ้าง `bookId` หรือขยายร้านหนังสือด้วยราคา/สต็อกตาม [คู่มือ model](../docs/lab10-book-data-model.md) ส่วนนี้ยังไม่ใช่ routes ที่ starter ทำให้แล้ว

อ้างอิง: [Atlas connection และ database user](https://www.mongodb.com/docs/atlas/driver-connection/), [Atlas troubleshooting](https://www.mongodb.com/docs/atlas/troubleshoot-connection/), [Docker readiness](https://docs.docker.com/compose/how-tos/startup-order/), [Mongoose validation](https://mongoosejs.com/docs/validation.html)
