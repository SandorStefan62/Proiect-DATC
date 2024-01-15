const jwt = require('jsonwebtoken');

require('dotenv').config();

//checks token validity
function verifyToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: `Unauthorized` });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        //console.log(`Decoded info: ${JSON.stringify(decoded)}`);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: `Invalid token` });
    }
}

module.exports = { verifyToken };