import { pool } from "../config/db.js";

class ActivitiesService {
    async listAll() {
        const { rows } = await pool.query('SELECT * FROM travel.activities');
        return rows;
    }

    async create({ itinerary_day_id, poi_id, order_index, estimated_cost, currency, start_time, end_time }) {
        try {
            const { rows } = await pool.query(
                `INSERT INTO travel.activities 
                (itinerary_day_id, poi_id, order_index, estimated_cost, currency, start_time, end_time) 
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [itinerary_day_id, poi_id, order_index, estimated_cost, currency, start_time, end_time]
            );
            return rows[0];
        } catch (error) {
            console.error("Error creating activity:", error);
            throw new Error("Error creating activity");
        }
    }

    async delete(id) {
        try {
            await pool.query(`DELETE FROM travel.activities WHERE id = $1`, [id]);
            return true;
        } catch (error) {
            console.error("Error deleting activity:", error);
            throw new Error("Error deleting activity");
        }
    }
}

export default new ActivitiesService();
