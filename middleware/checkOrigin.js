const config = require('config');
const validOrigin = config.get('validOrigin');

module.exports = function (req, res, next) {
    if (validOrigin !== req.header('origin'))
        return res.status(401).send("Odmowa dostępu. Błąd podmiotu pytającego.");

    else next();
};