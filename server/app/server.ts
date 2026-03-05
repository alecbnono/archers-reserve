import app from "./app.js";
import pool, { connectDB } from "./db.js";


const PORT = process.env.POSTGRESQL_PORT || 3000;

async function startServer() {
    try {
        await connectDB();


        const server = app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
            console.log(`Server running on http://localhost:${PORT}`);
        });

        server.close(async () => {
            await pool.end();
            console.log("Server closed successfully.");
        });
    } catch (err) {
        console.error("Error starting the server in server.ts:", err);
        process.exit(1);
    }
};
    
export default startServer;
