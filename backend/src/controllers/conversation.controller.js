import { pool } from "../config/db.js";

export const getConversations = (req, res) => {
    pool.query('SELECT * FROM ai.conversations')
        .then(result => {
            res.json({ conversations: result.rows });
        })
        .catch(error => {
            console.error("Error fetching conversations:", error);
            res.status(500).json({ error: "Internal server error" });
        });
};

export const createConversation = async (req, res) => {
    const { user_id, itinerary_id, session_id } = req.body;

    if (!user_id || !itinerary_id || !session_id) {
        return res.status(400).json({ error: "user_id, itinerary_id, and session_id are required" });
    }

    try {
        await pool.query(
            'INSERT INTO ai.conversations (user_id, itinerary_id, session_id) VALUES ($1, $2, $3)',
            [user_id, itinerary_id, session_id]
        );
        res.status(201).json({ message: "Conversation created successfully" });
    } catch (error) {
        console.error("Error creating conversation:", error);
        res.status(500).json({ error: "Internal server error" });
    }

};

export const deleteConversation = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    try {
        await pool.query('DELETE FROM ai.conversations WHERE id = $1', [id]);
        res.json({ message: "Conversation deleted successfully" });
    } catch (error) {
        console.error("Error deleting conversation:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};