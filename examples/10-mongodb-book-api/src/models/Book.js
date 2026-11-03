import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 3 },
  author: { type: String, required: true, trim: true },
  sourceType: { type: String, required: true, enum: ['book', 'documentation', 'course'] },
  summary: { type: String, required: true, trim: true },
  titleKey: { type: String, required: true }
}, { timestamps: true, bufferCommands: false });
bookSchema.index({ titleKey: 1 }, { unique: true });
export const Book = mongoose.model('Book', bookSchema);
