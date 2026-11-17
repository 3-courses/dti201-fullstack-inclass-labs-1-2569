import express from 'express';
import { randomUUID } from 'node:crypto';
import { createBookStore } from './book-store.js';

const fields = ['title', 'author', 'sourceType', 'summary'];
const sourceTypes = ['book', 'documentation', 'course'];

function problem(res, status, title) {
  return res.status(status).type('application/problem+json').json({
    type: 'about:blank', title, status, requestId: res.locals.requestId
  });
}

// Only return allowed, normalized strings. Never pass req.body to MongoDB.
function readCommand(body, partial = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const keys = Object.keys(body);
  if (!keys.length || keys.some(key => !fields.includes(key))) return null;
  if (!partial && fields.some(key => !keys.includes(key))) return null;
  const command = {};
  for (const key of keys) {
    if (typeof body[key] !== 'string' || !body[key].trim()) return null;
    command[key] = body[key].trim();
  }
  if (command.title !== undefined && command.title.length < 3) return null;
  if (command.sourceType !== undefined && !sourceTypes.includes(command.sourceType)) return null;
  return command;
}

export function createApp({ store = createBookStore() } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.locals.requestId = randomUUID();
    res.set('X-Request-Id', res.locals.requestId);
    next();
  });
  app.use(express.json({ limit: '100kb', strict: false }));
  app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'course-book-api' }));

  app.get('/api/books', async (req, res) => {
    const { limit = '20', offset = '0' } = req.query;
    if (typeof limit !== 'string' || typeof offset !== 'string' || !/^\d+$/.test(limit) || !/^\d+$/.test(offset)) {
      return problem(res, 422, 'limit and offset must be integers');
    }
    const take = Number(limit);
    const skip = Number(offset);
    if (!Number.isSafeInteger(take) || take < 1 || take > 100 || !Number.isSafeInteger(skip)) {
      return problem(res, 422, 'limit must be 1..100 and offset must be >= 0');
    }
    const data = await store.list({ limit: take, offset: skip });
    res.json({ data, pagination: { limit: take, offset: skip } });
  });

  app.post('/api/books', async (req, res) => {
    const command = readCommand(req.body);
    if (!command) return problem(res, 422, 'Use title, author, sourceType and summary with valid string values');
    const book = await store.insert(command);
    res.status(201).location(`/api/books/${book.id}`).json({ data: book });
  });

  // This runs before any route that uses :id, including PATCH and DELETE.
  app.param('id', (_req, res, next, id) => {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) return problem(res, 422, 'id must be 24 hexadecimal characters');
    next();
  });

  app.get('/api/books/:id', async (req, res) => {
    const book = await store.find(req.params.id);
    if (!book) return problem(res, 404, 'Book not found');
    res.json({ data: book });
  });

  app.patch('/api/books/:id', async (req, res) => {
    const command = readCommand(req.body, true);
    if (!command) return problem(res, 422, 'Send at least one allowed book field with a valid string value');
    const book = await store.update(req.params.id, command);
    if (!book) return problem(res, 404, 'Book not found');
    res.json({ data: book });
  });

  app.delete('/api/books/:id', async (req, res) => {
    if (!await store.remove(req.params.id)) return problem(res, 404, 'Book not found');
    res.status(204).end();
  });

  app.use((_req, res) => problem(res, 404, 'Endpoint not found'));
  app.use((error, _req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.type === 'entity.parse.failed') return problem(res, 400, 'Invalid JSON');
    if (error.type === 'entity.too.large') return problem(res, 413, 'Request body too large');
    if (error.code === 11000) return problem(res, 409, 'Book title already exists');
    if (error.name === 'ValidationError') return problem(res, 422, 'Invalid book fields');
    // Driver errors may include credentials or hostnames; return a safe message.
    return problem(res, 500, 'Internal server error');
  });
  return app;
}
