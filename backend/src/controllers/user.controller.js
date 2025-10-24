import { pool } from "../config/db.js";

export const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ dbTime: result.rows[0].now });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        result.release();
    }
};

const checkUserExists = async (email) => {
    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    return result.rows.length > 0;
}

export const createUser = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const userExists = await checkUserExists(email);
        if (userExists) {
            return res.status(409).json({ error: "User already exists" });
        }
        // Insert user creation logic here (hash password, insert into DB, etc.)
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }

    

}