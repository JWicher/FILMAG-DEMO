const config = require('config');

const ioOptions = {
    cors: {
        origin: config.get('validOrigin')
    }
};

module.exports = {
    ioOptions
};
