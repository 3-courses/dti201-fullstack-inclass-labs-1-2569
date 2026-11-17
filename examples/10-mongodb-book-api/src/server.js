import mongoose from 'mongoose';
import { Book } from './models/Book.js';
import { connectDatabase, reportDatabaseError } from './db.js';
import { createApp } from './app.js';

try {
  await connectDatabase();
  await Book.init();
  const app = createApp();
  app.listen(Number(process.env.PORT ?? 3001), '127.0.0.1', () => {
    console.log('API listening on port ' + (process.env.PORT ?? 3001));
  });
} catch (error) {
  reportDatabaseError(error);
  await mongoose.disconnect();
}
