import { pool } from "../config/db.js";

class ConversationService {
    async listAll() {
		const { rows } = await pool.query("SELECT * FROM ai.conversations");
		return rows;
	}

    async create(user_id, itinerary_id, session_id) {
        try {
            const { rows } = await pool.query(
                "INSERT INTO ai.conversations (user_id, itinerary_id, session_id) VALUES ($1, $2, $3) RETURNING *",
                [user_id, itinerary_id, session_id]
            );
            return rows[0];
        } catch (error) {
            if (error.code == '23503') {
                if (error.constraint === 'conversations_user_id_fkey') {
                    const err = new Error("User not found");
                    err.statusCode = 404;
                    throw err;
                }
                if (error.constraint === 'conversations_itinerary_id_fkey') {
                    const err = new Error("Itinerary not found");
                    err.statusCode = 404;
                    throw err;
                }
                const err = new Error("Invalid reference: related resource not found");
                err.statusCode = 400;
                throw err;
            }
            throw error;
        }
    }

    async delete(id) {
        try {
            await pool.query("DELETE FROM ai.conversations WHERE id = $1", [id]);
            return true;
        } catch (error) {
            console.error("Error deleting conversation:", error);
            throw new Error("Internal server error");
        }
    }
}

export default new ConversationService();