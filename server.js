const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });  // Allow all origins for local/test

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Handle ESP32 connections
io.on('connection', (socket) => {
  console.log('ESP32 connected:', socket.id);
  socket.on('disconnect', () => console.log('ESP32 disconnected'));
});

// Receive data from ESP32 and broadcast to all clients (browsers)
io.on('connection', (socket) => {
  socket.on('sensorData', (data) => {
    io.emit('liveData', data);  // Push to all connected browsers
    console.log('Live data received:', data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});