import pointsOfInterestService from "../services/points_of_interest.service.js";

export const getPointsOfInterest = async (req, res) => {
    try {
        const pointsOfInterest = await pointsOfInterestService.listAll();
        res.json({ pointsOfInterest });
    } catch (error) {
        console.error("Error fetching points of interest:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createPointsOfInterest = async (req, res) => {
    const { name, category, description, address, latitude, longitude } = req.body;

    if (!name || !category || !description || !address || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newPoint = await pointsOfInterestService.create({ name, category, description, address, latitude, longitude });
        res.status(201).json({ pointOfInterest: newPoint });
    } catch (error) {
        console.error("Error creating point of interest:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deletePointOfInterest = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    try {
        await pointsOfInterestService.delete(id);
        res.json({ message: "Point of interest deleted successfully" });
    } catch (error) {
        console.error("Error deleting point of interest:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};