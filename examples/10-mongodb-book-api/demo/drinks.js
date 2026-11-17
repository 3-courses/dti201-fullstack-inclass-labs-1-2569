import mongoose from 'mongoose';
import { connectDatabase, reportDatabaseError } from '../src/db.js';
import { Drink } from './Drink.js';

try {
  await connectDatabase({ dbName: 'course_books_demo' });
  const documents = await Drink.find({ available: true }).sort({ name: 1 });
  const data = documents.map(document => ({
    id: String(document._id), name: document.name,
    priceSatang: document.priceSatang, available: document.available
  }));
  console.log(JSON.stringify({ data }, null, 2));
} catch (error) {
  reportDatabaseError(error);
} finally {
  await mongoose.disconnect();
}
