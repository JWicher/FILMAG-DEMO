const config = require('config');
const logger = require("../utils/logger");

module.exports = function() {
    if (!config.get('jwtPrivateKey') ) {
        throw new Error('jwtPrivateKey is not defined');
    }

    logger.info(`✔︎ - Checking that jwtPrivateKey exist`)
};
