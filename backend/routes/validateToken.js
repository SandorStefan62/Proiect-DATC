const express = require('express');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const validateRouter = express.Router();

// Check token validity
validateRouter.post('/validateToken', (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized', code: 'TOKEN_MISSING' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        return res.status(200).json({ message: 'Token is valid', user: decoded });;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
        } else {
            return res.status(401).json({ error: 'Authentication failed', code: 'AUTH_FAILED' });
        }
    }
});

module.exports = { validateRouter };