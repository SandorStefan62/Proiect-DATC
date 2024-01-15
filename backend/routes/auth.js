const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { client } = require('../db.js');

const authRouter = express.Router();
const db = client.db('proiect-datc');

//POST: /auth/register: registers new account
authRouter.post("/register", async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: `Incomplete request data` });
        }

        const collection = db.collection('users');

        const existingUser = await collection.findOne({ username });

        if (existingUser) {
            return res.status(409).json({ error: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (role === "admin") {
            newRole = "admin";
        }
        else {
            newRole = "user";
        }

        const newUser = {
            username,
            email,
            password: hashedPassword,
            role: newRole
        }

        await collection.insertOne(newUser);
        return res.status(201).json({ message: `New account created succsessfully` });
    } catch (error) {
        console.error(`Error creating new user: ${error}`);
        return res.status(500).json({ message: `Internal server error` });
    }
});

//POST /auth/login: logins account
authRouter.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(409).json({ message: "Incomplete request data" });
        }

        const collection = db.collection('users');

        const user = await collection.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: `Invalid username` });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: `Invalid credentials` });
        }

        const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        return res.status(201).json({ token: `Bearer ${token}` });
    } catch (error) {
        console.error(`Error logging in: ${error}`);
        return res.status(500).json({ error: `Internal server error` });
    }
});

module.exports = { authRouter };