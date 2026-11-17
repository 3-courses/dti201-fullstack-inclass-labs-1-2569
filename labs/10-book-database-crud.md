# Lab 10 — ทำความรู้จักฐานข้อมูล แล้วต่อแอปร้านหนังสือทีละขั้น

วันนี้เราจะทำให้ข้อมูลหนังสือที่กรอกผ่านหน้าเว็บถูกบันทึกไว้จริง ปิด Express แล้วเปิดใหม่ ข้อมูลก็ยังอยู่ ใช้ **MongoDB Atlas Free Cluster0 ของตนเอง**

![บทบาทของ React, Express และ MongoDB Atlas](../assets/lab10/component-roles.png)

ดูภาพจากซ้ายไปขวา: ผู้ใช้เปิดหน้าเว็บ ผู้รับคำขอช่วยตรวจและค้นหา แล้วจึงอ่านข้อมูลจากที่เก็บ ในแอปของเรา สามส่วนนี้คือ **React**, **Express**, และ **MongoDB** ตามลำดับ คำขอจาก React ผ่าน Express ก่อนถึง MongoDB และผลจากฐานข้อมูลถูกส่งกลับมาแสดงในหน้าเว็บ

## เราจะใช้ไฟล์ไหน และทำตามลำดับอย่างไร

เปิดตามลำดับด้านล่าง ตรวจผลของแต่ละคำสั่งก่อนทำขั้นถัดไป หากผลไม่ตรง ให้ดูวิธีตรวจข้อผิดพลาดในหัวข้อนั้น

| ลำดับ | เปิดคู่มือ | สิ่งที่เราจะทำร่วมกัน | ผลเมื่อจบช่วง |
|---|---|---|---|
| 1 | [เตรียมเครื่อง ต่อ Atlas และเปิดดูฐานตัวอย่าง](../docs/lab10/01-atlas-and-sample.md) | เปิด terminal ให้ถูกที่ ตั้ง `.env` รัน seed แล้วเปิด Data Explorer | เห็นเครื่องดื่ม 2 รายการและร้านหนังสือตัวอย่าง |
| 2 | [ตัวอย่างเล็ก: เครื่องดื่มสองชนิด](../docs/lab10/02-drinks-walkthrough.md) | อ่าน document และติดตามโค้ด connect → model → query → JSON | รันสคริปต์แล้วเห็นข้อมูลเดียวกับ Atlas |
| 3 | [อ่าน ER ทั้งสามภาพและแปลงเป็น MongoDB](../docs/lab10-book-data-model.md) | ไล่ลูกค้า ตะกร้า คำสั่งซื้อ หนังสือ หมวดหมู่ และผู้เขียนด้วยข้อมูลจริงชุดเล็ก | เข้าใจ reference, embedded items และราคาตอนซื้อ |
| 4 | [เชื่อม Book model กับ API](../docs/lab10/03-book-api-walkthrough.md) | อ่าน model/store/routes ทีละส่วน ทดลอง GET/POST/PATCH/DELETE | GET/POST/PATCH/DELETE อ่านและเปลี่ยนข้อมูลใน MongoDB |
| 5 | [เปิด React และติดตามข้อมูลจากฟอร์ม](../docs/lab10/04-react-and-checks.md) | เปิดหน้าเว็บ เพิ่ม แก้ ลบ แล้ว restart Express | หน้าเว็บและ Atlas แสดงข้อมูลเดียวกัน |

ใช้เวลาได้หลายคาบ: ช่วง 1–2 ประมาณ 60–90 นาที ช่วง 3 ประมาณ 45–60 นาที ช่วง 4–5 ประมาณ 90–120 นาที หากหยุดพักกลางทาง ให้เก็บ `.env` ไว้บนเครื่องและเริ่มต่อจากหัวข้อเดิม ไม่ต้องลบฐานข้อมูล

## ตั้งชื่อให้ตรงกันก่อน

เราใช้ **สอง database บน Cluster0 เดียวกัน** เพื่อไม่ปะปนตัวอย่างร้านเต็มกับข้อมูลที่แอปหลักใช้งาน:

![Cluster0 มีฐานสาธิตและฐานแอปหลักแยกกัน](../assets/lab10/atlas-tree.png)

- `course_books_demo`: ข้อมูลเล็กสำหรับอ่าน ER และตัวอย่างเครื่องดื่ม มี `drinks`, `customers`, `categories`, `authors`, `books`, `carts`, `orders`
- `course_books`: ข้อมูลแอป Course Book Explorer มี `books` 200 เล่มเริ่มต้น แล้วเพิ่มหนังสือของเราผ่าน API ได้

ชื่อ collection `books` มีในทั้งสอง database แต่ **โครงสร้างต่างกันตามวัตถุประสงค์** ตัวอย่างร้านเต็มมี SKU/ราคา/รหัสผู้เขียน ส่วนแอปหลักเริ่มจาก metadata สี่ field คือ title/author/sourceType/summary เพื่อเรียนเส้นทางเว็บถึงฐานข้อมูลให้ครบก่อน

ข้อมูลใน course_books_demo เป็นข้อมูลสมมติสำหรับติดตามความสัมพันธ์จาก ER ส่วนหน้าเว็บใช้ course_books เพื่อจัดการรายการหนังสือ ไม่มีการรับเงินหรือสร้างคำสั่งซื้อจากหน้าเว็บ

## ไฟล์ที่เปิดอ่านทีละส่วน

จากราก repo จะพบโครงสร้างนี้ ไม่ต้องสร้าง Express project ใหม่:

```text
examples/10-mongodb-book-api/
├── .env.example       แบบฟอร์มค่าตั้งต้นที่ไม่มีรหัสจริง
├── .env               ค่าของเครื่องเราเอง สร้างในขั้น 1 ห้าม commit
├── package.json       ชื่อคำสั่ง npm และรายการแพ็กเกจ
├── compose.yaml       ใช้เฉพาะทางเลือก Docker
├── demo/
│   ├── data.js        ชุดข้อมูลเล็กที่อธิบาย ER
│   ├── sample-db.js   เพิ่ม/อ่านฐาน course_books_demo
│   ├── Drink.js       model ตัวอย่างเครื่องดื่ม
│   └── drinks.js      อ่านเครื่องดื่มแล้วแปลงเป็น JSON
├── scripts/
│   ├── check-db.js    ตรวจ connection และจำนวนหนังสือในฐานหลัก
│   └── seed.js        เพิ่ม metadata หนังสือ 200 เล่ม
├── src/
│   ├── db.js          เปิด connection ไป MongoDB
│   ├── models/Book.js กติกา document หนังสือ
│   ├── book-store.js  อ่าน/เพิ่ม/แก้/ลบ document
│   ├── app.js         HTTP routes และการตรวจข้อมูล
│   └── server.js      เชื่อม DB แล้วเปิด Express
└── client/            หน้า React ที่รันได้ครบ
```

เริ่มจาก [ทำความรู้จักและสร้างไฟล์ .env](../docs/lab10/01-atlas-and-sample.md#13-env-คืออะไร-และทำไมต้องแยกจากโค้ด) แล้วใส่ค่าการเชื่อมต่อ Atlas ของตน หากเปลี่ยน port Express ให้แก้ target ใน `client/vite.config.js` ให้ตรงกัน

เริ่มที่ [ช่วง 1: เตรียมเครื่องและดูฐานข้อมูลตัวอย่าง](../docs/lab10/01-atlas-and-sample.md)

## หากต้องใช้ Docker แทน Atlas

นักศึกษาที่ใช้ Atlas อยู่แล้วข้ามส่วนนี้ได้ Docker เป็นอีกที่หนึ่งที่ใช้รัน MongoDB ข้อมูลบน Docker กับ Atlas เป็นคนละชุด แม้ตั้งชื่อ database เหมือนกัน

1. เปิด Docker Desktop บน Windows/macOS หรือ Docker Engine บน Linux
2. เปิด terminal ใน `examples/10-mongodb-book-api/` ตรวจว่า `compose.yaml` อยู่ในโฟลเดอร์นี้
3. รันทีละบรรทัด:

```bash
docker version
docker info
docker compose version
```

`docker version` ต้องแสดงทั้ง Client และ Server หากเชื่อม daemon ไม่ได้ ให้เปิด Docker ก่อน `compose` ต้องเป็น v2 ที่รองรับ `up --wait`

4. เปิด `.env` เปลี่ยน `MONGODB_URI` เป็นด้านล่าง ให้เหลือ URI ที่ไม่ขึ้นต้นด้วย `#` เพียงบรรทัดเดียว:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27018/course_books
PORT=3001
MONGO_PORT=27018
```

5. รัน:

```bash
docker compose config --quiet
npm run db:up
docker compose ps
npm run db:check
```

`config --quiet` สำเร็จจะไม่พิมพ์อะไร `db:up` เปิด container และรอ healthcheck `ps` ควรแสดง `healthy` แล้ว `db:check` ควรได้ `Database ping: OK` ถึงจุดนี้จึงทำ seed ตามคู่มือช่วง 1 ได้

หาก `db:up` ไม่สำเร็จ ให้ดู:

```bash
docker compose logs --tail=60 db
```

ถ้า port 27018 ถูกใช้ ให้เปลี่ยน **ทั้ง** `MONGO_PORT=27019` และ port ใน URI เป็น 27019 แล้วรัน `npm run db:up` ใหม่ ไม่ต้องหยุด container ของงานอื่น

**เส้นทาง port:** Express รันบนเครื่องเรา → `127.0.0.1:27018` → MongoDB ใน container port `27017` คำว่า `db:27017` ใช้เมื่อ Express อยู่ใน Compose network เดียวกันเท่านั้น คาบนี้ Express รันด้วย npm บนเครื่อง

การดูข้อมูลกรณีไม่มี Atlas Data Explorer ใช้:

```bash
docker compose exec db mongosh course_books_demo --eval 'db.drinks.find().toArray()'
docker compose exec db mongosh course_books_demo --eval 'db.books.find().toArray()'
docker compose exec db mongosh course_books --eval 'db.books.countDocuments()'
```

หยุด Express ด้วย Ctrl+C แล้วหยุด DB ด้วย `npm run db:stop` เปิดใหม่ใช้ `npm run db:up` volume ยังเก็บข้อมูลไว้ **ไม่ใช้ `docker compose down -v`** เพราะ `-v` ลบ volume

## ตรวจผลการทำงาน

- เปิดดูข้อมูลตัวอย่างใน Atlas และชี้ database/collection/document/field ได้จากของจริง
- อ่าน ER ทั้งสามภาพคู่กับรหัสอ้างอิงและรายการที่ฝังใน document
- รัน API ครบเพิ่ม/อ่าน/แก้/ลบ พร้อมดู status และ JSON ที่ได้จริง
- เพิ่มข้อมูลผ่าน React และพบข้อมูลเดิมหลัง restart Express

บันทึกชื่อเล่มที่ทดลอง, id และผลใน Network เพื่อเปรียบเทียบก่อนและหลัง restart ไม่ถ่ายรหัสผ่านหรือ URI
