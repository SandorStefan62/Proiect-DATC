const express = require('express');
const bcrypt = require('bcrypt');
const { verifyToken } = require('../middlewares/authMiddleware.js');
const { client } = require('../db.js');

const userRouter = express.Router();
const db = client.db('proiect-datc');

//GET /user/profile: retrieve user profile information
userRouter.get('/profile', verifyToken, async (req, res) => {
    try {
        const collection = db.collection('users');
        console.log(req.user.username);
        const user = await collection.findOne({ username: req.user.username });

        if (!user) {
            return res.status(404).json({ error: `User not found` });
        }

        const { password, ...userData } = user;

        return res.status(200).json({ userData });
    } catch (error) {
        console.error(`Error retrieving user data: ${error}`);
        return res.status(500).json({ error: `Internal server error` });
    }
});

//PUt /user/profile: update user profile information
userRouter.put('/profile', verifyToken, async (req, res) => {
    try {
        const collection = db.collection('users');
        const { username } = req.user;

        //req.body contains updated user data
        const updatedUserData = req.body;

        //deletes password field so it does not save without it being properly encrypted
        if ('password' in updatedUserData) {
            delete updatedUserData.password;
        }

        const result = await collection.updateOne({ username }, { $set: updatedUserData });

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: `User not found` });
        }

        return res.status(200).json({ message: `User updated succsessfully` });
    } catch (error) {
        console.error(`Error updating user data: ${error}`);
        return res.status(500).json({ error: `Internal server error` });
    }
});

//PUT /user/updatePassword: update and encrypt user password
userRouter.put('/updatePassword', verifyToken, async (req, res) => {
    try {
        const collection = db.collection('users');
        const { username } = req.user;
        console.log(JSON.stringify(username));
        const { newPassword } = req.body;
        console.log(JSON.stringify(newPassword));

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const result = await collection.updateOne({ username }, { $set: { password: hashedPassword } });

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: `User not found` });
        }
        return res.status(200).json({ message: `Password updated succsessfully` });
    } catch (error) {
        console.error(`Error updating password: ${error}`);
        return res.status(500).json(`Internal server error`);
    }
});

//GET /user/allergens: retrieve all alergens reported by user
userRouter.get('/allergens', verifyToken, async (req, res) => {
    try {
        const collection = db.collection('allergens');
        const userAllergens = await collection.find({ reportedBy: req.user.username }).toArray();

        return res.status(200).json(userAllergens);
    } catch (error) {
        console.error(`Failed to retrieve user reported allergens: ${error}`);
        return res.status(500).json({ error: `Internal server error` });
    }
});

//DELETE /user: delete user account
userRouter.delete('/', verifyToken, async (req, res) => {
    try {
        const collection = db.collection('users');
        const username = req.user;

        const result = await collection.deleteOne({ username });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: `User not found` });
        }

        return res.status(200).json({ message: `User deleted succsessfully` });
    } catch (error) {
        console.error(`Failed to delete user: ${error}`);
        return res.status(500).json({ error: `Internal server error` });
    }
});

module.exports = { userRouter }