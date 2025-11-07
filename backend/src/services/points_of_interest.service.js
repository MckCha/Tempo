import { pool } from "../config/db.js";

class PointsOfInterestService {
    async listAll() {
        const { rows } = await pool.query("SELECT * FROM travel.points_of_interest");
        return rows;
    }

    async create({ name, category, description, address, latitude, longitude }) {
        try {
            const { rows } = await pool.query(
                "INSERT INTO travel.points_of_interest (name, category, description, address, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [name, category, description, address, latitude, longitude]
            );
            return rows[0];
        } catch (error) {
            console.error("Error creating point of interest:", error);
            throw new Error("Internal server error");
        }
    }
    
    async delete(id) {
        try {
            await pool.query("DELETE FROM travel.points_of_interest WHERE id = $1", [id]);
            return true;
        } catch (error) {
            console.error("Error deleting point of interest:", error);
            throw new Error("Internal server error");
        }
    }
}

export default new PointsOfInterestService();