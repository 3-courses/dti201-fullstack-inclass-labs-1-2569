import { useEffect, useState } from 'react';
import { request } from './api.js';

const emptyForm = { title: '', author: '', sourceType: 'book', summary: '' };
const pageSize = 20;

export default function App() {
  const [books, setBooks] = useState([]);
  const [offset, setOffset] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function loadBooks() {
    const body = await request(`?limit=${pageSize}&offset=${offset}`);
    setBooks(body.data);
  }

  useEffect(() => {
    let active = true;
    setError('');
    request(`?limit=${pageSize}&offset=${offset}`)
      .then(body => { if (active) setBooks(body.data); })
      .catch(reason => { if (active) setError(reason.message); });
    return () => { active = false; };
  }, [offset]);

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true); setError(''); setMessage('');
    try {
      const path = editingId ? `/${editingId}` : '';
      const body = await request(path, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setMessage(`บันทึกแล้ว: ${body.data.title} — id: ${body.data.id}`);
      setForm(emptyForm); setEditingId(null);
      await loadBooks();
    } catch (reason) { setError(reason.message); }
    finally { setBusy(false); }
  }

  async function edit(id) {
    setError('');
    try {
      const { data } = await request(`/${id}`);
      setForm({ title: data.title, author: data.author, sourceType: data.sourceType, summary: data.summary });
      setEditingId(data.id);
    } catch (reason) { setError(reason.message); }
  }

  async function remove(book) {
    if (!window.confirm(`ลบหนังสือ “${book.title}” ใช่หรือไม่?`)) return;
    setBusy(true); setError('');
    try {
      await request(`/${book.id}`, { method: 'DELETE' });
      if (editingId === book.id) { setEditingId(null); setForm(emptyForm); }
      setMessage(`ลบแล้ว: ${book.title}`);
      await loadBooks();
    } catch (reason) { setError(reason.message); }
    finally { setBusy(false); }
  }

  return <main>
    <header><p>DTI201 · Lab 10</p><h1>Course Book Explorer</h1><p>เพิ่ม อ่าน แก้ไข และลบข้อมูลหนังสือ</p></header>
    <section aria-labelledby="form-title">
      <h2 id="form-title">{editingId ? 'แก้ไขหนังสือ' : 'เพิ่มหนังสือ'}</h2>
      <form onSubmit={save}>
        <label>ชื่อหนังสือ<input name="title" value={form.title} onChange={change} required minLength={3} /></label>
        <label>ผู้แต่ง<input name="author" value={form.author} onChange={change} required /></label>
        <label>ประเภทแหล่งอ่าน<select name="sourceType" value={form.sourceType} onChange={change}>
          <option value="book">หนังสือ</option><option value="documentation">เอกสาร</option><option value="course">รายวิชา</option>
        </select></label>
        <label>สรุปด้วยคำของเรา<textarea name="summary" value={form.summary} onChange={change} required /></label>
        <button disabled={busy} type="submit">{editingId ? 'บันทึกการแก้ไข' : 'เพิ่มหนังสือ'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>ยกเลิกการแก้ไข</button>}
      </form>
      <p role="status">{message}</p><p role="alert">{error}</p>
    </section>
    <section aria-labelledby="list-title">
      <h2 id="list-title">รายการหนังสือ</h2>
      <p>{books.length ? `รายการที่ ${offset + 1}–${offset + books.length}` : 'ยังไม่มีหนังสือในหน้านี้'} · หน้าละ {pageSize} เล่ม</p>
      <nav aria-label="หน้ารายการ"><button disabled={busy || offset === 0} onClick={() => setOffset(Math.max(0, offset - pageSize))}>ก่อนหน้า</button><button disabled={busy || books.length < pageSize} onClick={() => setOffset(offset + pageSize)}>ถัดไป</button></nav>
      <ul>{books.map(book => <li key={book.id}>
        <h3>{book.title}</h3><p>{book.author} · {book.sourceType}</p><p>{book.summary}</p>
        <small>id: {book.id}</small><div><button disabled={busy} onClick={() => edit(book.id)}>อ่านและแก้ไข</button><button disabled={busy} onClick={() => remove(book)}>ลบ</button></div>
      </li>)}</ul>
    </section>
  </main>;
}
