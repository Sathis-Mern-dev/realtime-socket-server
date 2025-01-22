import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { handleWebSocketConnection } from './controller/socket.controller.js';

const app = express();
const PORT = 3001;

// Start WebSocket server
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => handleWebSocketConnection(ws, wss));

// Express server
app.use(cors(), express.json());
app.use('/', (req, res) => res.send(`Socket server running in port 8080`));


app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
