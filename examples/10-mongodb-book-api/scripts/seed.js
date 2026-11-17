import mongoose from 'mongoose';
import { Book } from '../src/models/Book.js';
import { books } from '../src/books.js';
import { connectDatabase, reportDatabaseError } from '../src/db.js';

try {
  await connectDatabase();
  await Book.init();
  for (const { title, author, sourceType, summary } of books) {
    const titleKey = title.trim().toLocaleLowerCase();
    await Book.updateOne({ titleKey }, { $setOnInsert: { title, author, sourceType, summary, titleKey } }, { upsert: true, runValidators: true });
  }
  console.log(`Seed complete. Books: ${await Book.countDocuments()}`);
} catch (error) {
  reportDatabaseError(error);
} finally {
  await mongoose.disconnect();
}
