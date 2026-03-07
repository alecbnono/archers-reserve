import "dotenv/config";
import app from "./app.js";
import pool, { connectDB } from "./db.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
      console.log(`Server running on http://localhost:${PORT}`);
    });

    const shutdown = async () => {
      console.log("Shutting down gracefully...");
      server.close(async () => {
        await pool.end();
        console.log("Server closed successfully.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (err) {
    console.error("Error starting the server in server.ts:", err);
    process.exit(1);
  }
}

export default startServer;
