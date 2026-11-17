import mongoose from 'mongoose';
import { connectDatabase, reportDatabaseError } from '../src/db.js';
import { Book } from '../src/models/Book.js';

try {
  await connectDatabase();
  await mongoose.connection.db.admin().ping();
  console.log('Database ping: OK');
  console.log(`Books: ${await Book.countDocuments()}`);
  const sample = await Book.find().sort({ _id: 1 }).limit(3);
  for (const book of sample) console.log(JSON.stringify({ id: String(book._id), title: book.title }));
} catch (error) {
  reportDatabaseError(error);
} finally {
  await mongoose.disconnect();
}
