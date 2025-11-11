import { pool } from "../config/db.js";

class MessageService {
    async listAll() {
        const { rows } = await pool.query("SELECT * FROM ai.messages");
        return rows;
    }

    async create(conversation_id, role, tokens, content) {
        try {
            const { rows } = await pool.query(
                "INSERT INTO ai.messages (conversation_id, role, tokens, content) VALUES ($1, $2, $3, $4) RETURNING *",
                [conversation_id, role, tokens, content]
            );
            return rows[0];
        } catch (error) {
            if (error.code == '23503') {
                throw new Error("Conversation not found");
            }
            throw error;
        }
    }

    async delete(id) {
        const { rowCount } = await pool.query("DELETE FROM ai.messages WHERE id = $1", [id]);
        if (rowCount === 0) {
            const error = new Error("Message not found");
            error.statusCode = 404;
            throw error;
        }
        return true;
    }
}

export default new MessageService();