import itineraryDaysService from "../services/itinerary_days.service.js";

export const getItineraryDays = async (req, res) => {
    try {
        const itineraryDays = await itineraryDaysService.listAll();
        res.json({ itineraryDays });
    } catch (error) {
        console.error("Error fetching itinerary days:", error);
        res.status(500).json({ error: "Internal server error" });
    }  
};

export const createItineraryDay = async (req, res) => {
    const { itinerary_id, day_number } = req.body;
    try {
        const newItineraryDay = await itineraryDaysService.create(itinerary_id, day_number);
        return res.status(201).json({ message: "Itinerary day created successfully", newItineraryDay });
    } catch (error) {
        console.error("Error creating itinerary day:", error);
        return res.status(500).json({ error: error.message });
    }
};

export const deleteItineraryDay = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    try {
        await itineraryDaysService.delete(id);
        return res.json({ message: "Itinerary day deleted successfully" });
    } catch (error) {
        if (error .statusCode === 404) {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};