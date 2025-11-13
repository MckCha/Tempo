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
            if (error.code === '23503') {
                switch (error.constraint) {
                    case 'activities_itinerary_days_id_fkey':
                        throw Object.assign(new Error('Itinerary day not found'), { statusCode: 404 });
                    case 'travel_poi_id_fkey':
                        throw Object.assign(new Error('Point of Interest not found'), { statusCode: 404 });
                    default:
                        throw Object.assign(new Error('Invalid reference: related resource not found'), { statusCode: 400 });
                }
            }
            throw error;
        }
    }

    async delete(id) {
        const { rowCount } = await pool.query("DELETE FROM travel.activities WHERE id = $1", [id]);
        if (rowCount === 0) {
            const error = new Error("Activity not found");
            error.statusCode = 404;
            throw error;
        }
        return true;
    }
}

export default new ActivitiesService();
