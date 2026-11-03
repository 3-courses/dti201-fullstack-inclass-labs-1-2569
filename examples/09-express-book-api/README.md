# Lab 09 starter: Express book API

Use with [Lab 09](../../labs/09-express-book-api.md) and the [v2 slides](../../slide/09-express-book-api/express-api-v2.pdf). This reference has a working health endpoint, request ID middleware, and numbered TODOs in `src/app.js`. Routes for one book and creation intentionally return 501 until you implement them.

`src/books.js` is the 200-book catalogue supplied for this class. `src/book-store.js` makes a separate in-memory copy for each run. The catalogue has IDs 1–200, so adding a book to the in-memory API must choose an ID after 200. The first GET page still contains 20 books; use `limit` and `offset` to see later pages.

For the classroom exercise, create your own backend folder from zero as [Lab 09](../../labs/09-express-book-api.md) instructs. You may copy the catalogue file as data after you have built the first two-book example. This reference project is for checking results and file structure.

```bash
npm ci
npm start
```

Open another terminal:

```bash
curl -i http://localhost:3001/health
curl -i http://localhost:3001/api/books
```

Use Node.js 20+. Data resets when the server restarts. Work in your own repository and do not commit `node_modules/` or secrets.
