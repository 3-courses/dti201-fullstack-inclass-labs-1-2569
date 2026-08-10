# Lab 05 — แยกข้อมูลหนังสือเป็น JSON และทดลองคิดแบบ API

## เป้าหมาย

คาบนี้เราจะย้ายข้อมูลหนังสือออกจาก HTML ไปอยู่ใน `books.json` แล้วใช้ `fetch` โหลดข้อมูลมาแสดงผล

นี่คือสะพานจาก static page ไปสู่ dynamic app และเตรียมตัวก่อนมี backend จริง

## เพิ่มไฟล์

```text
data/books.json
```

สามารถเริ่มจากข้อมูลใน `docs/course-book-data.md` แล้วคัดเฉพาะ JSON starter ไปไว้ใน `data/books.json`

ตัวอย่างข้อมูล:

```json
[
  {
    "id": "book-fullstack-react-ts",
    "title": "Fullstack React with TypeScript",
    "author": "Juha-Matti Santala",
    "topic": ["React", "TypeScript", "Frontend"],
    "sourceType": "book",
    "summary": "แหล่งเรียนรู้สำหรับการสร้าง frontend app ด้วย React และ TypeScript"
  },
  {
    "id": "book-nodejs-web-dev",
    "title": "Node.js Web Development",
    "author": "David Herron",
    "topic": ["Node.js", "Express", "Backend"],
    "sourceType": "book",
    "summary": "แหล่งเรียนรู้ด้าน backend และ web server ด้วย Node.js"
  },
  {
    "id": "docs-mdn",
    "title": "MDN Web Docs",
    "author": "Mozilla",
    "topic": ["HTML", "CSS", "JavaScript"],
    "sourceType": "documentation",
    "summary": "เอกสารอ้างอิงหลักสำหรับเทคโนโลยีเว็บ"
  }
]
```

## ใช้ local server

หลาย browser ไม่ให้ `fetch` อ่านไฟล์ JSON จาก `file://` โดยตรง ให้รัน server ง่าย ๆ:

```bash
python3 -m http.server 8080
```

เปิด:

```text
http://localhost:8080
```

## โหลด JSON ด้วย fetch

```js
async function loadBooks() {
  const response = await fetch("./data/books.json");

  if (!response.ok) {
    throw new Error("โหลดข้อมูลหนังสือไม่สำเร็จ");
  }

  return response.json();
}

loadBooks()
  .then((books) => {
    console.log(books);
  })
  .catch((error) => {
    console.error(error);
  });
```

## ทดลองด้วย curl

```bash
curl http://localhost:8080/data/books.json
```

ถ้ามี `jq`:

```bash
curl -s http://localhost:8080/data/books.json | jq '.[0].title'
```

## Evidence checklist

- `books.json` มีอย่างน้อย 5 รายการ
- `fetch` โหลดข้อมูลได้
- มี loading/error message อย่างง่าย
- มี `curl` evidence ใน note

## ReasoningTrace

เขียนว่า:

```text
Problem:
เดิมข้อมูลหนังสือฝังใน HTML ทำให้แก้ยาก

Decision:
แยกเป็น JSON เพราะต่อไป backend/API จะส่งข้อมูลรูปแบบเดียวกันได้

Verification:
เปิด local server และใช้ curl ตรวจ books.json
```

## คำถาม oral defense

- JSON ต่างจาก JavaScript object อย่างไร
- ทำไมต้องรัน local server
- `response.ok` คืออะไร
- ถ้า JSON field เปลี่ยน frontend จะพังตรงไหน
