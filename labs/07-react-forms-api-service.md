# Lab 07 — React form, effects และ API service layer

## เป้าหมาย

คาบนี้เราจะทำให้ React app พร้อมเชื่อม backend โดยแยก logic เรียกข้อมูลออกจาก component

ก่อนเริ่ม นักศึกษาควรผ่าน core evidence ของ Lab 05 โดยเฉพาะ Promise, `response.ok`, JSON CRUD และ loading/error/empty state ถ้ายังอธิบายสิ่งเหล่านี้ไม่ได้ ให้กลับไปทำ Checkpoint 1–6 ก่อน

อ่านคู่กับหนังสือฉบับเต็ม Chapter 6 หน้าที่พิมพ์ 55–61 ซึ่งต่อจาก React component/state ไปสู่ controlled form, validation loop, API service, Effect, cleanup และ workflow state machine

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

## นำ Fetch pipeline จาก Lab 05 มาใช้ซ้ำ

อย่าเขียน error handling ใหม่ทุก function ให้รวมไว้ที่เดียว:

```ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message: string,
  ) {
    super(message);
  }
}

async function requestJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      typeof body === "object" && body && "title" in body
        ? String(body.title)
        : `HTTP ${response.status}`;
    throw new ApiError(response.status, body, message);
  }

  return body as T;
}
```

สำหรับ `204 No Content` ให้แยก return type เป็น `Promise<void>` และไม่พยายาม parse JSON body

## React CRUD service

```ts
export type ReadingNote = {
  id: string;
  bookId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
};

export type NewReadingNote = Pick<ReadingNote, "bookId" | "text">;

export const getNotes = () =>
  requestJson<ReadingNote[]>("/api/notes");

export const createNote = (input: NewReadingNote) =>
  requestJson<ReadingNote>("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

export const updateNote = (id: string, text: string) =>
  requestJson<ReadingNote>(`/api/notes/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

export async function deleteNote(id: string): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/notes/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
  if (!response.ok) throw new ApiError(response.status, null, `HTTP ${response.status}`);
}
```

ชื่อ field ต้องปรับให้ตรงกับ backend contract ที่ใช้จริง ห้ามแก้ client ให้ “เดา” shape หลายแบบโดยไม่มี documentation

## Effect และ cleanup

```tsx
useEffect(() => {
  const controller = new AbortController();

  async function load() {
    setStatus("loading");
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes`, {
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const notes = await response.json();
      setNotes(notes);
      setStatus("success");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus("error");
    }
  }

  load();
  return () => controller.abort();
}, []);
```

ใน production app อาจใช้ framework data loader หรือ client cache แทนการเขียน fetch Effect เอง แต่ lab นี้ใช้ Effect เพื่อให้เห็นการเชื่อม external system และ cleanup ชัดเจน

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
5. ทำ list/create/update/delete ผ่าน service layer
6. อัปเดต React state หลัง API success และเก็บ input เดิมเมื่อ API error
7. เพิ่ม Effect cleanup เพื่อป้องกัน stale response
8. เขียน note ว่า success/error response shape ที่คาดหวังคืออะไร

## Evidence checklist

- form ใน React ใช้งานได้
- มี loading/error/empty state
- มี `src/services/bookApi.ts`
- มี CRUD service functions และ Network evidence ของ 201/200/204
- มี `.env.example`
- ไม่มี secret ในตัวแปร `VITE_*`; frontend base URL ไม่ใช่ secret
- มี ReasoningTrace เรื่อง API contract

## คำถาม oral defense

- ทำไมไม่ควร hard-code API URL ใน component
- controlled form คืออะไร
- error แล้วควรล้าง form หรือไม่
- service layer ช่วยให้เปลี่ยน backend ง่ายขึ้นอย่างไร
- ทำไม Effect ต้องมี cleanup และ Strict Mode อาจเรียก setup/cleanup เพิ่มใน development อย่างไร
- เหตุใด `DELETE 204` จึงใช้ helper ที่พยายาม parse JSON ตรง ๆ ไม่ได้
