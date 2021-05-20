const config = require('config');
const logger = require("../startup/logger");
const validOrigin = config.get('validOrigin');

module.exports = function (req, res, next) {
    const origin =  req.header('origin');
    if (validOrigin !== origin) {
        logger.error(`Request not passed. Request made from invalid domain: "${origin}"`)
        return res.status(401).send("Odmowa dostępu. Niepawidłowe źródło zapytania");
    }
    
    else next();
};
