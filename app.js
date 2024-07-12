const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server);

// Set up EJS view engine and static files
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle "send-location" event from client
  socket.on('send-location', (message) => {
    console.log('Location received from:', socket.id, message);
    // Broadcast location to all connected clients except sender
    io.emit('receive-location', { id: socket.id, ...message });
  });

  // Handle disconnection event
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Notify all clients about user disconnection
    io.emit('user-disconnected', socket.id);
  });
});

// Route for serving index.ejs file
app.get('/', (req, res) => {
  res.render('index');
});

// Start server
server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
