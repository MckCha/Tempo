
export const getConversations = (req, res) => {
    res.json({ message: "Get conversations - to be implemented" });
};

export const createConversation = (req, res) => {
    res.json({ message: "Create conversation - to be implemented" });
};

export const deleteConversation = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    try {
        await pool.query('DELETE FROM conversations WHERE id = $1', [id]);
        res.json({ message: "Conversation deleted successfully" });
    } catch (error) {
        console.error("Error deleting conversation:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};