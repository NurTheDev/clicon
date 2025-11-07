const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

// If your socket module exports named functions:
const { initSocketServer } = require("./socket/socket");

// If your error handler is at ./utils/globalError (relative to project root)
const globalError = require("./utils/globalError");

// Build the Express app
const app = express();

// Core middleware
app.use(cors({ origin: true, credentials: true })); // In production, configure allowed origins
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Simple root route
app.get("/", (req, res) => {
  res.send("Hello from server");
  console.log("Hello from server");
});

// Routes (ensure API_VERSION is set, e.g. /api/v1)
const apiBase = process.env.API_VERSION || "/api/v1";
app.use(apiBase, require("./routes/index"));

// Error handler (must be last app.use)
app.use(globalError);

// Create the HTTP server and attach Socket.IO
const server = http.createServer(app);
initSocketServer(server); // returns io, but storing it here is optional

// Export the HTTP server (entry file will .listen on it)
module.exports = server;
