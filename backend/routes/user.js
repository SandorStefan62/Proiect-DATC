const express = require('express');
const bcrypt = require('bcrypt');
const { verifyToken } = require('../middlewares/authMiddleware.js');
const { client } = require('../db.js');
const { ObjectId } = require('mongodb');

const userRouter = express.Router();
const db = client.db('proiect-datc');

//GET /user/getAllUsers: retrieve all user profiles
userRouter.get('/getAllUsers', verifyToken, async (req, res) => {
    try {
        const collection = db.collection('users');

        const users = await collection.find().toArray();

        return res.status(200).json({ users });
    } catch (error) {
        console.error(`Failed to retrieve all users: ${error}`);
        return res.status(500).json({ error: `Internal server error` });
    }
});

//GET /user/profile: retrieve user profile information
userRouter.get('/profile/:id', verifyToken, async (req, res) => {
    try {
        const collection = db.collection('users');
        const userId = req.params.id;
        const user = await collection.findOne({ _id: new ObjectId(userId) });

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
userRouter.put('/profile/:id', verifyToken, async (req, res) => {
    try {
        const collection = db.collection('users');
        const userId = req.params.id;

        //req.body contains updated user data
        const updatedUserData = req.body;

        //deletes password field so it does not save without it being properly encrypted
        if ('password' in updatedUserData) {
            delete updatedUserData.password;
        }

        const result = await collection.updateOne({ _id: new ObjectId(userId) }, { $set: updatedUserData });

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
userRouter.put('/updatePassword/:id', verifyToken, async (req, res) => {
    try {
        const collection = db.collection('users');
        const userId = req.params.id;
        const { newPassword } = req.body;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const result = await collection.updateOne({ _id: new ObjectId(userId) }, { $set: { password: hashedPassword } });

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
userRouter.get('/allergens/:id', verifyToken, async (req, res) => {
    try {
        const collection = db.collection('allergens');
        const userId = req.params.id;
        const userAllergens = await collection.find({ _id: new ObjectId(userId) }).toArray();

        return res.status(200).json(userAllergens);
    } catch (error) {
        console.error(`Failed to retrieve user reported allergens: ${error}`);
        return res.status(500).json({ error: `Internal server error` });
    }
});

//DELETE /user: delete user account
userRouter.delete('/:id', verifyToken, async (req, res) => {
    try {
        const collection = db.collection('users');
        const userId = req.params.id;

        const result = await collection.deleteOne({ _id: new ObjectId(userId) });

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