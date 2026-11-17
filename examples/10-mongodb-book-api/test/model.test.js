import test from 'node:test';
import assert from 'node:assert/strict';
import { Book } from '../src/models/Book.js';

const valid = { title: 'Database Practice', author: 'Mali', sourceType: 'course', summary: 'My own summary', titleKey: 'database practice' };
test('Book enforces required fields, title length and allowed source types', () => {
  assert.equal(new Book(valid).validateSync(), undefined);
  for (const field of Object.keys(valid)) {
    const value = { ...valid };
    delete value[field];
    assert.ok(new Book(value).validateSync()?.errors[field], field);
  }
  assert.ok(new Book({ ...valid, title: 'ab' }).validateSync()?.errors.title);
  assert.ok(new Book({ ...valid, sourceType: 'unknown' }).validateSync()?.errors.sourceType);
});
