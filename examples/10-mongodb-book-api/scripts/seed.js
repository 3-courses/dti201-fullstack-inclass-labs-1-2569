import mongoose from 'mongoose';
import { Book } from '../src/models/Book.js';
import { books } from '../../09-express-book-api/src/books.js';

if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI in .env');
try {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  await Book.init();
  for (const { title, author, sourceType, summary } of books) {
    const titleKey = title.trim().toLocaleLowerCase();
    await Book.updateOne({ titleKey }, { $setOnInsert: { title, author, sourceType, summary, titleKey } }, { upsert: true, runValidators: true });
  }
  console.log(`Seed complete. Books: ${await Book.countDocuments()}`);
} finally {
  await mongoose.disconnect();
}
