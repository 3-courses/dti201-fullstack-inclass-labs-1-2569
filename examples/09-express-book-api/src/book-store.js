import { books } from './books.js';

export const seedBooks = books;

export function createBookStore() {
  const rows = books.map(book => ({ ...book }));
  let nextId = Math.max(0, ...rows.map(book => book.id)) + 1;
  return {
    list: ({ limit, offset }) => rows.slice(offset, offset + limit),
    find: id => rows.find(book => book.id === id),
    insert: command => {
      const book = { id: nextId++, ...command };
      rows.push(book);
      return book;
    },
    hasTitle: title => rows.some(book => book.title.trim().toLocaleLowerCase() === title.trim().toLocaleLowerCase())
  };
}
