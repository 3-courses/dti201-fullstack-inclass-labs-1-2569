# Lab 07 — React form, effects และ API service layer

## เป้าหมาย

คาบนี้เราจะทำให้ React app พร้อมเชื่อม backend โดยแยก logic เรียกข้อมูลออกจาก component

## เพิ่ม service layer

สร้าง:

```text
src/services/bookApi.ts
```

ตัวอย่าง:

```ts
import type { Book } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

export async function getBooks(): Promise<Book[]> {
  const response = await fetch(`${API_BASE_URL}/api/books`);

  if (!response.ok) {
    throw new Error("โหลดหนังสือไม่สำเร็จ");
  }

  return response.json();
}
```

## UI states ที่ต้องมี

```text
idle
loading
success with data
success with empty data
error
```

## งานในคาบ

1. สร้าง `ReadingNoteForm` แบบ controlled form
2. เพิ่ม validation ฝั่ง frontend
3. เตรียม `VITE_API_BASE_URL`
4. แยก service function ออกจาก component
5. เขียน note ว่า response shape ที่คาดหวังคืออะไร

## Evidence checklist

- form ใน React ใช้งานได้
- มี loading/error/empty state
- มี `src/services/bookApi.ts`
- มี `.env.example`
- มี ReasoningTrace เรื่อง API contract

## คำถาม oral defense

- ทำไมไม่ควร hard-code API URL ใน component
- controlled form คืออะไร
- error แล้วควรล้าง form หรือไม่
- service layer ช่วยให้เปลี่ยน backend ง่ายขึ้นอย่างไร
