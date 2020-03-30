const jobNames = {
    "Operator": 1,
    "Magazynier": 2,
    "Prac. utrz. ruchu": 3,
    "Współdzielone": 4,
    "Koordynator": 10,
    "Mistrz": 11,
    "Kierownik": 12,
    "Dyrektor": 13,
    "Prezes": 14,
    "Admin": 100,
    "SuperAdmin": 1000
}

module.exports = (job) => async function (req, res, next) {
    const userJobNameValue = jobNames[req.user.job];
    if (userJobNameValue < jobNames[job]) return res.status(403).send('Nie masz uprawnień do wykonania tej operacji.');
    next();
}