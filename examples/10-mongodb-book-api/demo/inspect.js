import mongoose from 'mongoose';

export async function showSample(db = mongoose.connection.db) {
  console.log('Database: course_books_demo (separate from course_books)');
  for (const name of ['drinks', 'customers', 'categories', 'authors', 'books', 'carts', 'orders']) {
    console.log(`${name}: ${await db.collection(name).countDocuments()}`);
  }
  const books = await db.collection('books').find().sort({ sku: 1 }).toArray();
  for (const book of books) {
    const category = await db.collection('categories').findOne({ _id: book.categoryId });
    const authors = await db.collection('authors').find({ _id: { $in: book.authorIds } }).toArray();
    console.log(JSON.stringify({ title: book.title, category: category.name, authors: authors.map(row => row.name), salePriceSatang: book.salePriceSatang }));
  }
  const order = await db.collection('orders').findOne();
  const totalSatang = order.items.reduce((total, item) => total + item.quantity * item.unitPriceSatang, 0);
  console.log(`Order total: ${totalSatang} satang = ${(totalSatang / 100).toFixed(2)} THB`);
}
