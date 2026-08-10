# Lab 06 — เปลี่ยน Course Book Explorer เป็น React/Vite app

## เป้าหมาย

หลังจากเข้าใจ HTML, CSS, JavaScript และ JSON แล้ว เราค่อยย้ายเข้าสู่ React เพื่อจัด UI เป็น component

## สร้างโปรเจกต์

```bash
npm create vite@latest course-book-explorer-react -- --template react-ts
cd course-book-explorer-react
npm install
npm run dev
```

## Component tree

ออกแบบก่อนเขียน:

```text
App
  Layout
    Header
    BookPage
      BookFilters
      BookList
        BookCard
      ReadingNoteForm
```

## Type ตั้งต้น

```ts
export type Book = {
  id: string;
  title: string;
  author: string;
  topic: string[];
  sourceType: "book" | "documentation" | "course";
  summary: string;
};
```

## งานในคาบ

1. ย้ายข้อมูลจาก `books.json` มาเป็น mock data ใน `src/data/books.ts`
2. สร้าง `BookCard`
3. สร้าง `BookList`
4. เพิ่ม empty state
5. เพิ่ม CSS ให้ responsive ใกล้เคียง lab 03

## Evidence checklist

- React app รันได้
- มี component อย่างน้อย 3 ตัว
- มี type `Book`
- แสดง book cards จาก array ได้
- commit message เช่น `Build React book explorer prototype`

## Learning Journey

หัวข้อที่ควรเขียน:

- component ใดควรรับ props อะไร
- state อยู่ตรงไหน
- HTML เดิมช่วยให้เขียน React ง่ายขึ้นอย่างไร

## คำถาม oral defense

- props กับ state ต่างกันอย่างไร
- ทำไมเราถึงไม่เริ่ม React ตั้งแต่สัปดาห์ 2
- mock data มีประโยชน์อย่างไร
- component ใดของคุณใหญ่เกินไปหรือยัง
