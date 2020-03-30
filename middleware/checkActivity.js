const utils_userActivity = require("../utils/utils_userActivity");
const User = require('../models/user');

const timeLimit = 7200000 // czas w milisekundach;

module.exports = async function (req, res, next) {
    const activeUsers = utils_userActivity.getActiveUser();
    const user = activeUsers.filter(user => user.name === req.user.name)[0];
    if (!user) utils_userActivity.insertActiveUser(req.user)

    else if (user) {
        const timeWithnoActivity = getTimeFromLastActivity(user);
        if (timeWithnoActivity > timeLimit) {
            utils_userActivity.removeUserFromActiveUsers(user);
            await User.model.findByIdAndUpdate(user._id, { isLogged: false });
            return res.status(423).send('Zbyt długi czas bez aktywności. Zaloguj się ponownie.');
        }
        else utils_userActivity.updateUserFromActiveUsers(user)
    }
    next();
}

function getTimeFromLastActivity(user) {
    return user.lastActivity ? new Date().getTime() - user.lastActivity : undefined
}
async function checkUsersAndLogout() {
    const loggedUsersFromDB = await User.model.find({ isLogged: true });
    const all_ActiveUsers =
        utils_userActivity
            .getActiveUser()
            .filter(user => getTimeFromLastActivity(user) < timeLimit).map(user => user = user.name);

    const usersToLogout = loggedUsersFromDB.filter(user => !all_ActiveUsers.includes(user.name)); // z listy zalogowanych w DB wyrzucamy tych, którzy byli ostatnio aktywni
    usersToLogout.forEach(async user => await User.model.findByIdAndUpdate(user._id, { isLogged: false }));
}

setInterval(checkUsersAndLogout, timeLimit + 300000)