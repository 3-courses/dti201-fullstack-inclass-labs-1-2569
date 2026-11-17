import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApp } from '../src/app.js';
import { sampleData } from '../demo/data.js';
import { Drink } from '../demo/Drink.js';

test('validation rejects invalid requests before querying and hides internal errors', async () => {
  let calls = 0;
  const fail = async () => { calls++; throw new Error('mongodb://private-user:secret@private-host'); };
  const server = createApp({ store: { list: fail, find: fail, insert: fail, update: fail, remove: fail } }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  const send = (path, method, body) => fetch(base + path, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  try {
    for (const path of ['/api/books/1', '/api/books?limit=0', '/api/books?offset=-1', '/api/books?limit=2.5', '/api/books?offset=9007199254740992', '/api/books?limit=1&limit=2']) assert.equal((await fetch(base + path)).status, 422, path);
    const valid = { title: 'Sample Book', author: 'Mali', sourceType: 'book', summary: 'Own summary' };
    for (const body of [null, [], {}, { ...valid, _id: 'forced' }, { ...valid, titleKey: 'forced' }, { ...valid, title: { $ne: '' } }, { ...valid, author: '' }, { ...valid, sourceType: 'wrong' }]) assert.equal((await send('/api/books', 'POST', body)).status, 422);
    assert.equal((await send('/api/books/000000000000000000000001', 'PATCH', {})).status, 422);
    assert.equal(calls, 0);
    assert.equal((await fetch(base + '/api/books', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' })).status, 400);
    const response = await fetch(base + '/api/books');
    assert.equal(response.status, 500);
    assert.match(response.headers.get('content-type'), /application\/problem\+json/);
    const text = await response.text();
    assert.doesNotMatch(text, /private-user|secret|private-host/);
    assert.equal(JSON.parse(text).requestId, response.headers.get('x-request-id'));
    assert.equal(calls, 1);
  } finally { await new Promise(resolve => server.close(resolve)); }
});

test('small sample has valid references, valid drinks and the documented total', () => {
  const ids = name => new Set(sampleData[name].map(row => String(row._id)));
  for (const row of sampleData.drinks) assert.equal(new Drink(row).validateSync(), undefined);
  for (const book of sampleData.books) {
    assert.ok(ids('categories').has(String(book.categoryId)));
    for (const id of book.authorIds) assert.ok(ids('authors').has(String(id)));
  }
  for (const name of ['carts', 'orders']) for (const row of sampleData[name]) {
    assert.ok(ids('customers').has(String(row.customerId)));
    for (const item of row.items) {
      assert.ok(ids('books').has(String(item.bookId)));
      assert.ok(Number.isInteger(item.quantity) && item.quantity > 0);
    }
  }
  assert.equal(sampleData.orders[0].items.reduce((sum, item) => sum + item.quantity * item.unitPriceSatang, 0), 3200);
});
