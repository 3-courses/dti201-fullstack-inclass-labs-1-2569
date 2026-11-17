# ช่วง 1 — เตรียมเครื่อง ต่อ Atlas แล้วเปิดดูข้อมูลก่อนเขียนแอป

[กลับหน้า Lab 10](../../labs/10-book-database-crud.md) · ถัดไป: [ตัวอย่างเครื่องดื่ม](02-drinks-walkthrough.md)

เป้าหมายช่วงนี้คือให้เห็นข้อมูลในฐานจริงก่อน เราจะยังไม่เริ่ม React และยังไม่ต้องเข้าใจโค้ด model ทั้งหมด

## 1.1 เปิดโฟลเดอร์ให้ถูกก่อน

ใช้ Node.js **22.12 ขึ้นไป** เพื่อรันได้ทั้ง backend และ React ตัวอย่างนี้ใช้ Git Bash บน Windows หรือ terminal ของ macOS/Linux คำว่า “รัน” หมายถึงวางคำสั่งใน terminal แล้วกด Enter รอจบก่อนทำบรรทัดถัดไป ไม่ต้องพิมพ์เครื่องหมาย ``` จากกรอบโค้ด

ถ้ายังไม่มี repo นี้บนเครื่อง เปิด terminal ที่โฟลเดอร์เก็บงานของเราแล้วรัน:

```bash
git clone https://github.com/3-courses/dti201-fullstack-inclass-labs-1-2569.git
cd dti201-fullstack-inclass-labs-1-2569
```

ถ้ามี repo แล้ว เปิดโฟลเดอร์นั้นด้วย VS Code → File → Open Folder ไม่ clone ซ้ำทับงานเก่า เปิด Terminal → New Terminal จะได้ terminal ในโฟลเดอร์ที่เปิดอยู่ ใช้:

```bash
pwd
ls
```

ควรเห็น `README.md`, `labs`, `examples`, `assets` ถ้าเห็นอยู่แล้วเราอยู่ที่ราก repo จากนั้น:

```bash
cd examples/10-mongodb-book-api
ls
node --version
npm --version
```

คราวนี้ควรเห็น `package.json`, `src`, `scripts`, `demo`, `client` คำสั่ง npm ของ backend ทุกคำสั่งต่อจากนี้ใช้ terminal ที่โฟลเดอร์นี้ `pwd` ควรลงท้ายด้วย `examples/10-mongodb-book-api`

## 1.2 ติดตั้งสิ่งที่โปรแกรมต้องใช้

```bash
npm ci
```

`npm` เป็นตัวช่วยติดตั้งแพ็กเกจของ Node.js `ci` อ่านรุ่นแพ็กเกจจาก `package-lock.json` และติดตั้งใน `node_modules` จึงได้รุ่นเดียวกับชุดตัวอย่าง รอจนกลับมาเห็นบรรทัดให้พิมพ์คำสั่งใหม่

เปิด `package.json` ใน VS Code จะเห็น `dependencies` เช่น `express` และ `mongoose` เราจะใช้ Express รับ HTTP และใช้ Mongoose อ่าน/เขียน MongoDB ไม่ต้อง `npm install` สองตัวนี้แยกอีก

## 1.3 สร้างไฟล์ค่าของเครื่องเรา

ใน Explorer ของ VS Code ถ้ายังไม่มี `.env` ให้คัดลอก `.env.example` แล้วตั้งชื่อไฟล์ใหม่ว่า `.env` ไม่มี `.txt` ต่อท้าย หรือใช้:

```bash
cp .env.example .env
```

หากมี `.env` แล้ว **ไม่รันคำสั่งคัดลอกทับ** เปิดแก้ไฟล์เดิมได้ `.env.example` คือแบบฟอร์มที่แชร์กับเพื่อนได้ ส่วน `.env` มีรหัสจริง อยู่เฉพาะบนเครื่องเรา

ตอนนี้ยังไม่ต้องใส่ค่าจนกว่าจะทำขั้น Atlas ต่อไปครบ

## 1.4 รู้จัก Atlas, project และ Cluster0 ก่อนคลิก

**MongoDB** คือระบบฐานข้อมูลที่เก็บ document ส่วน **Atlas** คือบริการบนเว็บไซต์ที่ช่วยสร้างและดูแล MongoDB บน cloud เราใช้ browser เข้า Atlas เพื่อจัดการ แต่โปรแกรม Node.js จะติดต่อ MongoDB โดยใช้ connection ของมันเอง ไม่ผ่านหน้าเว็บที่เราเปิดค้างไว้

**Organization** เป็นขอบเขตสมาชิกและการจัดการของบัญชี ภายในมี **project** ซึ่งเป็นพื้นที่รวบรวม cluster, database users และการอนุญาตเครือข่าย การเลือก project ผิดอาจทำให้เราเห็น cluster หรือรายชื่อ users คนละชุด จึงต้องตรวจชื่อก่อนเพิ่มบัญชี

**Cluster0** คือชื่อบริการ MongoDB ที่เราสร้างไว้ ไม่ใช่ชื่อ database และไม่ใช่รหัสผู้ใช้ การที่แต่ละคนมี Cluster0 ไม่ได้หมายความว่ากำลังใช้ข้อมูลร่วมกัน แต่ละคนมี hostname และข้อมูลของตน

![สี่ส่วนที่ใช้เชื่อมต่อ: บัญชีจัดการ บัญชีแอป รายการ IP และ connection string](../../assets/lab10/atlas-access-roles.png)

ดูรูปทีละช่อง: ช่อง 1 คือคนเข้าเว็บเพื่อจัดการ ช่อง 2 คือบัญชีที่โปรแกรมใช้ ช่อง 3 คือประตูตรวจว่า connection มาจากเครือข่ายที่อนุญาต ช่อง 4 คือข้อมูลที่โปรแกรมต้องใช้เพื่อไปหาฐานข้อมูล ลูกศรในแถวบนช่วยจัดลำดับสิ่งที่จะเตรียม ไม่ใช่การส่งรหัสผ่านของแอปไปให้ browser

### ทำตามบนเว็บไซต์


1. เปิดเว็บไซต์ MongoDB Atlas และ sign in ด้วยบัญชี Atlas ของเรา
2. เลือก organization และ project ที่ใช้ในห้องเรียน
3. เปิดหน้า **Database → Clusters** หา **Cluster0** ที่สร้างไว้แล้ว ไม่ต้องสร้างใหม่
4. ถ้าสถานะกำลังสร้างหรือกำลัง resume รอจนพร้อม หาก Free cluster ถูก pause ให้ resume ก่อน

**เมื่อจบขั้นนี้ควรเห็น:** การ์ดของ Cluster0 พร้อมชื่อบริการและปุ่ม Connect/Browse Collections ไม่ใช่หน้าที่กำลังถามให้สร้าง cluster ใหม่ ถ้าหน้าจอยังเป็นกำลัง deploy หรือ resume ให้รอก่อน ยังไม่ต้องสร้าง user ซ้ำ

ชื่อ Cluster0 เป็นชื่อที่ตั้งให้บริการ MongoDB นักศึกษาทุกคนใช้ชื่อนี้เหมือนกันได้ แต่ host ของแต่ละคนต่างกัน อย่าใช้ connection string ของเพื่อน

![ระดับของข้อมูลบน Cluster0](../../assets/lab10/atlas-tree.png)

อ่านจากซ้ายไปขวา: Cluster0 ให้บริการฐานข้อมูล ภายในมี database แต่ละ database มี collection และใน collection มี document หลายรายการ เรากำลังจะสร้าง `course_books_demo` สำหรับดูตัวอย่าง และ `course_books` สำหรับแอป

## 1.5 เตรียม database user

### ทำความเข้าใจบัญชีสองแบบ

เปรียบเหมือนเราเป็นผู้จัดการอาคาร ส่วนแอปเป็นพนักงานที่ต้องได้รับกุญแจเฉพาะงาน ผู้จัดการเข้าเว็บไซต์ไปสร้างกุญแจให้พนักงานได้ แต่ไม่ต้องเอารหัสผ่านของผู้จัดการไปใส่ในโปรแกรม

- **Atlas account** เป็นบัญชีคน ใช้ email/SSO เพื่อเข้าเว็บไซต์ จัดการ project และ cluster
- **Database user** เป็นบัญชีที่ใช้ยืนยันตัวตนเวลาต่อ MongoDB ในแลบนี้โปรแกรมจะอ่านชื่อและรหัสผ่านบัญชีนี้จาก .env
- **Role** คือชุดสิทธิ์ว่าบัญชีทำอะไรได้ `read` อ่านได้ ส่วน `readWrite` อ่านและแก้ข้อมูลได้ แอปที่เพิ่มหนังสือต้องมีสิทธิ์เขียน

บัญชีที่ใช้เข้า **เว็บ Atlas** กับบัญชีที่ **แอปใช้เข้า MongoDB** เป็นคนละชนิด แม้เราจะสร้างทั้งสองเอง

1. เปิด **Database Access** หรือ **Database & Network Access** แล้วเลือกส่วน **Database Users**
2. ถ้ามี database user สำหรับแลบอยู่แล้ว ให้ตรวจสิทธิ์ของบัญชีนั้น ถ้ายังไม่มีกด **Add New Database User**
3. เลือกวิธี Password ตั้งชื่อเช่น `book_app` และสร้างรหัสผ่านเก็บไว้ส่วนตัว
4. สำหรับ project ส่วนตัวที่มีเฉพาะข้อมูลฝึกนี้ เลือก built-in role **Read and write to any database** เพื่อให้สคริปต์เข้าถึงได้ทั้ง `course_books` และ `course_books_demo` ไม่ต้องให้ Atlas admin role หากบัญชีเดิมจำกัดเฉพาะ `course_books` จะรัน demo ไม่ได้ ต้องให้สิทธิ์ฐาน demo เพิ่มก่อน
5. ถ้ามีตัวเลือก Restrict Access to Specific Clusters ให้เลือก Cluster0 ของเรา บันทึกและรอการตั้งค่ามีผล

**เมื่อจบขั้นนี้ควรเห็น:** กลับมาที่ตาราง Database Users แล้วมีแถวชื่อ book_app หรือชื่อที่เราตั้ง ตรวจชื่อ user และ role อีกครั้ง โดยไม่ต้องเปิดเผยรหัสผ่าน หากลืมรหัสที่สร้างไว้ให้แก้/reset รหัสของ database user ของตน ไม่พยายามใช้รหัสเข้าเว็บแทน

เราไม่ต้องสร้าง database ชื่อ book_app เพราะคำนี้เป็นชื่อบัญชี ไม่ใช่ชื่อฐาน ข้อมูลจะอยู่ใน course_books และ course_books_demo ตามที่โปรแกรมระบุ

สิทธิ์นี้ใช้ใน project ฝึกส่วนตัว ถ้า project มีข้อมูลอื่นอยู่ด้วย ให้ใช้บัญชีที่จำกัดสิทธิ์ `readWrite` เฉพาะสองฐานนี้ผ่าน custom role/สิทธิ์ที่ผู้สอนเตรียม แทนการขยายสิทธิ์ไปทุกฐาน

## 1.6 รู้จัก IP access list แล้วอนุญาตเครื่องที่รัน Express

รู้รหัสผ่านอย่างเดียวอาจยังต่อไม่ได้ Atlas ตรวจอีกว่า connection มาจาก IP ที่อนุญาตหรือไม่ **IP address** คือที่อยู่ในเครือข่าย คาบนี้ Node.js รันบน laptop ของเรา จึงต้องอนุญาต IP สาธารณะขาออกของเครือข่ายที่ laptop ใช้อยู่

`127.0.0.1` หมายถึงเครื่องตัวเอง ใช้เรียก Express ในคาบ แต่ไม่ใช่ IP ขาออกที่ Atlas เห็น เช่นเมื่อทุกคนใช้ Wi-Fi เดียวกัน อาจออกอินเทอร์เน็ตผ่าน public IP เดียวกันได้ ปุ่ม Add Current IP Address ช่วยใส่ค่าปัจจุบันให้ ไม่ต้องเดาเลขเอง

### ทำตามในหน้าเครือข่าย


1. ใน Atlas เปิด **Network Access / IP Access List**
2. เลือก **Add IP Address → Add Current IP Address** แล้วบันทึก
3. รอรายการเปลี่ยนเป็นพร้อมใช้งาน

**เมื่อจบขั้นนี้ควรเห็น:** ในตาราง IP Access List มีรายการ IP ที่เพิ่มและสถานะพร้อมใช้งาน เช่น Active หากยัง pending ให้รอการเปลี่ยนแปลงก่อนตรวจ connection ถ้าเครื่องรันโปรแกรมอยู่ที่อื่น เช่น remote server ให้ใช้ IP ของเครื่องนั้น ไม่ใช่ปุ่ม current IP จาก laptop

IP นี้คือ IP สาธารณะขาออกของเครื่องเรา ไม่ใช่ `127.0.0.1` หากเปลี่ยน Wi-Fi หรือ VPN แล้วต่อไม่ได้ ให้กลับมาเพิ่ม IP ปัจจุบันใหม่ ไม่ต้องเปิด `0.0.0.0/0` สำหรับขั้นตอนนี้

## 1.7 รู้จัก connection string แล้วใส่ค่าของเราใน .env

**Connection string** หรือ **URI** คือข้อความหนึ่งเส้นที่บอกโปรแกรมว่าเชื่อมด้วยวิธีใด ไปยัง host ไหน ใช้บัญชีใด และเลือก database อะไร คล้ายการจ่าหน้าซองพร้อมข้อมูลเปิดประตู ไม่ใช่ URL หน้าเว็บ Atlas ที่คัดลอกจาก address bar

**Driver** คือไลบรารีที่ช่วยให้ภาษาที่เราใช้คุยกับ MongoDB ได้ ตัวเลือก Drivers → Node.js จึงแสดงรูปแบบ connection สำหรับโปรแกรม JavaScript ฝั่ง server Mongoose ที่ติดตั้งมี MongoDB Node.js driver เป็นส่วนที่ใช้ติดต่ออยู่แล้ว ไม่ต้องติดตั้ง Compass หรือ MongoDB server บนเครื่องเพื่อใช้ Atlas

**Environment variable** คือค่าที่ส่งให้โปรแกรมตอนเริ่ม เช่น MONGODB_URI และ PORT ไฟล์ `.env` เก็บค่าพวกนี้ของเครื่องเรา คำสั่ง npm ที่เตรียมไว้ใช้ `node --env-file=.env ...` อ่านไฟล์ก่อนรัน JavaScript ทำให้โค้ดเรียก `process.env.MONGODB_URI` ได้

### คัดลอกจาก Atlas


1. กลับไป Cluster0 กด **Connect**
2. เลือก **Drivers** และภาษา **Node.js**
3. คัดลอก connection string ที่ Atlas แสดง
4. กลับ VS Code เปิด **`.env` ใน backend**
5. ใส่ database user และรหัสผ่านจริงของข้อ 1.5 แทน placeholder
6. ใส่ชื่อฐาน `course_books` หลัง hostname และ `/` ก่อน `?` โดยเก็บ query options ที่ Atlas ให้มา

โครงสร้างที่ต้องได้มีรูปนี้ แต่ข้อความตัวใหญ่เป็น placeholder ไม่ใช่ข้อมูลเชื่อมต่อจริง:

```dotenv
MONGODB_URI=mongodb+srv://DB_USER:ENCODED_PASSWORD@YOUR_HOST/course_books?retryWrites=true&w=majority
PORT=3001
```

| ส่วน | ใส่อะไร | อย่าใส่อะไรแทน |
|---|---|---|
| `DB_USER` | database user เช่น book_app | email ที่ sign in เว็บ Atlas |
| `ENCODED_PASSWORD` | รหัสผ่าน database user ที่ URL-encode แล้ว | รหัสผ่านเข้าเว็บ Atlas |
| `YOUR_HOST` | hostname จาก Connect ของ Cluster0 ของเรา | คำว่า Cluster0 อย่างเดียว หรือ host ของเพื่อน |
| `course_books` | ชื่อฐานแอปหลัก | ชื่อ collection books |

หากรหัสผ่านมี `@`, `:`, `/`, `#`, `%` ต้อง URL-encode เฉพาะส่วนรหัสผ่าน เช่นรหัสสมมติ `demo@pass` จะเป็น `demo%40pass` ไม่ encode URI ทั้งเส้น ตัวอย่างนี้แสดงหลักการเท่านั้น ไม่ใช้เป็นรหัสจริง

### ตรวจจุดที่ต้องแก้ให้ครบก่อนบันทึก

อ่านค่าจริงของตัวเองโดยไม่ส่งให้ใคร: หลัง `//` ต้องเป็น database user, หลัง `:` เป็นรหัสผ่านที่เตรียมแล้ว, หลัง `@` เป็น hostname ที่คัดลอกจาก Cluster0, หลัง `/` เป็น course_books อย่าเก็บวงเล็บ `< >` รอบ placeholder และอย่าต่อ URI สองเส้นเข้าด้วยกัน

ตัวอย่างชื่อฐานที่เติมได้: ถ้า Atlas ให้ส่วนท้ายเป็น `...mongodb.net/?retryWrites=true...` ให้เติม `course_books` ระหว่าง `/` กับ `?` กลายเป็น `...mongodb.net/course_books?retryWrites=true...` ส่วน query options หลังเครื่องหมาย ? เก็บของเดิมไว้

กดบันทึกไฟล์ `.env` ข้อความที่ขึ้นต้นด้วย `#` เป็น comment ไม่ใช่ค่าที่โปรแกรมอ่าน ให้มี `MONGODB_URI=` ที่ไม่ถูก comment เพียงหนึ่งบรรทัด

**เมื่อจบขั้นนี้ควรเห็น:** `.env` มี MONGODB_URI ที่ไม่เหลือ DB_USER/ENCODED_PASSWORD/YOUR_HOST หรือ `<db_password>` และมี PORT=3001 ส่วน `.env.example` ยังเป็น placeholder เหมือนเดิม การมีไฟล์อย่างเดียวไม่ได้แปลว่าต่อสำเร็จ เราจะพิสูจน์ด้วย db:check ในขั้นถัดไป

ห้ามใส่ URI ใน React, `VITE_*`, commit, chat หรือ screenshot ไม่ต้องเปิด `.env` ให้เห็นในรูปหลักฐาน

## 1.8 ทดสอบว่าเครื่องเราเชื่อมได้

กลับ terminal backend:

```bash
npm run db:check
```

ฐานใหม่ควรเห็น:

```text
Database ping: OK
Books: 0
```

`ping: OK` หมายถึงโปรแกรมติดต่อ MongoDB ได้ `Books: 0` หมายถึงยังไม่มีหนังสือในฐานหลัก ไม่ใช่ข้อผิดพลาด ถ้ามีข้อมูลอยู่แล้วตัวเลขอาจมากกว่า 0

ถ้าไม่ผ่านให้หยุดที่นี่ ยังไม่เปิด React ดูส่วน 1.12 เพื่อแก้จุดเชื่อมต่อก่อน

## 1.9 เพิ่มฐานข้อมูลตัวอย่างเล็ก

ตอนนี้เราจะใช้โค้ดที่เตรียมไว้เพิ่มข้อมูลสมมติ เปิด `demo/data.js` ดูได้ก่อน จะเห็นเครื่องดื่ม 2 รายการ หนังสือ 2 เล่ม และข้อมูลที่เชื่อมกันอยู่ ตัวเลข ID ของตัวอย่างคงที่เพื่อไล่ตามง่าย

รัน:

```bash
npm run demo:seed
```

ผลสำหรับฐานใหม่:

```text
Sample seed complete (existing records are preserved).
Database: course_books_demo (separate from course_books)
drinks: 2
customers: 1
categories: 1
authors: 2
books: 2
carts: 1
orders: 1
{"title":"Web Basics","category":"Computing","authors":["Nida Demo","Arun Demo"],"salePriceSatang":1800}
{"title":"Database Basics","category":"Computing","authors":["Nida Demo"],"salePriceSatang":2500}
Order total: 3200 satang = 32.00 THB
```

คำว่า **seed** หมายถึงใส่ข้อมูลตั้งต้นไว้ให้โปรแกรมทดลองอ่าน โค้ดเชื่อม host เดิม แต่ระบุ `dbName: 'course_books_demo'` จึงไม่เขียนทับฐานหลัก หากรันอีกครั้งสคริปต์จะไม่เพิ่ม ID เดิมซ้ำ และไม่แก้ข้อมูลที่มีอยู่แล้ว

## 1.10 เปิดดูใน Atlas ทีละคลิก

1. กลับหน้า Atlas ของ Cluster0
2. เปิด **Browse Collections / Data Explorer**
3. กด refresh หากยังไม่เห็นฐานใหม่
4. ที่รายการฐานข้อมูล เลือก **course_books_demo**
5. เลือก collection **drinks**
6. เปิดแท็บ **Documents** ควรเห็น 2 รายการ ถ้ารายการยุบอยู่ให้ขยาย document
7. ที่ช่อง **Filter** ใส่ด้านล่าง แล้วกด **Find**:

```json
{ "name": "Iced Cocoa" }
```

ตอนนี้ควรเหลือ document เดียว มี `name` เป็น Iced Cocoa, `priceSatang` เป็น 4500 และ `available` เป็น true รูปแบบแสดง ObjectId อาจต่างกันระหว่างมุมมอง list กับ JSON แต่เป็นค่าเดียวกัน

![ค่าภายใน document เครื่องดื่มและความหมาย](../../assets/lab10/drink-document.png)

8. เปลี่ยน Filter เป็น `{}` แล้วกด Find จะเห็นทั้งสองรายการอีกครั้ง `{}` คือไม่มีเงื่อนไขจำกัด ไม่ได้แปลว่าให้ลบข้อมูล
9. เลือก `books` ใน **ฐาน demo เดิม** แล้วกรอง `{ "sku": "DEMO-001" }` จะเห็น Web Basics
10. เปิด `orders` ขยาย `items` แล้วขยายสมาชิกตัวแรก จะเห็น `quantity: 2` และ `unitPriceSatang: 1600` เราจะอธิบายความสัมพันธ์นี้ละเอียดในช่วง 3

เราไม่ต้องแก้ document ใน Atlas ตอนนี้ ใช้หน้าจอนี้ดูข้อมูลให้คุ้นกับชื่อก่อน

## 1.11 อ่านข้อมูลเดิมโดยไม่ seed ใหม่

```bash
npm run demo:inspect
```

คำสั่งนี้อ่านจำนวนและรายละเอียดตัวอย่าง ไม่เขียนข้อมูลใหม่ หากเห็นยอด 32.00 THB เหมือนด้านบน แปลว่าได้อ่าน order จากฐานที่เพิ่งดูใน Atlas แล้ว

ส่วนฐานหลัก `course_books` อาจยังไม่เห็นใน Data Explorer ถ้ายังไม่มีการเขียน จะสร้างหนังสือ 200 เล่มในช่วง 4 ตอนนี้ดูฐาน demo ให้เข้าใจก่อน

## 1.12 ถ้าผลไม่ตรง ให้แก้ทีละจุด

| อาการ | ทำตามนี้ | แล้วรันใหม่ |
|---|---|---|
| `npm` หา package.json ไม่พบ | ใช้ `pwd`, `ls`; เข้า `examples/10-mongodb-book-api` | `npm ci` |
| `.env: not found` | สร้าง `.env` ที่ระดับเดียวกับ package.json; ตรวจว่าไม่ใช่ `.env.txt` | `npm run db:check` |
| ข้อความให้แทน placeholder | เปิด `.env` จริงแล้วใส่ค่าทั้งสามจุด; บันทึกไฟล์ | `npm run db:check` |
| database operation failed | ตรวจ database user, รหัสผ่าน/encoding, IP access list, Cluster0 พร้อม, network/DNS | `npm run db:check` |
| db:check ผ่านแต่ demo ไม่ผ่าน | บัญชีอาจมีสิทธิ์เฉพาะ course_books; เพิ่มสิทธิ์ course_books_demo | `npm run demo:seed` |
| Atlas ไม่เห็นฐาน demo | เลือก project/Cluster0 ให้ตรง host ใน .env และกด refresh | เปิด Data Explorer อีกครั้ง |
| เห็นหนังสือ 200 เล่มแทน 2 | กำลังเปิด course_books; เปลี่ยนเป็น course_books_demo | เลือก demo.books |

หากต้องส่ง error ให้ผู้สอน ส่งชื่อคำสั่งและข้อความที่ลบข้อมูลส่วนตัวแล้ว ไม่ส่ง `.env` โค้ดตัวอย่างตั้งใจไม่พิมพ์ URI หรือ driver message ที่อาจมีข้อมูลเชื่อมต่อ

ตอนนี้เราเห็นข้อมูลจริงแล้ว ต่อที่ [ช่วง 2: document สองรายการกับโค้ดที่อ่านข้อมูลนั้น](02-drinks-walkthrough.md)

อ้างอิง: [Atlas database users](https://www.mongodb.com/docs/atlas/security-add-mongodb-users/), [Atlas connection](https://www.mongodb.com/docs/atlas/driver-connection/), [Data Explorer filter](https://www.mongodb.com/docs/atlas/atlas-ui/query/filter/)
