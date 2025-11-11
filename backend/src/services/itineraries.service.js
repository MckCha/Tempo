import { pool } from '../config/db.js';

class ItinerariesService {
    async listAll() {
        const { rows } = await pool.query("SELECT * FROM travel.itineraries");
        return rows;
    }

    async create(user_id, title, destination_country, destination_city, trip_type, start_date, end_date) {
        try {
            const { rows } = await pool.query(
                "INSERT INTO travel.itineraries (user_id, title, destination_country, destination_city, trip_type, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                [user_id, title, destination_country, destination_city, trip_type, start_date, end_date]
            );
            return rows[0];
        } catch (error) {
            console.error("Error creating itineraries:", error);
            throw error;
        }
    }

    async delete(id) {
        try {
            await pool.query("DELETE FROM travel.itineraries WHERE id = $1", [id]);
            return true;
        } catch (error) {
            console.error("Error deleting itineraries:", error);
            throw error;
        }
    }
}

export default new ItinerariesService();