const express = require('express');
const moment = require('moment-timezone');
const { verifyToken } = require('../middlewares/authMiddleware.js');
const { client } = require('../db.js');

const allergenRouter = express.Router();

const db = client.db('proiect-datc');
const timeZone = `Europe/Bucharest`;

allergenRouter.post('/addAllergenZone', verifyToken, async (req, res) => {
    try {
        const { latitude, longitude, allergenType } = req.body;

        if (!latitude || !longitude || !allergenType) {
            return res.status(400).json({ error: `Incomplete request data` });
        }

        const collection = db.collection('allergens');
        const reportedBy = req.user.username;
        const timestamp = moment.tz(timeZone).format('DD/MM/YYYY HH:mm');

        const newAllergen = {
            latitude,
            longitude,
            allergenType,
            reportedBy,
            timestamp
        }

        await collection.insertOne(newAllergen);
        return res.status(200).json({ message: `New allergen zone added succsessfully` });

    } catch (error) {
        console.error(`Error sending new allergen zone: ${error}`);
        return res.status(500).json({ error: `Internal server error` });
    }
});

module.exports = { allergenRouter }