const User = require('../models/user');
const activeUsers = [];
const timeLimit = 120 * 60 * 1000

function insertActiveUser(user, arrayActiveUsers = activeUsers) {
    arrayActiveUsers.push({ _id: user._id, name: user.name, lastActivity: new Date().getTime() })
    return arrayActiveUsers
}
function getActiveUser() {
    return activeUsers;
}
function removeUserFromActiveUsers(user, arrayActiveUsers = activeUsers) {
    const index = arrayActiveUsers.findIndex(u => u.name === user.name)

    if (index >= 0) arrayActiveUsers.splice(index, 1);

    return arrayActiveUsers;
}
function updateUserFromActiveUsers(user, arrayActiveUsers = activeUsers) {
    const index = arrayActiveUsers.findIndex(u => u.name === user.name)

    if (index >= 0) {
        const thisUser = arrayActiveUsers[index];
        arrayActiveUsers[index] = { ...thisUser, lastActivity: new Date().getTime() }
    }
    return arrayActiveUsers
}
function getTimeFromLastActivity(user) {
    return user.lastActivity ? new Date().getTime() - user.lastActivity : undefined
}
async function logoutUser(userId, io) {
    await User.model.findByIdAndUpdate(userId, { isLogged: false });
    io.emit('users_updated', `User with ID: ${userId} was logout`);
}
async function checkUsersAndLogout(io) {
    const loggedUsersFromDB = await User.model.find({ isLogged: true });
    const all_ActiveUsers = activeUsers
        .filter(user => getTimeFromLastActivity(user) < timeLimit)
        .map(user => user = user.name);

    const usersToLogout = loggedUsersFromDB.filter(user => !all_ActiveUsers.includes(user.name)); // z listy zalogowanych w DB wyrzucamy tych, którzy byli ostatnio aktywni
    usersToLogout.forEach(async user => await User.model.findByIdAndUpdate(user._id, { isLogged: false }));
    if(usersToLogout.length > 0) {
        io.emit('users_updated', `Some users was logout because of non activity`);
    }
}

module.exports = {
    getActiveUser,
    insertActiveUser,
    updateUserFromActiveUsers,
    removeUserFromActiveUsers,
    getTimeFromLastActivity,
    logoutUser,
    checkUsersAndLogout
};
