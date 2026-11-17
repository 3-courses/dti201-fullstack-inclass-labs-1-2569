import mongoose from 'mongoose';
import { connectDatabase, reportDatabaseError } from '../src/db.js';

try {
  await connectDatabase();
  const database = mongoose.connection.db;
  await database.admin().ping();
  console.log('Database ping: OK');
  const books = database.collection('books');
  console.log(`Books: ${await books.countDocuments()}`);
  const sample = await books.find().sort({ _id: 1 }).limit(3).toArray();
  for (const book of sample) console.log(JSON.stringify({ id: String(book._id), title: book.title }));
} catch (error) {
  reportDatabaseError(error);
} finally {
  await mongoose.disconnect();
}
