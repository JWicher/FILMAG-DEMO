const mongoose = require('mongoose');
const config = require('config');
const logger = require('../utils/logger');

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const db = config.get('db');

module.exports = function () {
    return mongoose.connect(db)
        .then(() => { logger.info(`✔︎ - Successfully connected with DB = ${db.substr(0, 20)}...`) })
        .catch((error) => {
            logger.error(`✖ - Error while connecting to DB; error:  ${error}`)
            throw new Error('FATAL ERROR: Can not connect to DB');
        });
};
