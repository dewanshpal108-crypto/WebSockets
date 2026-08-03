import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';

const server = http.createServer(app);
const io = new Server(server,{
    cors : {
        origin: "http://localhost:5173",
        credentials: true
    }
})

io.on("connection", (socket) => {
    console.log(`User Connected : ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`User Disconnected : ${socket.id}`);
    });
});

export default server;
