# ช่วง 1 — เตรียมเครื่อง ต่อ Atlas แล้วเปิดดูข้อมูลก่อนเขียนแอป

[กลับหน้า Lab 10](../../labs/10-book-database-crud.md) · ถัดไป: [ตัวอย่างเครื่องดื่ม](02-drinks-walkthrough.md)

เป้าหมายช่วงนี้คือให้เห็นข้อมูลในฐานจริงก่อน เราจะยังไม่เริ่ม React และยังไม่ต้องเข้าใจโค้ด model ทั้งหมด

## 1.1 สร้างโฟลเดอร์ backend ใน repo ของเรา

ทำ [ช่วง 0: สร้างและ clone repo ของเรา](00-create-your-repository.md) ก่อน เปิดโฟลเดอร์ `dti201-bookstore` ใน VS Code แล้วเปิด Terminal → New Terminal ตรวจปลายทาง:

```bash
pwd
git remote -v
```

pwd ต้องอยู่ที่ราก dti201-bookstore และ origin เป็น URL บัญชีของเรา จากนั้น:

```bash
mkdir backend
cd backend
npm init -y
npm pkg set type=module
```

`mkdir` สร้างโฟลเดอร์ `cd` เปลี่ยนโฟลเดอร์ที่ terminal ทำงาน `npm init -y` สร้าง package.json ของ backend โดยใช้ค่าตั้งต้น ส่วน `type=module` ให้ไฟล์ .js ใช้ import/export ได้

**ผลที่ควรเห็น:** Explorer มี `backend/package.json` ภายในมี `"name": "backend"` และ `"type": "module"` ยังไม่มี source code หรือ database connection จนกว่าเราจะสร้างไฟล์ในขั้นถัดไป

## 1.2 ติดตั้งแพ็กเกจ แล้วสร้างไฟล์ตรวจ connection

รันจาก `dti201-bookstore/backend`:

```bash
npm install express@5.3.0 mongoose@8.24.8
mkdir src scripts
```

**Express** ใช้รับ HTTP request ในช่วง 4 **Mongoose** ใช้เชื่อมและอ่าน/เขียน MongoDB การติดตั้งครั้งแรกนี้สร้าง `package-lock.json` และ `node_modules` พร้อมเพิ่ม dependencies ใน package.json

package-lock.json บันทึกรุ่นแพ็กเกจที่ใช้ ให้ commit ไปด้วย ส่วน node_modules ดาวน์โหลดซ้ำได้และถูก .gitignore ละเว้น หาก clone งานของเราไปเครื่องใหม่ในภายหลัง เมื่อมี lock file แล้วจึงใช้ `npm ci` เพื่อติดตั้งตามรุ่นที่บันทึกไว้

สร้างไฟล์ต่อไปนี้ทีละไฟล์ใน VS Code แล้วคัดลอก **เนื้อหา** จากลิงก์อ้างอิงตามวิธีในช่วง 0.9:

| ไฟล์อ้างอิงใน GitHub แลบ | สร้างใน repo เรา | หน้าที่ |
|---|---|---|
| [src/db.js](../../examples/10-mongodb-book-api/src/db.js) | `backend/src/db.js` | อ่าน URI จาก environment แล้วเปิด connection |
| [scripts/check-db.js](../../examples/10-mongodb-book-api/scripts/check-db.js) | `backend/scripts/check-db.js` | ping ฐานข้อมูลและแสดงจำนวนหนังสือ |

การสร้าง `src/db.js`: คลิกโฟลเดอร์ src ใน Explorer → New File → พิมพ์ db.js → วางเนื้อหาจากลิงก์ → Save ทำแบบเดียวกันกับ scripts/check-db.js ในโฟลเดอร์ scripts

เปิด scripts/check-db.js จะเห็น import จาก `../src/db.js`: ย้อนจาก scripts ขึ้นหนึ่งระดับแล้วเข้า src จึงต้องสร้างสองไฟล์ในตำแหน่งตามตาราง

เพิ่มชื่อคำสั่งสำหรับตรวจ DB:

```bash
npm pkg set 'scripts.db:check=node --env-file=.env scripts/check-db.js'
```

เปิด package.json ตรวจว่า scripts มี db:check ตามคำสั่งนี้ ยังไม่รัน db:check เพราะเราจะสร้าง .env และตั้ง Atlas ก่อน

## 1.3 `.env` คืออะไร และทำไมต้องแยกจากโค้ด

โปรแกรมต้องรู้สองค่าก่อนเริ่มทำงาน:

- **จะเชื่อมฐานข้อมูลที่ไหนและด้วยบัญชีใด** เก็บในชื่อ `MONGODB_URI`
- **จะรับคำขอ HTTP ที่ port ใด** เก็บในชื่อ `PORT` เช่น 3001

นักศึกษาแต่ละคนมีที่อยู่ Cluster0 และรหัสผ่านต่างกัน แต่ใช้โค้ด Express ชุดเดียวกันได้ โดยแยกค่าของแต่ละเครื่องไว้ในไฟล์ชื่อ **`.env`** แทนการเขียนรหัสผ่านไว้ใน `src/db.js` เมื่อเปลี่ยนฐานข้อมูล จึงเปลี่ยนค่าตั้งต้นโดยไม่ต้องแก้คำสั่ง query

### อ่านรูปแบบ `ชื่อ=ค่า`

`.env` เป็นไฟล์ข้อความธรรมดา แต่ละบรรทัดเขียนชื่อค่าทางซ้าย ตามด้วย `=` และค่าทางขวา เช่น:

```dotenv
PORT=3001
```

บรรทัดนี้กำหนดค่าให้ชื่อ `PORT` เป็นข้อความ `3001` เมื่อโปรแกรมนำไปใช้เป็นหมายเลข port จะเปลี่ยนเป็นตัวเลขด้วย `Number(...)` ไม่ต้องใส่ `const`, เครื่องหมาย `;` หรือวงเล็บ `{}` แบบไฟล์ JavaScript

ค่าที่โปรแกรมได้รับผ่านชื่อเหล่านี้เรียกว่า **environment variables** หรือตัวแปรสภาพแวดล้อม ใน Node.js อ่านได้ผ่าน `process.env` เช่น `process.env.PORT`

บรรทัดที่ขึ้นต้นด้วย `#` เป็นคำอธิบาย เช่น:

```dotenv
# Port ที่ Express ใช้รับคำขอ
PORT=3001
```

### แยก `.env.example` กับ `.env`

ใน VS Code คลิก backend → New File → ตั้งชื่อ `.env.example` แล้ววางเนื้อหาต่อไปนี้และ Save:

```dotenv
MONGODB_URI=mongodb+srv://DB_USER:ENCODED_PASSWORD@YOUR_HOST/course_books?retryWrites=true&w=majority
PORT=3001
```

ยังไม่ต้องพิมพ์รหัสผ่านตอนนี้ ขั้น 1.5–1.7 จะพาเตรียม database user และคัดลอก URI แล้วกลับมาแทน `DB_USER`, `ENCODED_PASSWORD`, `YOUR_HOST`

| ไฟล์ | หน้าที่ | ค่าที่อยู่ในไฟล์ | เก็บใน Git หรือไม่ |
|---|---|---|---|
| `.env.example` | แสดงว่าต้องตั้งค่าชื่อใดบ้าง | placeholder และค่าตั้งต้น เช่น PORT=3001 | เก็บได้ เพื่อให้คนอื่นสร้างไฟล์ของตน |
| `.env` | ให้ Node.js อ่านค่าของเครื่องเรา | URI ที่มีบัญชี/รหัสผ่านจริง และ PORT | ไม่เก็บใน Git |

`.env` ไม่ใช่ฐานข้อมูลและไม่เก็บรายการหนังสือ การลบไฟล์นี้ไม่ได้ลบหนังสือใน Atlas แต่โปรแกรมจะไม่รู้ค่าที่ใช้เชื่อมต่อจนกว่าจะสร้างไฟล์และตั้งค่าใหม่ ไฟล์นี้เป็นข้อความธรรมดา ไม่ได้เข้ารหัสรหัสผ่านให้เอง

### สร้างไฟล์ในตำแหน่งที่โปรแกรมจะอ่าน

ไฟล์ต้องอยู่ที่ระดับเดียวกับ `package.json` ของ **backend**:

```text
dti201-bookstore/backend/
├── .env.example
├── .env                 ← สร้างตรงนี้
├── package.json
└── src/
```

1. ใน Explorer ด้านซ้ายของ VS Code ขยายโฟลเดอร์ `backend` ใน repo เรา
2. ตรวจว่ามี `.env` อยู่แล้วหรือไม่ หากมีให้เปิดไฟล์เดิม ไม่คัดลอกทับ
3. หากยังไม่มี ให้คลิกขวา `.env.example` → Copy แล้วคลิกขวาโฟลเดอร์ `backend` → Paste
4. เปลี่ยนชื่อไฟล์ที่คัดลอกเป็น **`.env`** รวมจุดด้านหน้า ไม่มี `.txt` ต่อท้าย
5. เปิด `.env` ตรวจว่ามี MONGODB_URI และ PORT แล้วกดบันทึก

หากใช้ terminal ที่ backend และยังไม่มี `.env` สามารถคัดลอกด้วยคำสั่งนี้แทนขั้น 3–4:

```bash
cp .env.example .env
```

`cp` คัดลอกไฟล์ทางซ้ายไปเป็นชื่อทางขวา คำสั่งนี้เขียนทับไฟล์ปลายทางได้ จึงตรวจว่ามีไฟล์เดิมหรือไม่ก่อนรัน

**ผลที่ควรเห็น:** ใน VS Code มีทั้ง `.env.example` และ `.env` อยู่ข้าง `package.json` หากใช้ `ls` แล้วไม่เห็นไฟล์ที่ขึ้นต้นด้วยจุด ให้ใช้ `ls -a` เพื่อแสดงไฟล์เหล่านั้นด้วย

### Node.js โหลด `.env` ตอนไหน

เปิด `package.json` มองในส่วน `scripts` จะเห็น:

```json
"db:check": "node --env-file=.env scripts/check-db.js"
```

เมื่อรัน `npm run db:check` จะเกิดลำดับดังนี้:

1. npm หาคำสั่งชื่อ db:check ใน package.json
2. Node.js อ่านไฟล์ที่ระบุด้วย `--env-file=.env` จากโฟลเดอร์ที่รันคำสั่ง
3. ค่าจากไฟล์เข้าถึงได้ผ่าน `process.env`
4. สคริปต์เรียก `connectDatabase()` ใน `src/db.js` ซึ่งอ่าน `process.env.MONGODB_URI` แล้วส่งให้ Mongoose เชื่อมต่อ

![Node.js อ่านค่าจาก .env แล้วนำ URI ไปเชื่อม MongoDB](../../assets/lab10/env-loading.png)

**การตั้งชื่อไฟล์ว่า `.env` อย่างเดียวไม่ได้ทำให้ JavaScript อ่านไฟล์เอง** โปรแกรมนี้ใช้ option `--env-file` ของ Node.js จึงไม่ต้องติดตั้งแพ็กเกจ dotenv เพิ่ม และไม่ได้โหลดค่าจาก `.env.example`

### ตรวจว่าอ่านไฟล์ถูกโดยยังไม่เชื่อมฐานข้อมูล

ใน terminal ที่ `dti201-bookstore/backend` รัน:

```bash
node --env-file=.env -e 'console.log(process.env.PORT)'
```

`-e` ให้ Node.js รัน JavaScript สั้น ๆ ที่ตามมา ควรพิมพ์ **3001** แล้วจบ คำสั่งนี้อ่านเฉพาะ PORT ไม่ทดสอบ Atlas และไม่พิมพ์ URI หรือรหัสผ่าน

- หากได้ `.env: not found` ให้ตรวจโฟลเดอร์ปัจจุบันและชื่อไฟล์ ไม่ใช่แก้บัญชี Atlas
- หากได้ `undefined` ให้เปิด `.env` ตรวจว่ามีบรรทัด `PORT=3001` ที่ไม่ขึ้นต้นด้วย `#` แล้วบันทึก
- หากได้เลขอื่น ให้ตรวจค่า PORT ในไฟล์ หาก terminal ตั้ง environment variable ชื่อ PORT ไว้อยู่แล้ว ค่านั้นมีลำดับเหนือค่าจากไฟล์

ก่อน commit ตรวจว่า Git ละเว้นไฟล์นี้:

```bash
git check-ignore .env
```

ควรพิมพ์ `.env` แปลว่าตรงกับกฎใน `.gitignore` หากไม่มีผล ให้ตรวจ `.gitignore` ว่ามีบรรทัด `.env` ก่อนเพิ่มไฟล์เข้า Git ไม่ใช้ `git add -f .env`

เมื่อแก้ `.env` หลังเปิด Express ไปแล้ว ให้กด Ctrl+C ใน terminal ของ Express แล้วรัน `npm run dev` ใหม่ (จะเพิ่มคำสั่งนี้ในช่วง 4) เพื่อให้ process ใหม่อ่านค่า หากเปลี่ยน PORT เช่น 3002 ต้องเปลี่ยน URL ที่ใช้ curl และ target ใน `frontend/vite.config.js` เป็น port เดียวกันด้วย

หลังขั้นนี้เรายังไม่เชื่อม Atlas เพราะ URI ยังเป็น placeholder ต่อไปจะเตรียมบัญชีและที่อยู่ของฐานข้อมูล แล้วกลับมาใส่ใน `.env`

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

ขั้นนี้จะนำ URI จาก Atlas กลับมาแทนค่าตัวอย่างใน `.env` ที่สร้างในขั้น 1.3 ส่วน PORT คงเป็น 3001

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

## 1.9 สร้างไฟล์ข้อมูลตัวอย่าง แล้วเพิ่มลง MongoDB

ใน terminal backend สร้างโฟลเดอร์:

```bash
mkdir demo
```

ใน VS Code สร้างไฟล์ใน demo ทีละไฟล์ แล้วคัดลอกเนื้อหาจากลิงก์:

| ไฟล์อ้างอิงใน GitHub แลบ | สร้างใน repo เรา | หน้าที่ |
|---|---|---|
| [demo/data.js](../../examples/10-mongodb-book-api/demo/data.js) | `backend/demo/data.js` | document สมมติและ ObjectId ที่เชื่อมกัน |
| [demo/inspect.js](../../examples/10-mongodb-book-api/demo/inspect.js) | `backend/demo/inspect.js` | อ่านข้อมูลที่เชื่อมกันและคำนวณยอด order |
| [demo/sample-db.js](../../examples/10-mongodb-book-api/demo/sample-db.js) | `backend/demo/sample-db.js` | ต่อฐาน demo แล้วเพิ่ม/อ่านข้อมูล |

sample-db.js import data.js และ inspect.js จึงต้องสร้างทั้งสามไฟล์ก่อนรัน เพิ่มคำสั่ง npm จาก terminal backend:

```bash
npm pkg set 'scripts.demo:seed=node --env-file=.env demo/sample-db.js --seed'
npm pkg set 'scripts.demo:inspect=node --env-file=.env demo/sample-db.js'
```

เปิด `demo/data.js` จะเห็นเครื่องดื่ม 2 รายการ หนังสือ 2 เล่ม และรหัสที่เชื่อมข้อมูลเข้าด้วยกัน คำสั่ง demo:seed จะอ่านข้อมูลจากไฟล์นี้ไปเพิ่มใน MongoDB

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

## 1.12 Commit การเชื่อม Atlas และฐานตัวอย่าง

จาก terminal backend กลับราก repo ด้วย `cd ..`:

```bash
cd ..
git status --short
git check-ignore backend/.env backend/node_modules
```

ควรเห็น backend/.env และ backend/node_modules จาก check-ignore และไม่เห็นสองรายการนี้ใน status ไฟล์ที่ควรส่งขึ้น GitHub คือ package.json, package-lock.json, .env.example และ source code

```bash
git add backend/package.json backend/package-lock.json backend/.env.example backend/src/db.js backend/scripts/check-db.js backend/demo
git diff --cached
git commit -m "Connect Atlas and add sample database"
git push
cd backend
```

ก่อน commit อ่าน diff ให้แน่ใจว่า .env.example ยังเป็น placeholder และไม่มีรหัสผ่าน กลับ GitHub repo ของเรา กด refresh จะเห็นโฟลเดอร์ backend และ commit ใหม่ `.env` ต้องไม่อยู่ในรายการไฟล์

## 1.13 ถ้าผลไม่ตรง ให้แก้ทีละจุด

| อาการ | ทำตามนี้ | แล้วรันใหม่ |
|---|---|---|
| `npm` หา package.json ไม่พบ | ใช้ `pwd`, `ls`; เข้า `dti201-bookstore/backend` | `npm install` |
| `.env: not found` | สร้าง `.env` ที่ระดับเดียวกับ package.json; ตรวจว่าไม่ใช่ `.env.txt` | `npm run db:check` |
| ข้อความให้แทน placeholder | เปิด `.env` จริงแล้วใส่ค่าทั้งสามจุด; บันทึกไฟล์ | `npm run db:check` |
| database operation failed | ตรวจ database user, รหัสผ่าน/encoding, IP access list, Cluster0 พร้อม, network/DNS | `npm run db:check` |
| db:check ผ่านแต่ demo ไม่ผ่าน | บัญชีอาจมีสิทธิ์เฉพาะ course_books; เพิ่มสิทธิ์ course_books_demo | `npm run demo:seed` |
| Atlas ไม่เห็นฐาน demo | เลือก project/Cluster0 ให้ตรง host ใน .env และกด refresh | เปิด Data Explorer อีกครั้ง |
| เห็นหนังสือ 200 เล่มแทน 2 | กำลังเปิด course_books; เปลี่ยนเป็น course_books_demo | เลือก demo.books |

หากต้องส่ง error ให้ผู้สอน ส่งชื่อคำสั่งและข้อความที่ลบข้อมูลส่วนตัวแล้ว ไม่ส่ง `.env` โค้ดตัวอย่างตั้งใจไม่พิมพ์ URI หรือ driver message ที่อาจมีข้อมูลเชื่อมต่อ

ตอนนี้เราเห็นข้อมูลจริงแล้ว ต่อที่ [ช่วง 2: document สองรายการกับโค้ดที่อ่านข้อมูลนั้น](02-drinks-walkthrough.md)

อ้างอิง: [Atlas database users](https://www.mongodb.com/docs/atlas/security-add-mongodb-users/), [Atlas connection](https://www.mongodb.com/docs/atlas/driver-connection/), [Data Explorer filter](https://www.mongodb.com/docs/atlas/atlas-ui/query/filter/)
