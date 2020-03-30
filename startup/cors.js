const cors = require("cors");
const config = require('config');
const validOrigin = config.get('validOrigin');


module.exports = function (app) {
  app.use(cors(
    {
      origin: validOrigin
    }
  ));
};
