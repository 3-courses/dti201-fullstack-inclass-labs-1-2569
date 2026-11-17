// LAB10-STORE: implement one function at a time using ./models/Book.js.
// Keep these signatures so your Lab 09 routes can use the same interface.
function unfinished(step) {
  const error = new Error(step);
  error.status = 501;
  throw error;
}

export function createBookStore() {
  return {
    // LAB10-LIST: await query, sort by _id, skip offset, limit, map to API JSON.
    list: async ({ limit, offset }) => unfinished('LAB10-LIST'),
    // LAB10-FIND: route must validate ObjectId first; return null if absent.
    find: async id => unfinished('LAB10-FIND'),
    // LAB10-INSERT: derive titleKey on server; create only allowed fields.
    insert: async command => unfinished('LAB10-INSERT')
  };
}
