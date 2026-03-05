import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.POSTGRESQL_PORT ? parseInt(process.env.POSTGRESQL_PORT, 10) : undefined, 
    max: 20,
    idleTimeoutMillis: 2000,
});

export async function connectDB() {
    try {
        const client = await pool.connect();
        console.log("Connected to the database successfully.");
        client.release();
    } catch (err){
        console.error("Error connecting to the database in db.ts:", err);
        process.exit(1);
    }
}

export default pool;