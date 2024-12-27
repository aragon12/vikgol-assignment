import express, { json } from 'express';
import { requestLogger } from './middleware/requestLogger.js';
import { MockDB } from './db/mockdb.js';
import bookRoutes from './routes/books.js';
import { setupRedis } from './db/redis.js';
import dotenv from 'dotenv';

import { createServer } from 'http';
import { setupWebsocket } from './socket/socket.js';

dotenv.config();

const { PORT } = process.env;

global.db = {
    books: new MockDB('books')
};

const app = express();

app.use(json());
app.use(requestLogger);
app.use('/books', bookRoutes);
await setupRedis();

const server = createServer(app);
setupWebsocket(server);

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
