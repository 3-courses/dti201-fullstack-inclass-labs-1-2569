import { useState } from 'react';
function Counter() {
  const [count, setCount] = useState(0);
  function snapshotTwice() { setCount(count + 1); setCount(count + 1); }
  function updaterTwice() { setCount(c => c + 1); setCount(c => c + 1); }
  return <section>
    <h2>Count: {count}</h2>
    <button onClick={() => setCount(c => c + 1)}>+1</button>
    <button onClick={snapshotTwice}>Snapshot twice</button>
    <button onClick={updaterTwice}>Updater twice</button>
    <button onClick={() => setCount(0)}>Reset</button>
  </section>;
}
export default function App() {
  return <main><h1>Independent counters</h1><Counter /><Counter /></main>;
}
