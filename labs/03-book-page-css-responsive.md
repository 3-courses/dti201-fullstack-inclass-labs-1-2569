# Lab 03 — แต่งหน้า book page ด้วย CSS, responsive design และ accessibility

## เป้าหมายของคาบนี้

คาบนี้เราจะทำให้หน้า Course Book Explorer อ่านง่าย ใช้ได้บนมือถือ และไม่กีดกันผู้ใช้ที่ใช้ keyboard หรือ screen reader

CSS ไม่ใช่แค่ “ทำให้สวย” แต่ช่วยจัดลำดับสายตา ทำให้ข้อมูลอ่านง่าย และทำให้ผู้ใช้ไม่หลงทาง

## งานในคาบ

เพิ่มไฟล์:

```text
styles.css
```

แล้วเชื่อมใน `index.html`:

```html
<link rel="stylesheet" href="styles.css">
```

## สิ่งที่ต้องทำ

1. ตั้ง typography พื้นฐาน
2. ทำ layout ของ book cards
3. ทำ form ให้ใช้งานง่าย
4. ทำ responsive layout
5. เพิ่ม focus state
6. ตรวจสีและ contrast เบื้องต้น

## ตัวอย่าง CSS เริ่มต้น

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.6;
  color: #17202a;
  background: #f6f8fb;
}

header {
  padding: 2rem 1rem;
  background: #1f4f7a;
  color: white;
}

main {
  width: min(100% - 2rem, 960px);
  margin: 2rem auto;
}

.book-grid {
  display: grid;
  gap: 1rem;
}

.book-card {
  padding: 1rem;
  border: 1px solid #d7dee8;
  border-radius: 0.75rem;
  background: white;
}

label {
  display: block;
  margin-top: 1rem;
  font-weight: 600;
}

input,
textarea,
button {
  width: 100%;
  font: inherit;
}

input,
textarea {
  padding: 0.7rem;
  border: 1px solid #b6c2d0;
  border-radius: 0.5rem;
}

button {
  margin-top: 1rem;
  padding: 0.8rem 1rem;
  border: 0;
  border-radius: 0.5rem;
  background: #1f4f7a;
  color: white;
  cursor: pointer;
}

a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 3px solid #ffb703;
  outline-offset: 3px;
}

@media (min-width: 720px) {
  .book-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

อย่าลืมเพิ่ม class ใน HTML:

```html
<section id="books" class="book-grid">
```

หรือจะใช้ wrapper แยกก็ได้ เช่น:

```html
<div class="book-grid">
  <article class="book-card">...</article>
</div>
```

## ตรวจ responsive

ใน DevTools ให้ลองขนาด:

- 360px
- 768px
- 1024px

ดูว่า:

- card ไม่ล้นจอ
- form กรอกได้
- button กดง่าย
- text ไม่เล็กเกินไป

## Evidence checklist

- screenshot mobile 1 รูป
- screenshot desktop 1 รูป
- note ว่าแก้ responsive issue อะไร
- commit message เช่น `Style responsive book catalog`

## Learning Journey entry

ตัวอย่าง:

```text
Problem: book cards ดูแน่นและอ่านยากบนมือถือ
Evidence: DevTools ที่ 360px แสดงว่า card เบียดกัน
Options: ใช้ flex, grid, หรือ stack แนวตั้ง
Decision: ใช้ CSS grid และเริ่มจาก 1 column ก่อน แล้วค่อยเพิ่ม 2 columns เมื่อจอกว้าง
Verification: ทดสอบที่ 360px และ 1024px
Lesson: mobile-first ทำให้ layout ปลอดภัยกว่าเริ่มจาก desktop
```

## คำถาม oral defense

- mobile-first คืออะไร
- `box-sizing: border-box` ช่วยอะไร
- `focus-visible` สำคัญกับใคร
- ถ้า card ล้นจอ คุณจะดู CSS rule ไหนก่อน
