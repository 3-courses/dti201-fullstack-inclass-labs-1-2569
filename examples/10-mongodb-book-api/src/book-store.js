import { Book } from './models/Book.js';

// Send an explicit public shape, not Mongoose's internal fields.
export function toApiBook(document) {
  return {
    id: String(document._id),
    title: document.title,
    author: document.author,
    sourceType: document.sourceType,
    summary: document.summary
  };
}

export function createBookStore() {
  return {
    async list({ limit, offset }) {
      const documents = await Book.find().sort({ _id: 1 }).skip(offset).limit(limit);
      return documents.map(toApiBook);
    },
    async find(id) {
      const document = await Book.findById(id);
      return document ? toApiBook(document) : null;
    },
    async insert(command) {
      const titleKey = command.title.trim().toLocaleLowerCase();
      const document = await Book.create({ ...command, titleKey });
      return toApiBook(document);
    },
    async update(id, command) {
      const changes = { ...command };
      if (changes.title !== undefined) changes.titleKey = changes.title.trim().toLocaleLowerCase();
      const document = await Book.findByIdAndUpdate(id, { $set: changes }, { new: true, runValidators: true });
      return document ? toApiBook(document) : null;
    },
    async remove(id) {
      const document = await Book.findByIdAndDelete(id);
      return document !== null;
    }
  };
}
