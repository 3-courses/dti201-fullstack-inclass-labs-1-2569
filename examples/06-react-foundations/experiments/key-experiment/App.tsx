import { useState } from 'react';
// Try true, reload, run the experiment; then false, reload and repeat.
const USE_INDEX_KEYS = false;
const initialBooks = [
  { id: 'b1', title: 'Learning React', author: 'Alex' },
  { id: 'b2', title: 'Web Basics', author: 'Sam' },
  { id: 'b3', title: 'JavaScript Lab', author: 'Nok' },
];
type Book = { id: string; title: string; author: string };
function BookCard({ book }: { book: Book }) {
  const [expanded, setExpanded] = useState(false);
  return <article>
    <h2>{book.id}: {book.title}</h2>
    <button onClick={() => setExpanded(value => !value)}>
      {expanded ? 'Hide author' : 'Show author'}
    </button>
    {expanded && <p>{book.author}</p>}
  </article>;
}
export default function App() {
  const [items, setItems] = useState(initialBooks);
  const [trial, setTrial] = useState(0);
  function reset() { setItems(initialBooks); setTrial(t => t + 1); }
  return <main>
    <h1>Key experiment: {USE_INDEX_KEYS ? 'index' : 'book.id'}</h1>
    <p>Open the first book, then reverse. Which book stays open?</p>
    <button onClick={() => setItems(current => [...current].reverse())}>Reverse</button>
    <button onClick={reset}>Reset experiment</button>
    <section key={trial} aria-label="Books">
      {items.map((book, index) =>
        <BookCard key={USE_INDEX_KEYS ? index : book.id} book={book} />)}
    </section>
  </main>;
}
