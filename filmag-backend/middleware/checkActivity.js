const utils_userActivity = require("../utils/utils_userActivity");
const timeLimit  =125 * 60 * 1000;

module.exports = async function (req, res, next) {
    const activeUsers = utils_userActivity.getActiveUser();
    const user = activeUsers.filter(user => user.name === req.user.name)[0];
    
    if (!user) {
        utils_userActivity.insertActiveUser(req.user);
    }

    else if (user) {
        const timeWithnoActivity = utils_userActivity.getTimeFromLastActivity(user);
        if (timeWithnoActivity > timeLimit) {
            utils_userActivity.removeUserFromActiveUsers(user);
            await utils_userActivity.logoutUser(user.id, req.io);
            return res.status(423).send('Zbyt długi czas bez aktywności. Zaloguj się ponownie.');
        }
        else utils_userActivity.updateUserFromActiveUsers(user)
    }
    next();
};
