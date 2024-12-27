import { WebSocket, WebSocketServer } from "ws";

let clients = [];
let wss;

export const setupWebsocket = (server) => {
  wss = new WebSocketServer({ server });
  wss.on('connection', (ws) => {
    clients.push(ws);
    console.log('New WebSocket client connected');

    ws.on('close', () => {
      const index = clients.indexOf(ws);
      if (index !== -1) {
        clients.splice(index, 1);
      }
      console.log('WebSocket client left');
    });
  });
}

export const broadcast = (data) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}