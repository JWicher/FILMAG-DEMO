const jwt = require("jsonwebtoken");
const config = require('config');
const logger = require("../utils/logger");

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        logger.warn(`Request not passed. Lack of token`);
        return res.status(401).send("Odmowa dostępu")
    };

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }
    catch (ex) {
        logger.warn(`Request not passed. Invalid token: "${token}"`);
        res.status(400).send('Nieprawidłowy token');
    }
};
