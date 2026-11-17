import mongoose from 'mongoose';
import { connectDatabase, reportDatabaseError } from '../src/db.js';
import { sampleData } from './data.js';
import { showSample } from './inspect.js';

try {
  // Explicit database override: never place this larger model in course_books.
  await connectDatabase({ dbName: 'course_books_demo' });
  const db = mongoose.connection.db;
  if (process.argv.includes('--seed')) {
    await db.collection('carts').createIndex({ customerId: 1 }, { unique: true });
    await db.collection('books').createIndex({ sku: 1 }, { unique: true });
    for (const [collection, rows] of Object.entries(sampleData)) {
      for (const row of rows) {
        await db.collection(collection).updateOne({ _id: row._id }, { $setOnInsert: row }, { upsert: true });
      }
    }
    console.log('Sample seed complete (existing records are preserved).');
  }
  await showSample(db);
} catch (error) {
  reportDatabaseError(error);
} finally {
  await mongoose.disconnect();
}
