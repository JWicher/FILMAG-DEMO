const jobNames = require("../client/src/enums/jobNames.json");

module.exports = (job) => async function (req, res, next) {
    const userJobNameValue = jobNames[req.user.job];
    if (userJobNameValue < jobNames[job]) return res.status(403).send('Nie masz uprawnień do wykonania tej operacji.');
    next();
}