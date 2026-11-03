# Lab 10 — ให้หนังสืออยู่ต่อด้วย MongoDB (MERN)

อ่านหนังสือ DTI201 บทที่ 9 เรื่องข้อมูลที่คงอยู่, data model, ข้อจำกัด, index และ seed ประกอบ หนังสือใช้ PostgreSQL เป็นตัวอย่าง; Lab นี้ใช้ **MongoDB กับ Mongoose** ตาม MERN stack ของรายวิชา. ในหนังสือ “ตาราง/แถว/คีย์” ช่วยคิดแบบจำลอง แต่ในงานนี้เราสร้าง “collection/document/`_id`”

## เมื่อจบคาบ

เพิ่มหนังสือด้วย `POST /api/books`, หยุดและเปิด Express ใหม่ แล้ว `GET /api/books` ยังพบเล่มเดิม หน้า React เดิมยังเรียกเส้นทาง API ได้ และคุณชี้ได้ว่าข้อมูลอยู่ใน MongoDB ไม่ใช่ array ใน Node.js

ใช้ backend ที่ **คุณสร้างเองใน Lab 09** ต่อในโฟลเดอร์ `09-express-book-api`; ไม่ต้องสร้าง Express project ใหม่ ตัวอย่าง `examples/09-express-book-api/` ใน repository กลางยังมีบาง route ที่ตอบ `501`. หาก GET list และ POST ในงานของคุณยังไม่ทำงาน ให้ทำ Lab 09 สองส่วนนี้ให้เสร็จก่อน

[สไลด์ MongoDB/MERN](../slide/10-mongodb-mern/mongodb-mern.pdf) แนะนำประเภทฐานข้อมูล ประวัติ MongoDB และความต่างจากตัวอย่าง PostgreSQL ในหนังสือ ดู [ชุดเริ่มต้น MongoDB](../examples/10-mongodb-book-api/README.md) เพื่อตรวจการเชื่อมต่อและ seed หนังสือ 200 เล่ม แล้วนำแนวคิดไปเพิ่มใน backend ที่คุณเขียนเอง ชุดเริ่มต้นตั้งใจให้ route หนังสือตอบ 501 จนกว่าจะทำกิจกรรม

## กิจกรรม 0 — ทำนายและดูข้อมูลที่หาย (10 นาที)

รัน `npm run dev` แล้ว POST หนังสือหนึ่งเล่ม GET ให้เห็นเล่มนั้น หยุด Express ด้วย `Ctrl+C`, รันใหม่และ GET อีกครั้ง จดผล แล้วชี้ว่าข้อมูลเก็บอยู่ที่บรรทัดใดใน `src/books.js` หรือ route ของคุณ

คำถาม: `201 Created` ยืนยันว่ารับคำขอสำเร็จ แต่ยืนยันหรือไม่ว่าข้อมูลอยู่หลังโปรแกรมหยุด?

## กิจกรรม 1 — ออกแบบ document หนังสือ (15 นาที)

| API JSON เดิม | MongoDB document | ความหมาย |
|---|---|---|
| `id: 3` | `_id: ObjectId(...)` | MongoDB สร้าง ID; API ส่ง `id` เป็นข้อความ |
| `title` | `title` และ `titleKey` | ชื่อแสดงผลและชื่อที่ใช้ตรวจซ้ำ |
| `author` | `author` | ผู้แต่งหรือผู้จัดทำ |
| `sourceType` | `sourceType` | `book`, `documentation` หรือ `course` |
| `summary` | `summary` | ข้อความที่เขียนเอง |

เขียน `docs/DataDictionary.md` ระบุ field, type, required, source และ privacy note. `titleKey` เป็นค่าในฐานข้อมูลที่ route สร้างจาก `title.trim().toLocaleLowerCase()`; อย่ารับ `titleKey` จาก JSON ของผู้ใช้

**การเปลี่ยน ID ที่ต้องรู้:** Lab 09 ใช้เลข `1`, `2`; MongoDB ใช้ ObjectId เช่น `674000000000000000000001`. `GET /api/books/:id` ยังเป็นเส้นทางเดิม แต่ `id` ใน response เป็น string. ID เลขเดิมใช้กับข้อมูลใหม่ไม่ได้. React example เดิมใช้ `id: string`, จึงไม่ต้องแปลงเลขเป็นข้อความอีก

## กิจกรรม 2 — เปิด MongoDB และเชื่อมต่อ (20 นาที)

ต้องมี Node.js 20 ขึ้นไป, npm และ Docker ที่ `docker compose version` กับ `docker info` ใช้ได้ หากเครื่องไม่มี Docker ให้ใช้ MongoDB ของห้องเรียนและขอ `MONGODB_URI` จากผู้สอน

ในโฟลเดอร์ backend เดิม สร้าง `compose.yaml`:

```yaml
services:
  db:
    image: mongo:7.0
    ports:
      - "127.0.0.1:27018:27017"
    volumes:
      - book_mongodata:/data/db
volumes:
  book_mongodata:
```

ใช้ port 27018 บนเครื่องเพื่อหลีกเลี่ยง MongoDB ตัวอื่น. ฐานข้อมูลนี้เปิดเฉพาะเครื่องตนเองเพื่อฝึกในคาบ; อย่าเปิด port นี้สู่เครือข่ายภายนอก

สร้าง `.env.example`:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27018/course_books
```

คัดลอกเป็น `.env`, เพิ่ม `.env` ใน `.gitignore`, แล้วรัน:

```bash
docker compose up -d db
docker compose ps
docker compose exec db mongosh course_books --eval 'db.runCommand({ping:1})'
npm install mongoose
```

แก้ `npm run dev` ให้โหลด `.env` เช่น `node --env-file=.env --watch src/server.js`. ใน `src/server.js` ให้ `await mongoose.connect(process.env.MONGODB_URI, {serverSelectionTimeoutMS: 5000})` **ก่อน** `app.listen`; ถ้าขาด URI หรือเชื่อมไม่ได้ ต้องบอกข้อผิดพลาดใน terminal และไม่แสดงว่า API พร้อมแล้ว. ห้ามเขียน URI ของบริการจริงไว้ใน source หรือ log

## กิจกรรม 3 — สร้าง Book model และ seed (25 นาที)

สร้าง `src/models/Book.js` ด้วย Mongoose schema. กำหนด `title`, `author`, `sourceType`, `summary` เป็น string ที่ต้องมี; `title` ยาวอย่างน้อย 3, `sourceType` เลือกได้จากสามค่าข้างบน; เปิด `timestamps: true`. เพิ่ม `titleKey` เป็น string ที่ต้องมีและทำ unique index:

```js
bookSchema.index({ titleKey: 1 }, { unique: true });
```

ตั้ง `titleKey = title.trim().toLocaleLowerCase()` ในชั้น store ก่อน create. เรียก `await Book.init()` ก่อน seed หรือรับ POST เพื่อรอให้ index พร้อม. `unique` ไม่ใช่ Mongoose validator; เมื่อชน index MongoDB จะคืน duplicate-key error

สร้าง `scripts/seed.js` ที่เชื่อม MongoDB, รอ `Book.init()`, แล้วนำ [หนังสือ 200 เล่มจาก Lab 09](../examples/09-express-book-api/src/books.js) มาเป็น seed. คัดลอกไฟล์ข้อมูลไปไว้ใน backend ของตน หรือใช้ `src/books.js` ที่คุณคัดลอกไว้ใน Lab 09. สำหรับแต่ละเล่ม ให้ใช้ `title`, `author`, `sourceType`, `summary`; **ไม่ใช้เลข `id` เดิมเป็น MongoDB `_id`**. คำนวณ `titleKey` แล้วใช้ `updateOne({titleKey}, {$setOnInsert: book}, {upsert:true})` เพื่อให้รันซ้ำแล้วไม่เพิ่มเล่มเดิม. เพิ่ม npm script `seed` ให้โหลด `.env` แล้วรันไฟล์นี้. หลัง seed ตรวจจำนวนและชื่อ:

```bash
npm run seed
docker compose exec db mongosh course_books --eval 'db.books.countDocuments()'
docker compose exec db mongosh course_books --eval 'db.books.find({}, {title:1}).limit(3).toArray()'
```

ผลที่ต้องเห็นคือ 200 documents; รัน `npm run seed` ซ้ำแล้วจำนวนยังเป็น 200. ID ที่ MongoDB สร้างเป็น ObjectId ใหม่ จึงต้องอ่าน ID จริงจากผล GET หรือ `mongosh` ก่อนทดลอง GET detail

## กิจกรรม 4 — เปลี่ยน GET ให้ดึงจาก MongoDB (25 นาที)

Lab 09 ของคุณอาจใช้ `books.slice` และ `books.find` ตรงใน routes. สร้าง `src/book-store.js` เป็นชั้นกลางที่มี `list({limit,offset})`, `find(id)`, `insert(command)`. เริ่มจากสองฟังก์ชันอ่าน:

- `list`: `Book.find().sort({_id:1}).skip(offset).limit(limit)`
- `find`: `Book.findById(id)`; ทำหลัง route ตรวจว่า ID มีรูป `/^[0-9a-fA-F]{24}$/`

routes ต้องเป็น `async` และ `await` ผล Mongoose. คงการตรวจ `limit`/`offset` จาก Lab 09. สร้างฟังก์ชันแปลง document เป็น API JSON เช่น `{id:String(doc._id), title:doc.title, author:doc.author, sourceType:doc.sourceType, summary:doc.summary}`; ไม่ส่ง `titleKey` หรือ `__v` ให้ client

**จุดตรวจ:** GET list เห็น seed, GET detail ด้วย ID ที่ได้จริงเห็นหนึ่งเล่ม, ID รูปผิดได้ 422, ObjectId ถูกรูปแต่ไม่มีเล่มได้ 404. `/api/books/1` จาก Lab 09 เป็น ID รูปผิดในคาบนี้

## กิจกรรม 5 — POST และพิสูจน์ข้อมูลคงอยู่ (25 นาที)

คง validation ของ Lab 09: ตรวจชื่อ, ผู้แต่ง, ชนิดแหล่งข้อมูล, summary และปฏิเสธ field ที่ไม่อนุญาต. ให้ `insert(command)` สร้าง `titleKey` เองและเรียก `Book.create(...)`. ตอบ `201`, `{data:book}` และ `Location: /api/books/<id>`

ส่งชื่อเดิมอีกครั้งโดยเปลี่ยนตัวพิมพ์เล็ก/ใหญ่ MongoDB unique index ควรปฏิเสธ. แปลง duplicate-key error `code === 11000` เป็น `409` แบบ problem JSON เดิม. การ `findOne` ตรวจชื่อก่อน create อย่างเดียวไม่รับประกันเมื่อสองคำขอมาพร้อมกัน

```bash
curl -i -X POST http://localhost:3001/api/books -H 'Content-Type: application/json' \
  -d '{"title":"Database Practice","author":"Mali","sourceType":"course","summary":"สรุปจากการทดลองของฉัน"}'
curl -i -X POST http://localhost:3001/api/books -H 'Content-Type: application/json' \
  -d '{"title":"database practice","author":"Mali","sourceType":"course","summary":"ชื่อซ้ำ"}'
```

หยุด **เฉพาะ Express** แล้วรัน `npm run dev` ใหม่ GET ตาม `Location` ที่ได้รับ และตรวจ document เดียวกันใน `mongosh`. จด ID และผลก่อน/หลัง restart. อย่าใช้ `docker compose down -v` เพราะ `-v` ลบ volume ที่เก็บข้อมูล

## กิจกรรม 6 — กลับไป React และตรวจความล้มเหลว (20 นาที)

ถ้า Lab 09 ต่อ React/Vite แล้ว เปิดหน้าเดิมและดู DevTools → Network. เส้นทาง `/api/books` และรูป `{data:[...]}` คงเดิม; ตรวจว่า ID เป็น string และหน้า React แสดงเล่มที่เพิ่มหลัง restart Express. ถ้า service เดิมแปลง `id` จาก number เป็น string อยู่ ให้เอาการแปลงที่ไม่จำเป็นออก

หยุด MongoDB ชั่วคราวด้วย `docker compose stop db` แล้วลอง GET. Client ควรได้ 500 แบบ problem JSON พร้อม request ID โดยไม่เห็น URI หรือรายละเอียดภายใน. เปิดกลับด้วย `docker compose start db`. ถ้าใช้ MongoDB ส่วนกลาง ให้ผู้สอนสาธิตการหยุดแทน

## หลักฐานที่ส่ง

1. Backend, `compose.yaml`, `.env.example`, Book model, seed script และ `docs/DataDictionary.md`; ไม่มี `.env` หรือข้อมูลรับรองจริง
2. ตารางผลจริง: GET list, GET detail, POST สำเร็จ, POST ชื่อซ้ำ, ข้อมูลผิด, ID ผิดรูป, ID ไม่พบ, MongoDB หยุด
3. POST → restart Express → GET พบ ID เดิม และ `mongosh` แสดง document เดียวกัน
4. ภาพเส้นทาง React → Express → MongoDB → Express → React พร้อม status/JSON ที่ผู้ใช้เห็น

**อธิบายปากเปล่า:** ข้อมูลเดิมหายเพราะอยู่ที่ไหน? `_id` ต่างจาก `id` ที่ API ส่งอย่างไร? Mongoose validation ต่างจาก MongoDB unique index อย่างไร? เหตุใด client ไม่ควรเห็นข้อความเชื่อมต่อ MongoDB?

**ทำต่อเมื่อแกนหลักเสร็จ:** เพิ่ม ReadingNote ที่อ้าง `bookId`, update/delete note และออกแบบว่าจะเก็บ note แยก collection หรือฝังใน Book โดยอธิบายเหตุผลจากการใช้งานจริง

เอกสารอ้างอิง: [Mongoose connections](https://mongoosejs.com/docs/connections.html), [Mongoose validation](https://mongoosejs.com/docs/validation.html), [MongoDB indexes](https://www.mongodb.com/docs/manual/core/index-unique/)
