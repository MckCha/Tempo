import { pool } from "../config/db.js";
import argon2 from 'argon2';

export const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM identity.users');
        res.json({ users: result.rows });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const checkUserExists = async (email) => {
    const result = await pool.query('SELECT id FROM identity.users WHERE email = $1', [email]);
    return result.rows.length > 0;
};

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
        const hashedPassword = await argon2.hash(password);
        await pool.query('INSERT INTO identity.users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const validateUser = async (email, password) => {
    try {
        const userExists = await checkUserExists(email);
        if (!userExists) {
            throw new Error("User not found");
        }
        const validPassword = await argon2.verify(result.rows[0].password, password);
        if (!validPassword) {
            throw new Error("Invalid password");
        }
        return { email };
    } catch (error) {
        console.error("Error validating user:", error);
        throw new Error("Internal server error");
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    try {
        await pool.query('DELETE FROM identity.users WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
