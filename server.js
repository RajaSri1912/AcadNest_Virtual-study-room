const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the 'public' directory
app.use(express.static('public'));

const peers = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('register', (peerId) => {
    peers[peerId] = socket;
    socket.peerId = peerId;
    console.log(`Peer registered: ${peerId}`);
  });

  socket.on('offer', ({ to, offer }) => {
    if (peers[to]) {
      peers[to].emit('offer', { from: socket.peerId, offer });
    }
  });

  socket.on('answer', ({ to, answer }) => {
    if (peers[to]) {
      peers[to].emit('answer', { from: socket.peerId, answer });
    }
  });

  socket.on('ice-candidate', ({ to, candidate }) => {
    if (peers[to]) {
      peers[to].emit('ice-candidate', { from: socket.peerId, candidate });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Peer disconnected: ${socket.peerId}`);
    delete peers[socket.peerId];
  });
});

server.listen(3007, () => {
  console.log('Signaling server is running on http://localhost:3007');
});
