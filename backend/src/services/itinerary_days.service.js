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
            if (error.code === '23503') {
                if (error.constraint === 'itinerary_days_itinerary_id_fkey') {
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
        const { rowCount } = await pool.query("DELETE FROM travel.itinerary_days WHERE id = $1", [id]);
        if (rowCount === 0) {
            const error = new Error("Itinerary day not found");
            error.statusCode = 404;
            throw error;
        }
        return true;
    }
}

export default new ItineraryDaysService();