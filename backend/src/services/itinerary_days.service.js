import { pool } from "../config/db.js";

class ItineraryDaysService {
    async listAll() {
        const { rows } = await pool.query("SELECT * FROM travel.itinerary_days");
        return rows;
    }

    async create(itinerary_id, day_number) {
        try {
            const { rows } = await pool.query(
                "INSERT INTO travel.itinerary_days (itinerary_id, day_number) VALUES ($1, $2) RETURNING *",
                [itinerary_id, day_number]
            );
            return rows[0];
        } catch (error) {
            console.error("Error creating itinerary day:", error);
            throw new Error("Database error");
        }
    }

    async delete(id) {
        try {
            await pool.query("DELETE FROM travel.itinerary_days WHERE id = $1", [id]);
            return true;
        } catch (error) {
            console.error("Error deleting itinerary day:", error);
            throw new Error("Database error");
        }
    }
}

export default new ItineraryDaysService();