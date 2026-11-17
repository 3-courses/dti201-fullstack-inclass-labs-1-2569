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

test('fresh database: portable seed, idempotence, index, restart and starter API', { timeout: 60000 }, async () => {
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
    const child = spawn(process.execPath, ['src/server.js'], { env: { ...process.env, ...env, PORT: String(port) } });
    let output = '';
    child.stdout.on('data', chunk => { output += chunk; });
    child.stderr.on('data', chunk => { output += chunk; });
    const closed = once(child, 'close');
    try {
      const started = Date.now();
      while (!output.includes('API listening')) {
        assert.equal(child.exitCode, null, output);
        assert.ok(Date.now() - started < 10000, output);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      const url = `http://127.0.0.1:${port}`;
      assert.equal((await fetch(`${url}/health`)).status, 200);
      assert.equal((await fetch(`${url}/api/books`)).status, 501);
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
