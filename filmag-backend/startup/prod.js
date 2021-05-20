const helmet = require('helmet');
const compression = require('compression');
const logger = require("../utils/logger");

module.exports = function(app) {
    app.use( helmet() );
    app.use( compression() );
    logger.info(`✔︎ - Setting helmet and compression`);
};
