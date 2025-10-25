import { io } from "socket.io-client";
//  * Initialize the Socket.IO client and connect to the server
//  * @param {string} url - The server URL
//  * @returns {Socket} - The connected socket instance
//  */

const socket = io("http://localhost:3000", {
    transports: ["websocket"],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 2000,
    autoConnect: true,
    auth: { userId: "aYlan_nqSk28d_gYAAAD" } // use auth, not query
});

socket.on("connect", () => {
    console.log("Connected to server with ID:", socket.id);
});

socket.on("addToCart", (data) => {
    console.log("Item added to cart:", data);
})
socket.on("disconnect", (reason) => {
    console.log("Disconnected from server:", reason);
});

socket.on("connect_error", (error) => {
    console.error("Connection error:", "can't reach server or server is down", error);
});

socket.on("receiveMessage", (message) => {
    console.log("New message received:", message);
});

const joinRoom = (room) => {
    socket.emit("joinRoom", room);
};

const leaveRoom = (room) => {
    socket.emit("leaveRoom", room);
};

const sendMessage = (room, message) => {
    socket.emit("sendMessage", { room, message });
};

export { socket, joinRoom, leaveRoom, sendMessage };