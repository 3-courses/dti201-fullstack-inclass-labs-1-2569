import { Types } from 'mongoose';
const id = value => new Types.ObjectId(value.padStart(24, '0'));

// Fictional, fixed teaching records. No real accounts or passwords.
export const sampleData = {
  drinks: [
    { _id: id('d1'), name: 'Iced Cocoa', priceSatang: 4500, available: true },
    { _id: id('d2'), name: 'Lemon Tea', priceSatang: 3500, available: true }
  ],
  customers: [{ _id: id('c1'), fullName: 'Mali Demo', email: 'mali@example.invalid' }],
  categories: [{ _id: id('ca1'), name: 'Computing' }],
  authors: [
    { _id: id('a1'), name: 'Nida Demo' },
    { _id: id('a2'), name: 'Arun Demo' }
  ],
  books: [
    { _id: id('b1'), sku: 'DEMO-001', title: 'Web Basics', categoryId: id('ca1'), authorIds: [id('a1'), id('a2')], listPriceSatang: 2000, salePriceSatang: 1800, stockQty: 8 },
    { _id: id('b2'), sku: 'DEMO-002', title: 'Database Basics', categoryId: id('ca1'), authorIds: [id('a1')], listPriceSatang: 2500, salePriceSatang: 2500, stockQty: 5 }
  ],
  carts: [{ _id: id('cc1'), customerId: id('c1'), items: [{ bookId: id('b2'), quantity: 1 }] }],
  orders: [{ _id: id('e1'), customerId: id('c1'), status: 'confirmed', currency: 'THB', orderedAt: new Date('2026-11-17T09:00:00Z'), items: [{ bookId: id('b1'), titleAtPurchase: 'Web Basics', quantity: 2, unitPriceSatang: 1600 }] }]
};
