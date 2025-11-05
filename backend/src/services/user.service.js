import { pool } from "../config/db.js";
import argon2 from 'argon2';

class UserService {
    async listAll() {
        const { rows } = await pool.query("SELECT * FROM identity.users");
        return rows;
    }
    
    async checkUserExists(email) {
        const { rows } = await pool.query('SELECT id FROM identity.users WHERE email = $1', [email]);
        return rows.length > 0;
    }

    async authenticate(email, password) {
        try {
            this.checkUserExists(email);
            const validPassword = await argon2.verify(result.rows[0].password, password);
            if (!validPassword) {
                throw new Error("Invalid credentials");
            }
            return { authenticated: true };
        } catch (error) {
            console.error("Error authenticating user:", error);
            throw new Error("Internal server error");
        }
    }

    async create(email, password) {
        try {
            const exists = await this.checkUserExists(email);
            if (exists) {
                throw new Error("User already exists");
            }
            const hashedPassword = await argon2.hash(password);
            const { rows } = await pool.query(
                'INSERT INTO identity.users (email, password) VALUES ($1, $2) RETURNING *',
                [email, hashedPassword]
            );
            return rows[0];
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Internal server error");
        }
    }

    async delete(id) {
        try {
            await pool.query("DELETE FROM identity.users WHERE id = $1", [id]);
            return true;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw new Error("Internal server error");
        }
    }

}

export default new UserService();
