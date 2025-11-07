const { Server } = require("socket.io");

let io = null;

// Simple validation helper
const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;

/**
 * Initialize Socket.IO on an existing HTTP(S) server.
 * Returns the singleton io instance.
 */
function initSocketServer(httpServer, options = {}) {
  // Avoid multiple init if called twice
  if (io) return io;

  // Sensible defaults; when serving client from same origin, CORS is typically not needed.
  const {
    cors = {
      origin: ["http://localhost:3000"], // In production, replace with your real frontend origin(s)
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  } = options;

  io = new Server(httpServer, { cors });

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);
    // handle handshake query parameters if needed
    const auth = socket.handshake.auth || {};
    const userId = auth.userId;
    const guestId = auth.guestId;

    if (userId) {
      socket.join(String(userId));
      console.log("joined rooms:", [...socket.rooms]); // helps debug
    }
    if (guestId) {
      socket.join(String(guestId));
      console.log("joined rooms:", [...socket.rooms]);
    }
    // Join a room
    socket.on("joinRoom", (room, ack) => {
      if (!isNonEmptyString(room)) {
        ack?.({ ok: false, error: "Invalid room" });
        return;
      }
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
      ack?.({ ok: true });
    });

    // Leave a room
    socket.on("leaveRoom", (room, ack) => {
      if (!isNonEmptyString(room)) {
        ack?.({ ok: false, error: "Invalid room" });
        return;
      }
      socket.leave(room);
      console.log(`Socket ${socket.id} left room ${room}`);
      ack?.({ ok: true });
    });

    // Send a message to a room
    socket.on("sendMessage", ({ room, message }, ack) => {
      if (!isNonEmptyString(room)) {
        ack?.({ ok: false, error: "Invalid room" });
        return socket.emit("server_error", { message: "Invalid room" });
      }
      if (
        typeof message !== "string" ||
        message.trim().length === 0 ||
        message.length > 2000
      ) {
        ack?.({ ok: false, error: "Invalid message" });
        return socket.emit("server_error", { message: "Invalid message" });
      }

      // Include the sender; if you want to exclude the sender, use socket.to(room).emit(...)
      io.to(room).emit("receiveMessage", {
        message,
        from: socket.id,
        ts: Date.now(),
      });
      console.log(`Message sent to room ${room}: ${message}`);
      ack?.({ ok: true });
    });

    socket.on("disconnect", (reason) => {
      console.log("Client disconnected", socket.id, "reason:", reason);
    });

    // Handle errors without throwing (avoid crashing the process)
    socket.on("error", (err) => {
      console.error("Socket error:", err);
      socket.emit("server_error", {
        message: "An error occurred on the server.",
      });
    });
  });

  return io;
}

/**
 * Get the initialized io instance or throw if not initialized.
 */
function getIOInstance() {
  if (!io) {
    throw new Error("Socket.io not initialized. Call initSocketServer first.");
  }
  return io;
}

/**
 * Gracefully close the Socket.IO server.
 */
function closeSocketServer() {
  if (io) {
    io.close();
    io = null;
  }
}

module.exports = { initSocketServer, getIOInstance, closeSocketServer };
