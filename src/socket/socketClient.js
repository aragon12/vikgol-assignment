import WebSocket from 'ws';
const { PORT } = process.env;

const socket = new WebSocket(`ws://localhost:${PORT}`);

socket.on('open', () => {
  console.log('WebSocket connection established');
});

socket.on('message', (data) => {
  const newBook = JSON.parse(data);
  console.log('New book added:', newBook);
});

socket.on('error', (error) => {
  console.error('WebSocket Error:', error);
});

socket.on('close', () => {
  console.log('WebSocket connection closed');
});
