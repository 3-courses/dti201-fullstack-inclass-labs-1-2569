# Lab 04 — เพิ่ม JavaScript ให้ reading note form

## เป้าหมาย

คาบนี้เราจะทำให้ form มีชีวิตขึ้นมา: อ่านค่าจากผู้ใช้ ตรวจข้อมูล แสดง error และเพิ่ม reading note ลงหน้าเว็บโดยยังไม่ต้องมี backend

เนื้อหาเชื่อมกับ DTI-202 JavaScript:

- variables และ data types
- objects และ arrays
- DOM selection
- events
- form validation

## เพิ่มไฟล์

```text
script.js
```

เชื่อมท้าย `body`:

```html
<script src="script.js"></script>
```

## ปรับ HTML

เพิ่มพื้นที่แสดงผล:

```html
<p id="form-error" role="alert"></p>
<ul id="note-list"></ul>
```

## งานในคาบ

1. เมื่อกด submit ให้หยุดการ reload หน้า
2. อ่านค่า `bookTitle` และ `note`
3. ตรวจว่าไม่ว่าง
4. ถ้าผิด แสดง error
5. ถ้าถูก เพิ่ม note ลง list
6. ล้าง form หลังบันทึกสำเร็จ

## ตัวอย่าง JavaScript

```js
const form = document.querySelector("form");
const errorBox = document.querySelector("#form-error");
const noteList = document.querySelector("#note-list");

const notes = [];

function renderNotes() {
  noteList.innerHTML = "";

  for (const note of notes) {
    const item = document.createElement("li");
    item.textContent = `${note.bookTitle}: ${note.text}`;
    noteList.appendChild(item);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const bookTitle = String(formData.get("bookTitle") || "").trim();
  const text = String(formData.get("note") || "").trim();

  if (bookTitle.length < 3) {
    errorBox.textContent = "กรุณากรอกชื่อหนังสืออย่างน้อย 3 ตัวอักษร";
    return;
  }

  if (text.length < 10) {
    errorBox.textContent = "กรุณาเขียนบันทึกอย่างน้อย 10 ตัวอักษร";
    return;
  }

  notes.push({
    id: crypto.randomUUID(),
    bookTitle,
    text,
    createdAt: new Date().toISOString(),
  });

  errorBox.textContent = "";
  form.reset();
  renderNotes();
});
```

## AI-off drill

เขียน test case 5 กรณีด้วยตัวเอง:

| Case | Input | Expected |
|---|---|---|
| ไม่มีชื่อหนังสือ | `""` | แสดง error |
| ชื่อสั้นเกินไป | `"JS"` | แสดง error |
| note สั้นเกินไป | `"ดี"` | แสดง error |
| ข้อมูลถูกต้อง | ชื่อ + note ยาวพอ | เพิ่มลง list |
| submit สองครั้ง | note สองรายการ | list มีสองรายการ |

## Evidence checklist

- form validation ทำงาน
- note แสดงบนหน้าเว็บ
- มี test case ใน `docs/ReasoningTrace.md`
- commit message เช่น `Add reading note form validation`

## คำถาม oral defense

- `event.preventDefault()` ทำอะไร
- ทำไมต้อง `trim()`
- array `notes` หายไหมถ้า refresh หน้า
- frontend validation พอสำหรับระบบจริงหรือไม่
