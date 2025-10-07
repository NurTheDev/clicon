let io = null
const { Server } = require("socket.io")
const customError = require("../utils/customError");
/**
 * Initialize Socket.io server
 * @param {http.Server} httpServer - The HTTP server instance
 */
const initSocketServer = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"]
        }
    });

    io.on("connection", (socket) => {
        console.log("New client connected", socket.id);

        socket.on("joinRoom", (room) => {
            socket.join(room);
            console.log(`Socket ${socket.id} joined room ${room}`);
        });

        socket.on("leaveRoom", (room) => {
            socket.leave(room);
            console.log(`Socket ${socket.id} left room ${room}`);
        });

        socket.on("sendMessage", ({ room, message }) => {
            io.to(room).emit("receiveMessage", message);
            console.log(`Message sent to room ${room}: ${message}`);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected", socket.id);
        });
        socket.on("error", (err) => {
            console.error("Socket error:", err);
            socket.emit("error", { message: "An error occurred on the server." });
            throw new customError("Socket error occurred", 500);
        })
    });
};

const getIOInstance = () => {
    if (!io) {
        throw new customError("Socket.io not initialized. Call initSocketServer first.");
    }
    return io;
}
module.exports = { initSocketServer, getIOInstance };
