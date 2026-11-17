import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import { mkdtemp, cp, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { Book } from '../src/models/Book.js';

function run(script, env, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script], { cwd, env: { ...process.env, ...env } });
    let output = '';
    child.stdout.on('data', chunk => { output += chunk; });
    child.stderr.on('data', chunk => { output += chunk; });
    child.on('error', reject);
    child.on('exit', code => resolve({ code, output }));
  });
}

test('fresh database: portable seed, idempotence, index, restart and complete CRUD API', { timeout: 60000 }, async () => {
  const base = process.env.LAB10_TEST_URI ?? 'mongodb://127.0.0.1:27018';
  // Override the database in the child URI too; never seed/drop the user's database.
  const dbName = `course_books_lab10_test_${randomUUID().replaceAll('-', '')}`;
  const uri = new URL(base);
  uri.pathname = `/${dbName}`;
  const env = { MONGODB_URI: uri.toString() };
  await mongoose.connect(env.MONGODB_URI, { dbName, serverSelectionTimeoutMS: 5000 });
  const standalone = await mkdtemp(join(tmpdir(), 'lab10-standalone-'));
  try {
    for (const entry of ['src', 'scripts', 'package.json']) {
      await cp(entry, join(standalone, entry), { recursive: true });
    }
    await symlink(resolve('node_modules'), join(standalone, 'node_modules'), 'dir');
    await Book.init();
    for (let index = 0; index < 2; index++) {
      const result = await run('scripts/seed.js', env, standalone);
      assert.equal(result.code, 0, result.output);
      assert.match(result.output, /Books: 200/);
      if (index === 0) {
        await Book.updateOne({ titleKey: 'pride and prejudice' }, { $set: { summary: 'Student summary must survive reseeding' } });
      } else {
        assert.equal((await Book.findOne({ titleKey: 'pride and prejudice' })).summary, 'Student summary must survive reseeding');
      }
    }
    const first = await Book.findOne();
    await assert.rejects(Book.create({ title: first.title, titleKey: first.titleKey, author: first.author, sourceType: first.sourceType, summary: first.summary }), error => error.code === 11000);
    const id = String(first._id);
    await mongoose.disconnect();
    await mongoose.connect(env.MONGODB_URI, { dbName });
    assert.equal(String((await Book.findById(id))._id), id);
    const check = await run('scripts/check-db.js', env);
    assert.equal(check.code, 0, check.output);
    assert.match(check.output, /Database ping: OK/);
    assert.match(check.output, /Books: 200/);

    const socket = createServer();
    socket.listen(0, '127.0.0.1');
    await once(socket, 'listening');
    const port = socket.address().port;
    await new Promise(resolve => socket.close(resolve));
    let child = spawn(process.execPath, ['src/server.js'], { env: { ...process.env, ...env, PORT: String(port) } });
    let output = '';
    child.stdout.on('data', chunk => { output += chunk; });
    child.stderr.on('data', chunk => { output += chunk; });
    let closed = once(child, 'close');
    try {
      const started = Date.now();
      while (!output.includes('API listening')) {
        assert.equal(child.exitCode, null, output);
        assert.ok(Date.now() - started < 10000, output);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      const url = `http://127.0.0.1:${port}`;
      assert.equal((await fetch(`${url}/health`)).status, 200);
      const listResponse = await fetch(`${url}/api/books?limit=2&offset=0`);
      assert.equal(listResponse.status, 200);
      const list = await listResponse.json();
      assert.equal(list.data.length, 2);
      assert.equal(typeof list.data[0].id, 'string');
      assert.equal('titleKey' in list.data[0], false);
      const command = { title: 'Persistence Sample', author: 'Mali', sourceType: 'book', summary: 'Created through real HTTP' };
      const send = (path, method, body) => fetch(url + path, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const created = await send('/api/books', 'POST', command);
      assert.equal(created.status, 201);
      const location = created.headers.get('location');
      const data = (await created.json()).data;
      assert.equal(location, `/api/books/${data.id}`);
      assert.ok(await Book.findById(data.id));
      assert.equal((await send('/api/books', 'POST', { ...command, title: ' persistence sample ' })).status, 409);
      assert.equal((await send(location, 'PATCH', { title: first.title })).status, 409);
      assert.equal((await send(location, 'PATCH', { summary: 'Updated through PATCH' })).status, 200);
      child.kill('SIGTERM');
      await closed;
      output = '';
      child = spawn(process.execPath, ['src/server.js'], { env: { ...process.env, ...env, PORT: String(port) } });
      closed = once(child, 'close');
      child.stdout.on('data', chunk => { output += chunk; });
      child.stderr.on('data', chunk => { output += chunk; });
      const restarted = Date.now();
      while (!output.includes('API listening')) {
        assert.equal(child.exitCode, null, output);
        assert.ok(Date.now() - restarted < 10000, output);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      const persisted = await fetch(url + location);
      assert.equal(persisted.status, 200);
      assert.equal((await persisted.json()).data.summary, 'Updated through PATCH');
      assert.equal((await send(location, 'DELETE')).status, 204);
      assert.equal((await fetch(url + location)).status, 404);
      assert.equal((await send(location, 'PATCH', { summary: 'Absent' })).status, 404);
      assert.equal((await send(location, 'DELETE')).status, 404);
    } finally {
      child.kill('SIGTERM');
      await closed;
    }
  } finally {
    if (mongoose.connection.readyState === 1 && mongoose.connection.name === dbName) {
      await mongoose.connection.dropDatabase();
    }
    await mongoose.disconnect();
    await rm(standalone, { recursive: true, force: true });
  }
});

test('missing/placeholder/unreachable URI fails without leaking credentials or listening', { timeout: 20000 }, async () => {
  for (const uri of ['', 'mongodb+srv://DB_USER:ENCODED_PASSWORD@YOUR_HOST/course_books', 'mongodb://private_user:private_password@127.0.0.1:1/course_books']) {
    const result = await run('src/server.js', { MONGODB_URI: uri });
    assert.notEqual(result.code, 0);
    assert.doesNotMatch(result.output, /private_user|private_password|API listening/);
  }
});
