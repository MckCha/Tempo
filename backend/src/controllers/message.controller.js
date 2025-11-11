import messageService from '../services/message.service.js';

export const getMessages = async (req, res) => {
    try {
        const messages = await messageService.listAll();
        return res.json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const createMessage = async (req, res) => {
    const { conversation_id, role, tokens, content } = req.body;

    if (!conversation_id || !role || !tokens || !content) {
        return res.status(400).json({ error: "conversation_id, role, tokens, and content are required" });
    }

    try {
        const newMessage = await messageService.create(conversation_id, role, tokens, content);
        return res.status(201).json({ message: "Message created successfully", data: newMessage });
    } catch (error) {
        console.error("Error creating message:", error);
        return res.status(500).json({ error: error.message });
    }
};

export const deleteMessage = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    try {
        await messageService.delete(id);
        return res.json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("Error deleting message:", error);
        if (error.statusCode === 404) {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};