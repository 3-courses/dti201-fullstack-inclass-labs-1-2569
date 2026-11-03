import express from 'express';
import mongoose from 'mongoose';
import { Book } from './models/Book.js';

if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI in .env');
await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
await Book.init();
const app = express();
app.use(express.json());
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'course-book-api' }));
// Lab 10: add your GET and POST routes from Lab 09 here, then connect the Book model.
app.use('/api/books', (_req, res) => res.status(501).json({ title: 'Complete Lab 10 routes' }));
app.listen(Number(process.env.PORT ?? 3001), () => console.log('API listening on port ' + (process.env.PORT ?? 3001)));
