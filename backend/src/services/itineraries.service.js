import { pool } from '../config/db.js';

class ItineraryService {
    async listAll() {
        const { rows } = await pool.query("SELECT * FROM travel.itinerary");
        return rows;
    }

    async create(user_id, title, destination_country, destination_city, trip_type, start_date, end_date) {
        try {
            const { rows } = await pool.query(
                "INSERT INTO travel.itinerary (user_id, title, destination_country, destination_city, trip_type, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                [user_id, title, destination_country, destination_city, trip_type, start_date, end_date]
            );
            return rows[0];
        } catch (error) {
            console.error("Error creating itinerary:", error);
            throw error;
        }
    }

    async delete(id) {
        try {
            await pool.query("DELETE FROM travel.itinerary WHERE id = $1", [id]);
            return true;
        } catch (error) {
            console.error("Error deleting itinerary:", error);
            throw error;
        }
    }
}

export default new ItineraryService();