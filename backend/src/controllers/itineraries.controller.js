import itineraryService from "../services/itineraries.service.js";

export const getItineraries = async (req, res) => {
    try {
        const itineraries = await itineraryService.listAll();
        res.json({ itineraries });
    } catch (error) {
        console.error("Error fetching itineraries:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createItinerary = async (req, res) => {
    const { user_id, title, destination_country, destination_city, trip_type, start_date, end_date } = req.body;

    if (!user_id || !title || !destination_country || !destination_city || !trip_type || !start_date || !end_date) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const itinerary = await itineraryService.create(user_id, title, destination_country, destination_city, trip_type, start_date, end_date);
        res.status(201).json({ message: "Itinerary created successfully", itinerary });
    } catch (error) {
        console.error("Error creating itinerary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteItinerary = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }
    try {
        await itineraryService.delete(id);
        res.json({ message: "Itinerary deleted successfully" });
    } catch (error) {
        console.error("Error deleting itinerary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
