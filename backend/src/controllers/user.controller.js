import { pool } from "../config/db.js";

export const getUsers = async (req, res) => {

    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ dbTime: result.rows[0].now });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        result.release();
    }
};