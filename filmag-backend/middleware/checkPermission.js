const logger = require("../utils/logger");
const jobNames = require("../../filmag-frontend/src/enums/jobNames.json");

module.exports = (job) => async function (req, res, next) {
    const userJobNameValue = jobNames[req.user.job];
    
    if (userJobNameValue < jobNames[job]) {
        logger.warn(`User "${req.user.name}" has no perrmision to do this action`);
        return res.status(403).send('Nie masz uprawnień do wykonania tej operacji');
    }

    next();
};
