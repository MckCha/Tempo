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
            console.error("Error creating message:", error);
            throw new Error("Internal server error");
        }
    }

    async delete(id) {
        try {
            await pool.query("DELETE FROM ai.messages WHERE id = $1", [id]);
            return true;
        } catch (error) {
            console.error("Error deleting message:", error);
            throw new Error("Internal server error");
        }
    }
}

export default new MessageService();