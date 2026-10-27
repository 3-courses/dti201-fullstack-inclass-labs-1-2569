# Lab 09 starter: Express book API

Use with [Lab 09](../../labs/09-express-book-api.md) and the [v2 slides](../../slide/09-express-book-api/express-api-v2.pdf). This starter has a working health endpoint, request ID middleware, a small in-memory book store, and numbered TODOs in `src/app.js`. Routes for one book and creation intentionally return 501 until you implement them.

This folder is already included in the lab repository. From the repository root, enter it with `cd examples/09-express-book-api`; you do not need to create a new folder. It is a separate Express project from the earlier React/Vite app.

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
