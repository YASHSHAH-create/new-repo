const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    socket.on('chat message', (msg) => {
        console.log('Message received:', msg);
        io.emit('chat message', msg);
    });

    socket.on('offer', (offer) => {
        console.log('Offer received:', offer);
        socket.broadcast.emit('offer', offer);
    });

    socket.on('answer', (answer) => {
        console.log('Answer received:', answer);
        socket.broadcast.emit('answer', answer);
    });

    socket.on('ice-candidate', (candidate) => {
        console.log('ICE candidate received:', candidate);
        socket.broadcast.emit('ice-candidate', candidate);
    });

    socket.on('document-changes', (data) => {
        console.log('Document changes received from:', socket.id, 'Data:', data);
        socket.broadcast.emit('document-changes', data);
    });

    socket.on('file message', (data) => {
        console.log('File message received:', data);
        io.emit('file message', data);
    });

    socket.on('canvas-draw', (data) => {
        console.log('Canvas draw data received:', data);
        socket.broadcast.emit('canvas-draw', data);
    });

    socket.on('sheet-edit', (data) => {
        console.log('Sheet edit data received:', data);
        socket.broadcast.emit('sheet-edit', data);
    });

    socket.on('pptx-upload', (data) => {
        console.log('PPTX file uploaded:', data.fileName);
        fs.readFile(data.filePath, (err, fileData) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }
            io.emit('pptx-upload', { fileName: data.fileName, fileData: fileData });
        });
    });

    socket.on('sheet-upload', (data) => {
        console.log('Sheet file uploaded:', data.fileName);
        fs.readFile(data.fileData, (err, fileData) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }
            io.emit('sheet-upload', { fileName: data.fileName, fileData: fileData });
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
