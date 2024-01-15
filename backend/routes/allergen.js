const express = require('express');
const moment = require('moment-timezone');
const { verifyToken } = require('../middlewares/authMiddleware.js');
const { client } = require('../db.js');
const { ObjectId } = require('mongodb');

const allergenRouter = express.Router();

const db = client.db('proiect-datc');
const timeZone = `Europe/Bucharest`;

//POST /allergen/addAllergenZone: adds new reported allergen zone
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

//GET /allergen/getAllAllergens: retrieve all reported allergen zones
allergenRouter.get('/getAllAllergens', verifyToken, async (req, res) => {
    try {
        const collection = db.collection('allergens');

        const allergens = await collection.find().toArray();

        return res.status(200).json({ allergens });
    } catch (error) {
        console.error(`Error retrieving allergen zones: ${error}`);
        return res.status(500).json({ error: `Internal server error` });
    }
});

//GET /allergen/:allergen: retrieve all zones with specific allergen
allergenRouter.get('/getAllergenZones/:allergen', verifyToken, async (req, res) => {
    try {
        const collection = db.collection('allergens');
        const allergenType = req.params.allergen;

        const allergens = await collection.find({ allergenType: allergenType }).toArray();

        return res.status(200).json({ allergens });
    } catch (error) {
        console.error(`Error retrieving allergen zones: ${error}`);
        return res.status(500).json({ error: `Internal server error` });
    }
});

//GET /allergen/:id: retrieve details of a specific allergen zone
allergenRouter.get('/getSpecificAllergenZone/:id', verifyToken, async (req, res) => {
    try {
        const collection = db.collection('allergens');
        const allergenId = req.params.id;

        const allergen = await collection.findOne({ _id: new ObjectId(allergenId) });

        return res.status(200).json({ allergen });
    } catch (error) {
        console.error(`Error retrieving allergen zone: ${error}`);
        return res.status(500).json({ error: `Internal server error` });
    }
});

//PUT /allergen/updateAllergen/:id: update a specific allergen zone data
allergenRouter.put('/updateAllergen/:id', verifyToken, async (req, res) => {
    try {
        const collection = db.collection('allergens');
        const allergenId = req.params.id;
        const updatedAllergen = req.body;

        const result = await collection.updateOne({ _id: new ObjectId(allergenId) }, { $set: updatedAllergen });

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: `Allergen zone not found` });
        }

        return res.status(200).json({ message: `Allergen zone updated successfully` });
    } catch (error) {
        console.error(`Error updating allergen zone: ${error}`);
        return res.status(500).json({ error: `Internal server errro` });
    }
});

//DELETE /:id: delete a specific allergen zone
allergenRouter.delete('/:id', verifyToken, async (req, res) => {
    try {
        const collection = db.collection('allergens');
        const allergenId = req.params.id;

        const result = await collection.deleteOne({ _id: new ObjectId(allergenId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: `Allergen zone not found` });
        }

        return res.status(200).json({ message: `Allergen zone deleted succsessfully` });
    } catch (error) {
        console.error(`Error deleting allergen zone: ${error}`);
        return res.status(500).json({ error: `Internal server error` });
    }
});

module.exports = { allergenRouter }