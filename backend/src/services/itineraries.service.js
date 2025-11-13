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

            if (error.code === '23503') {
                if (error.constraint === 'itineraries_user_id_fkey') {
                    const err = new Error("Itinerary not found");
                    err.statusCode = 404;
                    throw err;
                }
                const err = new Error("Invalid reference: related resource not found");
                err.statusCode = 400;
                throw err;
            }
            throw error;
        }
    }

    async delete(id) {
        const { rowCount } = await pool.query("DELETE FROM travel.itineraries WHERE id = $1", [id]);
        if (rowCount === 0) {
            const error = new Error("Itinerary not found");
            error.statusCode = 404;
            throw error;
        }
        return true;
    }
}

export default new ItinerariesService();