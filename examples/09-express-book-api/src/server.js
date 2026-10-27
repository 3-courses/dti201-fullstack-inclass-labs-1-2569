import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 3001);
createApp().listen(port, () => console.log(`Course Book API on http://localhost:${port}`));
