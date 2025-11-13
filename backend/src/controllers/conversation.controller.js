import conversationService from "../services/conversation.service.js";

export const getConversations = async (req, res) => {
    try {
        const conversations = await conversationService.listAll();
        res.json({ conversations });
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createConversation = async (req, res) => {
    const { user_id, itinerary_id, session_id } = req.body;

    if (!user_id || !itinerary_id || !session_id) {
        return res.status(400).json({ error: "user_id, itinerary_id, and session_id are required" });
    }

    try {
        const conversation = await conversationService.create(user_id, itinerary_id, session_id);
        return res.status(201).json({ message: "Conversation created successfully", conversation });
    } catch (error) {
        console.error("Error creating conversation:", error);
        return res.status(500).json({ error: error.message });
    }
};
    

export const deleteConversation = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    try {
        await conversationService.delete(id);
        return res.json({ message: "Conversation deleted successfully" });
    } catch (error) {
        console.error("Error deleting conversation:", error);
        if (error.statusCode === 404) {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal server error" });
    }

};