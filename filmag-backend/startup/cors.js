const cors = require("cors");
const config = require('config');
const logger = require("../utils/logger");

module.exports = function (app) {
  const validOrigin = config.get('validOrigin');
  
  app.use( cors({
      origin: validOrigin
    }
  ));

  logger.info(`✔︎ - Setting cors to one specific valid origin: ${validOrigin}`)
};
