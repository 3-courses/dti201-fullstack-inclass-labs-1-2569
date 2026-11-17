import express from 'express';
import mongoose from 'mongoose';
import { Book } from './models/Book.js';
import { connectDatabase, reportDatabaseError } from './db.js';

try {
  await connectDatabase();
  await Book.init();
  const app = express();
  app.use(express.json({ limit: '100kb' }));
  app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'course-book-api' }));
  // LAB10-ROUTES: replace the fallback below with YOUR completed Lab 09 routes.
  // Import createBookStore from ./book-store.js; make handlers async and await calls.
  // LAB10-ID: replace numeric ID validation with 24 hexadecimal characters.
  // LAB10-ERRORS: retain request IDs/problem JSON; map duplicate code 11000 to 409.
  app.use('/api/books', (_req, res) => res.status(501).json({ title: 'Complete LAB10-ROUTES in src/server.js; see Lab 10 step 5' }));
  app.listen(Number(process.env.PORT ?? 3001), () => console.log('API listening on port ' + (process.env.PORT ?? 3001)));
} catch (error) {
  reportDatabaseError(error);
  await mongoose.disconnect();
}
