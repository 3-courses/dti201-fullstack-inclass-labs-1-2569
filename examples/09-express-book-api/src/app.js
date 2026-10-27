import express from 'express';
import { randomUUID } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { createBookStore } from './books.js';

export function createApp({ store = createBookStore(), logger = console } = {}) {
  const app = express();
  app.disable('x-powered-by');

  app.use((req, res, next) => {
    req.requestId = randomUUID();
    const started = performance.now();
    res.set('X-Request-Id', req.requestId);
    res.on('finish', () => logger.info(JSON.stringify({
      requestId: req.requestId, method: req.method, path: req.path,
      status: res.statusCode, durationMs: Math.round(performance.now() - started)
    })));
    next();
  });
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'course-book-api' }));

  app.get('/api/books', (req, res) => {
    // Activity 2: validate limit (1..100) and offset (>=0) before using store.list.
    const limit = 20;
    const offset = 0;
    res.json({ data: store.list({ limit, offset }), pagination: { limit, offset } });
  });

  app.get('/api/books/:id', (req, res) => {
    // Activity 3: parse a positive safe integer, return 422 for invalid ID,
    // 404 for a valid ID not in the store, and 200 with { data: book } otherwise.
    res.status(501).json({ title: 'Complete Activity 3' });
  });

  app.post('/api/books', (req, res) => {
    // Activity 4: allow only title, author, sourceType, summary;
    // return 422 for invalid fields, 409 for duplicate title, 201 for creation.
    res.status(501).json({ title: 'Complete Activity 4' });
  });

  app.use((req, res) => res.status(404).type('application/problem+json').json({
    type: 'about:blank', title: 'Endpoint not found', status: 404,
    requestId: req.requestId
  }));

  app.use((error, req, res, next) => {
    // Activity 5: distinguish invalid JSON and unexpected exceptions.
    // Keep internal error details out of the response. Do not log the request body.
    if (res.headersSent) return next(error);
    logger.error(JSON.stringify({ requestId: req.requestId, message: error.message }));
    res.status(500).type('application/problem+json').json({
      type: 'about:blank', title: 'Internal server error', status: 500,
      requestId: req.requestId
    });
  });
  return app;
}
