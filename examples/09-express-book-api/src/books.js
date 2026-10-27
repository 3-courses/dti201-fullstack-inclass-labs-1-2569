export const seedBooks = [
  { id: 1, title: 'Web Basics', author: 'Nok', sourceType: 'book', summary: 'พื้นฐานเว็บสำหรับฝึกทำหน้าแรก' },
  { id: 2, title: 'React Practice', author: 'Lee', sourceType: 'course', summary: 'แบบฝึกคอมโพเนนต์และสถานะ' }
];

export function createBookStore() {
  const books = seedBooks.map(book => ({ ...book }));
  let nextId = 3;
  return {
    list: ({ limit, offset }) => books.slice(offset, offset + limit),
    find: id => books.find(book => book.id === id),
    insert: command => {
      const book = { id: nextId++, ...command };
      books.push(book);
      return book;
    },
    hasTitle: title => books.some(book => book.title.toLocaleLowerCase() === title.toLocaleLowerCase())
  };
}
