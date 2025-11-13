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
            if (error.code === '23503') {
                switch (error.constraint) {
                    case 'conversations_user_id_fkey':
                        throw Object.assign(new Error('User not found'), { statusCode: 404 });
                    case 'conversations_itinerary_id_fkey':
                        throw Object.assign(new Error('Itinerary not found'), { statusCode: 404 });
                    default:
                        throw Object.assign(new Error('Invalid reference: related resource not found'), { statusCode: 400 });
                }
            }
            throw error;
        }
    }

    async delete(id) {
        const { rowCount } = await pool.query("DELETE FROM ai.conversations WHERE id = $1", [id]);
        if (rowCount === 0) {
            const error = new Error("Conversation not found");
            error.statusCode = 404;
            throw error;
        }
        return true;
    }
}

export default new ConversationService();