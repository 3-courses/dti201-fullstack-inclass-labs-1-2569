# Lab 02 — จากหนังสือจริงสู่ Semantic HTML

## เป้าหมายของคาบนี้

คาบนี้เราจะสร้างหน้าเว็บจากข้อมูลหนังสือจริงที่ใช้ในรายวิชา ไม่ใช้ lorem ipsum และไม่ copy เนื้อหาหนังสือ เราจะใช้เฉพาะ metadata เช่น ชื่อหนังสือ ผู้แต่ง ปี สำนักพิมพ์ ISBN และคำอธิบายสั้น ๆ ที่เราเขียนเอง

เป้าหมายคือเข้าใจว่า HTML มีหน้าที่ “ห่อหุ้มความหมาย” ไม่ใช่แค่ทำให้ตัวอักษรขึ้นบนจอ

## หนังสือตั้งต้น

เลือกอย่างน้อย 3 รายการจากแหล่งเรียนรู้ของรายวิชา:

| ชื่อ | ผู้แต่ง/แหล่ง | หมายเหตุ |
|---|---|---|
| Fullstack React with TypeScript | Juha-Matti Santala | React + TypeScript |
| Node.js Web Development | David Herron | Node.js + backend |
| Docker for Developers | Richard Bullington-McGuire | Docker |
| Designing Data-Intensive Applications | Martin Kleppmann | data-intensive systems |
| You Don’t Know JS Yet | Kyle Simpson | JavaScript open-source |
| MDN Web Docs | Mozilla | HTML/CSS/JS reference |

ดู starter data เพิ่มเติมได้ที่ `docs/course-book-data.md`

## ห้ามทำ

- ห้าม copy เนื้อหาหนังสือยาว ๆ ลง repo
- ห้าม upload PDF หนังสือ
- ห้ามใส่ไฟล์ที่ละเมิดลิขสิทธิ์

ให้เขียน summary ด้วยคำของตัวเอง เช่น “หนังสือเล่มนี้เหมาะกับการเรียนเรื่อง component และ state”

## งานในคาบ

เขียน `index.html` ให้เป็นหน้า catalog ของ Course Book Explorer

โครงสร้างที่ต้องมี:

- `header`
- `nav`
- `main`
- `section`
- `article` สำหรับหนังสือแต่ละเล่ม
- heading ที่เรียงลำดับดี
- list หรือ table ที่เหมาะสม
- form สำหรับเพิ่ม reading note แบบยังไม่ต้องทำงานจริง

## ตัวอย่างโครง

```html
<!doctype html>
<html lang="th">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Course Book Explorer</title>
  </head>
  <body>
    <header>
      <h1>Course Book Explorer</h1>
      <p>คลังหนังสือและแหล่งเรียนรู้สำหรับ DTI201</p>
    </header>

    <nav aria-label="เมนูหลัก">
      <a href="#books">หนังสือ</a>
      <a href="#reading-note">บันทึกการอ่าน</a>
    </nav>

    <main>
      <section id="books" aria-labelledby="books-heading">
        <h2 id="books-heading">หนังสือและแหล่งเรียนรู้</h2>

        <article class="book-card">
          <h3>Fullstack React with TypeScript</h3>
          <p><strong>ผู้แต่ง:</strong> Juha-Matti Santala</p>
          <p><strong>หัวข้อที่เกี่ยวข้อง:</strong> React, TypeScript, frontend</p>
          <p>เหมาะสำหรับดูแนวคิดการสร้าง frontend app แบบ component-based</p>
        </article>
      </section>

      <section id="reading-note" aria-labelledby="note-heading">
        <h2 id="note-heading">บันทึกการอ่าน</h2>
        <form>
          <label for="book-title">ชื่อหนังสือ</label>
          <input id="book-title" name="bookTitle" type="text">

          <label for="note">สิ่งที่ได้เรียนรู้</label>
          <textarea id="note" name="note"></textarea>

          <button type="submit">บันทึก</button>
        </form>
      </section>
    </main>
  </body>
</html>
```

## Checklist

- ใช้ `lang="th"`
- มี `meta viewport`
- มี `label` คู่กับ input
- ไม่ใช้ `div` ทั้งหน้า
- heading เรียงจาก `h1` → `h2` → `h3`
- อ่านหน้าเว็บได้แม้ยังไม่มี CSS

## DevTools

เปิด browser DevTools แล้วตรวจ:

- Elements panel เห็นโครงสร้างชัดไหม
- form field มีชื่อไหม
- link ใน `nav` กระโดดไป section ถูกไหม

## Learning Journey entry

หัวข้อที่ควรบันทึก:

```text
Problem: ไม่แน่ใจว่าข้อมูลหนังสือควรใช้ tag อะไร
Evidence: หนังสือแต่ละเล่มเป็น content block แยกกัน
Decision: ใช้ article สำหรับหนังสือแต่ละเล่ม เพราะเป็นเนื้อหาที่แยกอ่านได้
Verification: เปิด DevTools แล้วเห็นโครงสร้าง article ภายใต้ section
Lesson: HTML เริ่มจากความหมายของเนื้อหา ไม่ใช่หน้าตา
```

## คำถาม oral defense

- ทำไมหนังสือแต่ละเล่มควรเป็น `article`
- `label` สำคัญอย่างไร
- `nav` ควรลิงก์ไปที่อะไร
- ถ้าปิด CSS หน้าเว็บยังใช้งานได้ไหม
