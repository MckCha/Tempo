import activitiesService from '../services/activities.service.js';

export const getActivities = async (req, res) => {
    try {
        const activities = await activitiesService.listAll();
        res.json({ activities });
    } catch (error) {
        console.error("Error fetching activities:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createActivities = async (req, res) => {
    const { itinerary_day_id, poi_id, order_index, estimated_cost, currency, start_time, end_time } = req.body;

    if (!itinerary_day_id || !poi_id || order_index === undefined || !estimated_cost || !currency || !start_time || !end_time) {
        return res.status(400).json({ error: "All activity fields are required" });
    }

    try {
        await activitiesService.create({ itinerary_day_id, poi_id, order_index, estimated_cost, currency, start_time, end_time });
        return res.status(201).json({ message: "Activity created successfully" });
    } catch (error) {
        console.error("Error creating activity:", error);
        return res.status(500).json({ error: error.message });
    }
};

export const deleteActivities = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    try {
        await activitiesService.delete(id);
        return res.json({ message: "Activity deleted successfully" });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};