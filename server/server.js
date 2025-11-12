require("dotenv").config();

const connectDB = require("./src/database/database");
const server = require("./src/app"); // this is the HTTP server created in app.js
const { closeSocketServer } = require("./src/socket/socket");
const mongoose = require("mongoose"); // if you use mongoose; otherwise remove

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(
        `Server is running on port ${PORT}, http://localhost:${PORT}`
      );
    });
    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      try {
        closeSocketServer();

        // Close HTTP server
        await new Promise((resolve) => server.close(resolve));

        // Close DB connection if applicable
        if (mongoose.connection?.readyState) {
          await mongoose.connection.close(true);
        }
        console.log("Shutdown complete.");
        process.exit(0);
      } catch (err) {
        console.error("Error during shutdown:", err);
        process.exit(1);
      }
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1);
  }
}

start();
